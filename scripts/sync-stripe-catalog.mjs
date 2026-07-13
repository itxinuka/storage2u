/**
 * Sync Storage2U catalog products & recurring CAD prices in Stripe.
 *
 * Usage: node --env-file=.env.local scripts/sync-stripe-catalog.mjs
 *
 * For each catalog item:
 *   - Find or create a Product (metadata.catalog_id)
 *   - Create an active monthly CAD price with lookup_key === catalog_id
 *   - transfer_lookup_key moves the key off any previous price
 * Archives obsolete products (mattress, small/medium box, generic suitcase).
 */

import Stripe from "stripe"

const CATALOG = [
  { id: "backpack", name: "Backpack", unitAmount: 500 },
  { id: "mirror", name: "Full Length Mirror", unitAmount: 1000 },
  { id: "large_box", name: "Large Box", unitAmount: 2000 },
  { id: "carry_on", name: "Carry-On Suitcase", unitAmount: 2000 },
  { id: "duffel", name: "Duffel Bag", unitAmount: 2000 },
  { id: "skis", name: "Skis / Snowboard", unitAmount: 2500 },
  { id: "fridge", name: "Mini Fridge", unitAmount: 2500 },
  { id: "monitor", name: "Monitor / TV (boxed)", unitAmount: 2500 },
  { id: "check_in", name: "Check-In Suitcase", unitAmount: 3000 },
  { id: "desk_chair", name: "Desk Chair", unitAmount: 3000 },
  { id: "bike", name: "Bicycle", unitAmount: 4000 },
]

const ARCHIVE_NAME_MATCHERS = [
  /^mattress$/i,
  /^small box$/i,
  /^medium box$/i,
  /^suitcase$/i, // generic suitcase replaced by carry-on / check-in
]

const key = process.env.STRIPE_SECRET_KEY
if (!key) {
  console.error("STRIPE_SECRET_KEY is required")
  process.exit(1)
}

const stripe = new Stripe(key)

async function findProductByCatalogId(catalogId) {
  const existing = await stripe.products.search({
    query: `metadata['catalog_id']:'${catalogId}'`,
    limit: 1,
  })
  return existing.data[0] ?? null
}

async function findProductByName(name) {
  const existing = await stripe.products.search({
    query: `name:'${name.replace(/'/g, "\\'")}' AND active:'true'`,
    limit: 1,
  })
  return existing.data[0] ?? null
}

async function ensureProduct(item) {
  let product =
    (await findProductByCatalogId(item.id)) ?? (await findProductByName(item.name))

  if (!product) {
    // Reuse renamed legacy products when names are close.
    const aliases = {
      fridge: ["Mini-fridge", "Mini Fridge"],
      monitor: ["TV / Monitor", "Monitor / TV (boxed)"],
      large_box: ["Large box", "Large Box (18x18x16)"],
      backpack: ["Backpack"],
      bike: ["Bicycle"],
    }
    for (const alias of aliases[item.id] ?? []) {
      product = await findProductByName(alias)
      if (product) break
    }
  }

  if (product) {
    product = await stripe.products.update(product.id, {
      name: item.name,
      active: true,
      metadata: { catalog_id: item.id },
    })
    console.log(`Updated product ${product.id} (${item.id})`)
  } else {
    product = await stripe.products.create({
      name: item.name,
      metadata: { catalog_id: item.id },
    })
    console.log(`Created product ${product.id} (${item.id})`)
  }

  const price = await stripe.prices.create({
    product: product.id,
    currency: "cad",
    unit_amount: item.unitAmount,
    recurring: { interval: "month" },
    lookup_key: item.id,
    transfer_lookup_key: true,
    nickname: `${item.name} monthly`,
    metadata: { catalog_id: item.id },
  })

  await stripe.products.update(product.id, { default_price: price.id })
  console.log(`  Price ${price.id} · $${(item.unitAmount / 100).toFixed(0)}/mo · lookup_key=${item.id}`)

  return { catalogId: item.id, productId: product.id, priceId: price.id }
}

async function archiveObsolete() {
  const products = await stripe.products.list({ active: true, limit: 100 })
  const keepIds = new Set(CATALOG.map((c) => c.id))

  for (const product of products.data) {
    const catalogId = product.metadata?.catalog_id
    if (catalogId === "protection") continue
    if (catalogId && keepIds.has(catalogId)) continue

    const shouldArchive =
      ARCHIVE_NAME_MATCHERS.some((re) => re.test(product.name)) ||
      (catalogId &&
        ["mattress", "small", "medium", "large", "suitcase"].includes(catalogId))

    if (!shouldArchive) continue

    await stripe.products.update(product.id, { active: false })
    console.log(`Archived obsolete product ${product.id} (${product.name})`)
  }
}

const results = []
for (const item of CATALOG) {
  results.push(await ensureProduct(item))
}
await archiveObsolete()

console.log("\nDEFAULT_PRICE_IDS snippet:\n")
console.log(
  results
    .map((r) => `  ${r.catalogId}: "${r.priceId}",`)
    .join("\n")
)
