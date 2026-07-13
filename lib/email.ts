import "server-only"

import { Resend } from "resend"

let cached: Resend | null = null

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!cached) {
    cached = new Resend(key)
  }
  return cached
}

const NOTIFY_EMAIL = "hello@storage2u.ca"

export async function sendMoveInQuoteRequestEmail(input: {
  name: string
  email: string
  phone: string
  universityName: string
  campusName: string
  homeAddress: string
  moveInDate: string
  itemsSummary: string
  distanceKm: number | null
}): Promise<boolean> {
  const resend = getResend()
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping move-in quote email.")
    return false
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "Storage2U <hello@storage2u.ca>"

  const distanceLine =
    input.distanceKm != null
      ? `${input.distanceKm.toFixed(1)} km (over auto-booking cap)`
      : "Distance unknown"

  const html = `
    <h2>Move-in custom quote request</h2>
    <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>
    <p><strong>University:</strong> ${escapeHtml(input.universityName)}</p>
    <p><strong>Campus:</strong> ${escapeHtml(input.campusName)}</p>
    <p><strong>Home address:</strong> ${escapeHtml(input.homeAddress)}</p>
    <p><strong>Move-in date:</strong> ${escapeHtml(input.moveInDate)}</p>
    <p><strong>Items:</strong> ${escapeHtml(input.itemsSummary)}</p>
    <p><strong>Distance:</strong> ${escapeHtml(distanceLine)}</p>
  `

  try {
    await resend.emails.send({
      from,
      to: NOTIFY_EMAIL,
      replyTo: input.email,
      subject: `Move-in quote request — ${input.name}`,
      html,
    })
    return true
  } catch (err) {
    console.error(
      "[email] move-in quote request failed:",
      err instanceof Error ? err.message : err
    )
    return false
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
