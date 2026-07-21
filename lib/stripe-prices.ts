import "server-only"

import { PROTECTION_CATALOG_ID } from "@/lib/protection-plan"
import { getStripe } from "@/lib/stripe"

/**
 * Price resolution order for each catalog item:
 *   1. STRIPE_PRICE_<ID> env var (explicit override)
 *   2. Stripe price with lookup_key === catalog id (source of truth)
 *   3. Hardcoded sandbox default (dev convenience only)
 *
 * Optional env vars (overrides):
 * - STRIPE_PRICE_BACKPACK, STRIPE_PRICE_MIRROR, STRIPE_PRICE_LARGE_BOX
 * - STRIPE_PRICE_CARRY_ON, STRIPE_PRICE_DUFFEL, STRIPE_PRICE_SKIS
 * - STRIPE_PRICE_FRIDGE, STRIPE_PRICE_MONITOR, STRIPE_PRICE_CHECK_IN
 * - STRIPE_PRICE_DESK_CHAIR, STRIPE_PRICE_BIKE
 * - STRIPE_PRICE_PROTECTION (optional Protection Plan add-on)
 */

export const PROTECTION_PRICE_ENV = "STRIPE_PRICE_PROTECTION"

export const CATALOG_IDS = [
  "backpack",
  "mirror",
  "large_box",
  "carry_on",
  "duffel",
  "skis",
  "fridge",
  "monitor",
  "check_in",
  "desk_chair",
  "bike",
] as const

export type CatalogId = (typeof CATALOG_IDS)[number]

const ENV_KEYS: Record<CatalogId, string> = {
  backpack: "STRIPE_PRICE_BACKPACK",
  mirror: "STRIPE_PRICE_MIRROR",
  large_box: "STRIPE_PRICE_LARGE_BOX",
  carry_on: "STRIPE_PRICE_CARRY_ON",
  duffel: "STRIPE_PRICE_DUFFEL",
  skis: "STRIPE_PRICE_SKIS",
  fridge: "STRIPE_PRICE_FRIDGE",
  monitor: "STRIPE_PRICE_MONITOR",
  check_in: "STRIPE_PRICE_CHECK_IN",
  desk_chair: "STRIPE_PRICE_DESK_CHAIR",
  bike: "STRIPE_PRICE_BIKE",
}

/**
 * Test-mode defaults — updated by `scripts/sync-stripe-catalog.mjs`.
 * Prefer lookup_key resolution or env overrides in production.
 */
const DEFAULT_PRICE_IDS: Record<CatalogId, string> = {
  backpack: "price_1TsXctRt5Yna6OxDxAjUzsA9",
  mirror: "price_1TsXcuRt5Yna6OxDOBrVv1Yt",
  large_box: "price_1TsXcvRt5Yna6OxDHhfjjKd5",
  carry_on: "price_1TsXcwRt5Yna6OxD1hXvuzm2",
  duffel: "price_1TsXcxRt5Yna6OxDEWzJ3sgi",
  skis: "price_1TsXcyRt5Yna6OxDgHH8yXuN",
  fridge: "price_1TsXczRt5Yna6OxDibfzSFx0",
  monitor: "price_1TsXd0Rt5Yna6OxDozqIWnnV",
  check_in: "price_1TsXd1Rt5Yna6OxDwvWetSAj",
  desk_chair: "price_1TsXd2Rt5Yna6OxDOWDEtwdX",
  bike: "price_1TsXd3Rt5Yna6OxDzT5iocRU",
}

/** Cache of catalog id -> resolved Stripe price id for the process lifetime. */
const resolvedPriceCache = new Map<CatalogId, string>()

/** Loads all lookup_key prices from Stripe once and populates the cache. */
async function loadLookupKeyPrices(): Promise<void> {
  const stripe = getStripe()
  if (!stripe) return

  const prices = await stripe.prices.list({
    active: true,
    limit: 100,
    lookup_keys: [...CATALOG_IDS],
  })

  for (const price of prices.data) {
    const key = price.lookup_key
    if (key && CATALOG_IDS.includes(key as CatalogId)) {
      resolvedPriceCache.set(key as CatalogId, price.id)
    }
  }
}

async function resolvePriceId(catalogId: CatalogId): Promise<string | null> {
  const envKey = ENV_KEYS[catalogId]
  const fromEnv = process.env[envKey]?.trim()
  if (fromEnv) return fromEnv

  if (resolvedPriceCache.has(catalogId)) {
    return resolvedPriceCache.get(catalogId) ?? null
  }

  try {
    await loadLookupKeyPrices()
  } catch {
    // Fall through to defaults below.
  }

  if (resolvedPriceCache.has(catalogId)) {
    return resolvedPriceCache.get(catalogId) ?? null
  }

  const fallback = DEFAULT_PRICE_IDS[catalogId]
  return fallback || null
}

export async function getStripePriceId(
  catalogId: string
): Promise<string | null> {
  if (!CATALOG_IDS.includes(catalogId as CatalogId)) return null
  return resolvePriceId(catalogId as CatalogId)
}

export type StripeLineItem = { price: string; quantity: number }

export async function bookingItemsToStripeLineItems(
  items: Array<{ catalog_id: string; qty: number }>
): Promise<StripeLineItem[]> {
  const itemsByPrice = new Map<string, number>()
  for (const item of items) {
    if (item.qty <= 0) continue
    const priceId = await getStripePriceId(item.catalog_id)
    if (!priceId) {
      throw new Error(
        `No Stripe price configured for catalog item "${item.catalog_id}".`
      )
    }
    itemsByPrice.set(priceId, (itemsByPrice.get(priceId) ?? 0) + item.qty)
  }
  return [...itemsByPrice.entries()].map(([price, quantity]) => ({
    price,
    quantity,
  }))
}

let protectionPriceCache: string | null | undefined

export async function getProtectionStripeLineItem(): Promise<StripeLineItem | null> {
  const fromEnv = process.env[PROTECTION_PRICE_ENV]?.trim()
  if (fromEnv) {
    return { price: fromEnv, quantity: 1 }
  }

  if (protectionPriceCache !== undefined) {
    return protectionPriceCache ? { price: protectionPriceCache, quantity: 1 } : null
  }

  const stripe = getStripe()
  if (!stripe) {
    protectionPriceCache = null
    return null
  }

  try {
    const prices = await stripe.prices.list({
      active: true,
      limit: 1,
      lookup_keys: [PROTECTION_CATALOG_ID],
    })
    const id = prices.data[0]?.id ?? null
    protectionPriceCache = id
    return id ? { price: id, quantity: 1 } : null
  } catch {
    protectionPriceCache = null
    return null
  }
}

export async function appendProtectionLineItem(
  items: StripeLineItem[],
  protectionPlan: boolean
): Promise<StripeLineItem[]> {
  if (!protectionPlan) return items

  const protectionItem = await getProtectionStripeLineItem()
  if (!protectionItem) {
    throw new Error(
      "Protection Plan is not configured in Stripe. Set STRIPE_PRICE_PROTECTION or create a price with lookup_key \"protection\"."
    )
  }

  return [...items, protectionItem]
}
