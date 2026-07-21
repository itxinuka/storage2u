import type { Database } from "@/lib/database.types"
import { BOOKING_CATALOG } from "@/lib/booking-catalog"
import { createServiceRoleClient } from "@/lib/supabase/service"

export type PickupUnitStatus =
  Database["public"]["Enums"]["booking_unit_pickup_status"]

export type PickupVariance = "exact" | "short" | "over" | "mixed" | null

export type PickupSessionUnit = {
  id: string
  code: string
  labelName: string
  unitIndex: number
  bookingItemId: string | null
  pickupStatus: PickupUnitStatus
  kind: "box" | "item" | null
}

export type PickupSessionSummary = {
  id: string
  bookingId: string
  status: Database["public"]["Enums"]["pickup_session_status"]
  expectedCount: number
  scannedCount: number
  addedCount: number
  missingCount: number
  shortfallAcknowledged: boolean
  varianceNotes: string | null
  billingNote: string | null
  signerName: string | null
  signatureDataUrl: string | null
  signedAt: string | null
  completedAt: string | null
  createdAt: string
}

export type PickupPageData = {
  bookingId: string
  displayId: string
  customerName: string
  address: string
  university: string
  bookingStatus: Database["public"]["Enums"]["booking_status"]
  session: PickupSessionSummary
  units: PickupSessionUnit[]
  catalog: Array<{ id: string; name: string; kind: "box" | "item"; price: number }>
}

export function derivePickupVariance(session: {
  expectedCount: number
  scannedCount: number
  addedCount: number
  missingCount: number
  status: string
}): PickupVariance {
  if (session.status !== "completed") return null
  const hasShort = session.missingCount > 0
  const hasOver = session.addedCount > 0
  if (hasShort && hasOver) return "mixed"
  if (hasShort) return "short"
  if (hasOver) return "over"
  return "exact"
}

function mapSession(
  row: Database["public"]["Tables"]["pickup_sessions"]["Row"]
): PickupSessionSummary {
  return {
    id: row.id,
    bookingId: row.booking_id,
    status: row.status,
    expectedCount: row.expected_count,
    scannedCount: row.scanned_count,
    addedCount: row.added_count,
    missingCount: row.missing_count,
    shortfallAcknowledged: row.shortfall_acknowledged,
    varianceNotes: row.variance_notes,
    billingNote: row.billing_note,
    signerName: row.signer_name,
    signatureDataUrl: row.signature_data_url,
    signedAt: row.signed_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
  }
}

export async function refreshSessionCounts(
  sessionId: string
): Promise<{ error: string | null }> {
  const supabase = createServiceRoleClient()

  const { data: session, error: sessionError } = await supabase
    .from("pickup_sessions")
    .select("booking_id")
    .eq("id", sessionId)
    .maybeSingle()

  if (sessionError || !session) {
    return { error: sessionError?.message ?? "Session not found" }
  }

  const { data: units, error: unitsError } = await supabase
    .from("booking_units")
    .select("pickup_status")
    .eq("booking_id", session.booking_id)
    .eq("kind", "unit")

  if (unitsError) {
    return { error: unitsError.message }
  }

  let scannedCount = 0
  let addedCount = 0
  let missingCount = 0
  let expectedRemaining = 0

  for (const unit of units ?? []) {
    if (unit.pickup_status === "scanned") scannedCount += 1
    else if (unit.pickup_status === "added") addedCount += 1
    else if (unit.pickup_status === "missing") missingCount += 1
    else if (unit.pickup_status === "expected") expectedRemaining += 1
  }

  // expected_count = units that were on the order at session start style:
  // scanned (from original) + missing + still expected. Added are extras.
  const expectedCount = scannedCount + missingCount + expectedRemaining

  const { error: updateError } = await supabase
    .from("pickup_sessions")
    .update({
      expected_count: expectedCount,
      scanned_count: scannedCount + addedCount,
      added_count: addedCount,
      missing_count: missingCount,
    })
    .eq("id", sessionId)

  if (updateError) {
    return { error: updateError.message }
  }

  return { error: null }
}

export async function getPickupPageData(
  bookingId: string
): Promise<PickupPageData | null> {
  const supabase = createServiceRoleClient()

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(
      `
      id,
      status,
      university,
      residence,
      pickup_address,
      profiles ( full_name ),
      booking_units (
        id,
        code,
        label_name,
        unit_index,
        booking_item_id,
        pickup_status,
        kind
      ),
      booking_items (
        id,
        kind
      )
    `
    )
    .eq("id", bookingId)
    .maybeSingle()

  if (bookingError || !booking) return null

  const { data: sessionRow } = await supabase
    .from("pickup_sessions")
    .select("*")
    .eq("booking_id", bookingId)
    .eq("status", "in_progress")
    .maybeSingle()

  if (!sessionRow) return null

  const itemKindById = new Map(
    (booking.booking_items ?? []).map((item) => [item.id, item.kind as "box" | "item"])
  )

  const profiles = booking.profiles
  const customerName = Array.isArray(profiles)
    ? profiles[0]?.full_name ?? "—"
    : profiles?.full_name ?? "—"

  const units: PickupSessionUnit[] = (booking.booking_units ?? [])
    .filter((unit) => unit.kind === "unit")
    .map((unit) => ({
      id: unit.id,
      code: unit.code,
      labelName: unit.label_name,
      unitIndex: unit.unit_index,
      bookingItemId: unit.booking_item_id,
      pickupStatus: unit.pickup_status,
      kind: unit.booking_item_id
        ? itemKindById.get(unit.booking_item_id) ?? null
        : null,
    }))
    .sort((a, b) => a.code.localeCompare(b.code))

  return {
    bookingId: booking.id,
    displayId: booking.id.slice(0, 8).toUpperCase(),
    customerName,
    address:
      [booking.residence, booking.pickup_address].filter(Boolean).join(" · ") ||
      booking.pickup_address ||
      "—",
    university: booking.university ?? "—",
    bookingStatus: booking.status,
    session: mapSession(sessionRow),
    units,
    catalog: BOOKING_CATALOG.map((entry) => ({
      id: entry.id,
      name: entry.name,
      kind: entry.kind,
      price: entry.price,
    })),
  }
}
