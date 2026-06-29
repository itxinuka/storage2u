export function contactHref(
  email?: string | null,
  phone?: string | null
): string | null {
  const trimmedEmail = email?.trim()
  if (trimmedEmail) return `mailto:${trimmedEmail}`

  const trimmedPhone = phone?.trim()
  if (!trimmedPhone) return null

  const digits = trimmedPhone.replace(/[^\d+]/g, "")
  return digits ? `sms:${digits}` : null
}
