import "server-only"

import type { SelectionMap } from "@/lib/booking-catalog"

/**
 * Required env vars:
 * - STRIPE_SECRET_KEY — server API key
 * - STRIPE_WEBHOOK_SECRET — webhook signing secret
 * - STRIPE_PRICE_SMALL, STRIPE_PRICE_MEDIUM, STRIPE_PRICE_LARGE
 * - STRIPE_PRICE_MATTRESS, STRIPE_PRICE_FRIDGE, STRIPE_PRICE_BIKE
 * - STRIPE_PRICE_SUITCASE, STRIPE_PRICE_BACKPACK, STRIPE_PRICE_MONITOR
 */

export const CATALOG_IDS = [
  "small",
  "medium",
  "large",
  "mattress",
  "fridge",
  "bike",
  "suitcase",
  "backpack",
  "monitor",
] as const

export type CatalogId = (typeof CATALOG_IDS)[number]

const ENV_KEYS: Record<CatalogId, string> = {
  small: "STRIPE_PRICE_SMALL",
  medium: "STRIPE_PRICE_MEDIUM",
  large: "STRIPE_PRICE_LARGE",
  mattress: "STRIPE_PRICE_MATTRESS",
  fridge: "STRIPE_PRICE_FRIDGE",
  bike: "STRIPE_PRICE_BIKE",
  suitcase: "STRIPE_PRICE_SUITCASE",
  backpack: "STRIPE_PRICE_BACKPACK",
  monitor: "STRIPE_PRICE_MONITOR",
}

/** Test-mode defaults (sandbox) — override via env in production. */
const DEFAULT_PRICE_IDS: Record<CatalogId, string> = {
  small: "price_1TpI8URt5Yna6OxD7C1hRaQX",
  medium: "price_1TpI0dRt5Yna6OxDjhDUe3Iq",
  large: "price_1TpI1FRt5Yna6OxD1j2gTenG",
  mattress: "price_1TpI8URt5Yna6OxD4F3JWYM5",
  fridge: "price_1TpI8VRt5Yna6OxDhaLeAlKP",
  bike: "price_1TpI8VRt5Yna6OxDBbhldQHd",
  suitcase: "price_1TpI8YRt5Yna6OxDk5I7t4Ji",
  backpack: "price_1TpI8YRt5Yna6OxD18pjwJnd",
  monitor: "price_1TpI8YRt5Yna6OxDAkQ1Drfp",
}

function resolvePriceId(catalogId: CatalogId): string | null {
  const envKey = ENV_KEYS[catalogId]
  const fromEnv = process.env[envKey]?.trim()
  if (fromEnv) return fromEnv
  if (process.env.NODE_ENV === "production") return null
  return DEFAULT_PRICE_IDS[catalogId]
}

export function getStripePriceId(catalogId: string): string | null {
  if (!CATALOG_IDS.includes(catalogId as CatalogId)) return null
  return resolvePriceId(catalogId as CatalogId)
}

export type StripeLineItem = { price: string; quantity: number }

export function selectionToStripeLineItems(
  selection: SelectionMap
): StripeLineItem[] {
  const items: StripeLineItem[] = []
  for (const [catalogId, qty] of Object.entries(selection)) {
    if (qty <= 0) continue
    const priceId = getStripePriceId(catalogId)
    if (!priceId) {
      throw new Error(`No Stripe price configured for catalog item "${catalogId}".`)
    }
    items.push({ price: priceId, quantity: qty })
  }
  return items
}

export function bookingItemsToStripeLineItems(
  items: Array<{ catalog_id: string; qty: number }>
): StripeLineItem[] {
  const itemsByPrice = new Map<string, number>()
  for (const item of items) {
    if (item.qty <= 0) continue
    const priceId = getStripePriceId(item.catalog_id)
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
