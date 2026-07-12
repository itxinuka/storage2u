/** Protection plan limits and pricing (contractual, not insurance). */

export const STANDARD_LIMIT = 100
export const PLUS_LIMIT = 500
export const PLUS_FEE_MONTHLY = 20

export const PROTECTION_CATALOG_ID = "protection"

export function formatProtectionLimit(amount: number) {
  return `$${amount}`
}

export const protectionCopy = {
  standardIncluded: `Standard Protection up to ${formatProtectionLimit(STANDARD_LIMIT)} included`,
  optionalUpgrade: `Add Protection Plan — ${formatProtectionLimit(PLUS_FEE_MONTHLY)}/mo · up to ${formatProtectionLimit(PLUS_LIMIT)}`,
  ctaPerk: `Protection up to ${formatProtectionLimit(STANDARD_LIMIT)} · upgrade to ${formatProtectionLimit(PLUS_LIMIT)}`,
  whyTitle: "Climate-controlled & protected",
  whyBody: `Clean, monitored, secure storage — ${formatProtectionLimit(STANDARD_LIMIT)} included per booking, optional upgrade to ${formatProtectionLimit(PLUS_LIMIT)}.`,
  faqQuestion: "Is my stuff protected?",
  faqAnswer: `Every booking includes Standard Protection up to ${formatProtectionLimit(STANDARD_LIMIT)} per customer. You can add the Protection Plan for ${formatProtectionLimit(PLUS_FEE_MONTHLY)}/mo to raise the limit to ${formatProtectionLimit(PLUS_LIMIT)}. See our Terms for exclusions and how to file a claim.`,
  compareUs: `${formatProtectionLimit(STANDARD_LIMIT)} included · ${formatProtectionLimit(PLUS_LIMIT)} optional`,
  compareThem: "Sold separately",
  bookingSidebar: `Standard Protection ${formatProtectionLimit(STANDARD_LIMIT)} included · upgrade to ${formatProtectionLimit(PLUS_LIMIT)}`,
  pricingFootnote: `Standard Protection up to ${formatProtectionLimit(STANDARD_LIMIT)} included. Optional upgrade to ${formatProtectionLimit(PLUS_LIMIT)}.`,
} as const

export function monthlyTotalWithProtection(
  storageTotal: number,
  protectionPlan: boolean
) {
  return storageTotal + (protectionPlan ? PLUS_FEE_MONTHLY : 0)
}
