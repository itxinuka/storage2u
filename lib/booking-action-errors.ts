/** Map cryptic API errors to user-friendly booking/checkout messages. */
export function humanizeBookingError(
  message: string | undefined,
  fallback: string
): string {
  if (!message?.trim()) return fallback

  const normalized = message.trim()
  const lower = normalized.toLowerCase()

  if (lower === "not found" || lower.includes("not found")) {
    return "We couldn't complete checkout. Please refresh the page and try again. If it keeps happening, contact hello@storage2u.ca."
  }

  if (lower.includes("missing supabase service role")) {
    return "Billing is not configured on the server. Please try again later."
  }

  if (lower.includes("row-level security")) {
    return "We couldn't save your account. Please sign out, sign back in, and try again."
  }

  return normalized
}
