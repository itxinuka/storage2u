"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { getCatalogEntry } from "@/lib/booking-catalog"
import { monthlyTotalWithProtection } from "@/lib/protection-plan"
import { isOpsStaff } from "@/lib/ops/auth"
import { appendBookingUnits, ensureBookingUnits } from "@/lib/ops/booking-units"
import { refreshSessionCounts } from "@/lib/ops/pickup-data"
import { addToExistingSubscription } from "@/lib/stripe"
import { bookingItemsToStripeLineItems } from "@/lib/stripe-prices"
import { createServiceRoleClient } from "@/lib/supabase/service"

type ActionResult = { success: boolean; error?: string }

type StartPickupResult = ActionResult & { sessionId?: string }

type ScanResult = ActionResult & {
  unitId?: string
  labelName?: string
  alreadyScanned?: boolean
}

type AddUnitsResult = ActionResult & {
  units?: Array<{ id: string; code: string; labelName: string }>
  billingNote?: string | null
}

async function requireOpsStaff(): Promise<ActionResult | null> {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !isOpsStaff(user?.publicMetadata?.role)) {
    return { success: false, error: "Unauthorized" }
  }

  return null
}

function revalidatePickupPaths(bookingId: string) {
  revalidatePath("/ops/schedule")
  revalidatePath("/ops/orders")
  revalidatePath(`/ops/schedule/${bookingId}/pickup`)
  revalidatePath("/admin")
}

export async function startPickupSession(
  bookingId: string
): Promise<StartPickupResult> {
  const authError = await requireOpsStaff()
  if (authError) return authError

  if (!bookingId) {
    return { success: false, error: "Booking ID is required" }
  }

  const { userId } = await auth()
  const supabase = createServiceRoleClient()

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(
      `
      id,
      status,
      booking_items ( id, name, qty )
    `
    )
    .eq("id", bookingId)
    .maybeSingle()

  if (bookingError || !booking) {
    return { success: false, error: bookingError?.message ?? "Booking not found" }
  }

  if (
    booking.status === "cancelled" ||
    booking.status === "delivered" ||
    booking.status === "pending_payment"
  ) {
    return {
      success: false,
      error: `Cannot start pickup for a booking with status "${booking.status}"`,
    }
  }

  const items = (booking.booking_items ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    qty: item.qty,
  }))

  const ensureResult = await ensureBookingUnits(supabase, bookingId, items)
  if (ensureResult.error) {
    return { success: false, error: ensureResult.error }
  }

  const { data: existingSession } = await supabase
    .from("pickup_sessions")
    .select("id")
    .eq("booking_id", bookingId)
    .eq("status", "in_progress")
    .maybeSingle()

  if (existingSession) {
    return { success: true, sessionId: existingSession.id }
  }

  // Reset unit statuses for a fresh session (except keep historical completed sessions).
  await supabase
    .from("booking_units")
    .update({ pickup_status: "expected" })
    .eq("booking_id", bookingId)
    .eq("kind", "unit")
    .neq("pickup_status", "added")

  // Units previously marked added on a prior incomplete attempt stay as added;
  // newly expected units start as expected.
  const { count: expectedCount } = await supabase
    .from("booking_units")
    .select("id", { count: "exact", head: true })
    .eq("booking_id", bookingId)
    .eq("kind", "unit")
    .in("pickup_status", ["expected", "scanned", "missing"])

  const { data: staff } = await supabase
    .from("staff")
    .select("id")
    .eq("clerk_user_id", userId ?? "")
    .maybeSingle()

  const { data: session, error: sessionError } = await supabase
    .from("pickup_sessions")
    .insert({
      booking_id: bookingId,
      staff_id: staff?.id ?? null,
      created_by_clerk_id: userId,
      status: "in_progress",
      expected_count: expectedCount ?? items.reduce((sum, item) => sum + item.qty, 0),
      scanned_count: 0,
      added_count: 0,
      missing_count: 0,
    })
    .select("id")
    .single()

  if (sessionError || !session) {
    return {
      success: false,
      error: sessionError?.message ?? "Failed to start pickup session",
    }
  }

  await refreshSessionCounts(session.id)
  revalidatePickupPaths(bookingId)

  return { success: true, sessionId: session.id }
}

export async function recordUnitScan(
  sessionId: string,
  rawCode: string
): Promise<ScanResult> {
  const authError = await requireOpsStaff()
  if (authError) return authError

  const code = rawCode.trim().toUpperCase()
  if (!sessionId || !code) {
    return { success: false, error: "Session and code are required" }
  }

  const supabase = createServiceRoleClient()

  const { data: session, error: sessionError } = await supabase
    .from("pickup_sessions")
    .select("id, booking_id, status")
    .eq("id", sessionId)
    .maybeSingle()

  if (sessionError || !session) {
    return { success: false, error: sessionError?.message ?? "Session not found" }
  }

  if (session.status !== "in_progress") {
    return { success: false, error: "Pickup session is not active" }
  }

  const { data: unit, error: unitError } = await supabase
    .from("booking_units")
    .select("id, code, label_name, booking_id, pickup_status")
    .eq("code", code)
    .eq("kind", "unit")
    .maybeSingle()

  if (unitError) {
    return { success: false, error: unitError.message }
  }

  if (!unit) {
    return { success: false, error: "Code not found. Use Add unit for unlabeled boxes." }
  }

  if (unit.booking_id !== session.booking_id) {
    return { success: false, error: "This label belongs to a different order" }
  }

  if (unit.pickup_status === "scanned" || unit.pickup_status === "added") {
    return {
      success: true,
      unitId: unit.id,
      labelName: unit.label_name,
      alreadyScanned: true,
    }
  }

  if (unit.pickup_status === "missing") {
    await supabase
      .from("booking_units")
      .update({ pickup_status: "scanned" })
      .eq("id", unit.id)
  } else {
    await supabase
      .from("booking_units")
      .update({ pickup_status: "scanned" })
      .eq("id", unit.id)
  }

  const { error: scanError } = await supabase.from("pickup_unit_scans").upsert(
    {
      session_id: sessionId,
      booking_unit_id: unit.id,
      source: "scan",
    },
    { onConflict: "session_id,booking_unit_id" }
  )

  if (scanError) {
    return { success: false, error: scanError.message }
  }

  await refreshSessionCounts(sessionId)
  revalidatePickupPaths(session.booking_id)

  return {
    success: true,
    unitId: unit.id,
    labelName: unit.label_name,
    alreadyScanned: false,
  }
}

export async function addPickupUnits(
  sessionId: string,
  input: { catalogId: string; qty: number }
): Promise<AddUnitsResult> {
  const authError = await requireOpsStaff()
  if (authError) return authError

  const qty = Math.floor(input.qty)
  if (!sessionId || !input.catalogId || qty < 1) {
    return { success: false, error: "Catalog item and quantity are required" }
  }

  const catalogEntry = getCatalogEntry(input.catalogId)
  if (!catalogEntry) {
    return { success: false, error: "Unknown catalog item" }
  }

  const supabase = createServiceRoleClient()

  const { data: session, error: sessionError } = await supabase
    .from("pickup_sessions")
    .select("id, booking_id, status")
    .eq("id", sessionId)
    .maybeSingle()

  if (sessionError || !session) {
    return { success: false, error: sessionError?.message ?? "Session not found" }
  }

  if (session.status !== "in_progress") {
    return { success: false, error: "Pickup session is not active" }
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(
      `
      id,
      monthly_total_cents,
      protection_plan,
      profile_id,
      booking_items ( id, catalog_id, name, kind, qty, unit_price_cents ),
      profiles ( stripe_customer_id )
    `
    )
    .eq("id", session.booking_id)
    .maybeSingle()

  if (bookingError || !booking) {
    return { success: false, error: bookingError?.message ?? "Booking not found" }
  }

  const existingItem = (booking.booking_items ?? []).find(
    (item) => item.catalog_id === input.catalogId
  )

  let bookingItemId: string
  let itemName = catalogEntry.name

  if (existingItem) {
    bookingItemId = existingItem.id
    itemName = existingItem.name
    const { error: qtyError } = await supabase
      .from("booking_items")
      .update({ qty: existingItem.qty + qty })
      .eq("id", existingItem.id)

    if (qtyError) {
      return { success: false, error: qtyError.message }
    }
  } else {
    const { data: insertedItem, error: insertItemError } = await supabase
      .from("booking_items")
      .insert({
        booking_id: session.booking_id,
        catalog_id: input.catalogId,
        name: catalogEntry.name,
        kind: catalogEntry.kind,
        qty,
        unit_price_cents: catalogEntry.price * 100,
      })
      .select("id, name")
      .single()

    if (insertItemError || !insertedItem) {
      return {
        success: false,
        error: insertItemError?.message ?? "Failed to add line item",
      }
    }
    bookingItemId = insertedItem.id
    itemName = insertedItem.name
  }

  const { units, error: appendError } = await appendBookingUnits(
    supabase,
    session.booking_id,
    [{ bookingItemId, name: itemName, qtyToAdd: qty }]
  )

  if (appendError) {
    return { success: false, error: appendError }
  }

  for (const unit of units) {
    await supabase.from("pickup_unit_scans").insert({
      session_id: sessionId,
      booking_unit_id: unit.id,
      source: "manual_add",
    })
  }

  // Recompute monthly total from all line items + protection.
  const { data: allItems } = await supabase
    .from("booking_items")
    .select("qty, unit_price_cents, catalog_id")
    .eq("booking_id", session.booking_id)

  const storageCents = (allItems ?? []).reduce(
    (sum, item) => sum + item.qty * item.unit_price_cents,
    0
  )
  const protectionPlan = Boolean(booking.protection_plan)
  const monthlyTotalCents =
    monthlyTotalWithProtection(storageCents / 100, protectionPlan) * 100

  await supabase
    .from("bookings")
    .update({ monthly_total_cents: monthlyTotalCents })
    .eq("id", session.booking_id)

  let billingNote: string | null = null
  const profiles = booking.profiles
  const stripeCustomerId = Array.isArray(profiles)
    ? profiles[0]?.stripe_customer_id
    : profiles?.stripe_customer_id

  if (stripeCustomerId) {
    try {
      const lineItems = await bookingItemsToStripeLineItems([
        { catalog_id: input.catalogId, qty },
      ])
      const stripeResult = await addToExistingSubscription(
        stripeCustomerId,
        lineItems
      )
      if (!stripeResult) {
        billingNote =
          "Units added on-site; Stripe subscription not found — office must bill the card on file."
      }
    } catch (err) {
      billingNote =
        err instanceof Error
          ? `Units added; billing failed: ${err.message}`
          : "Units added; billing failed — office follow-up required."
    }
  } else {
    billingNote =
      "Units added on-site; no Stripe customer on file — office must collect payment."
  }

  if (billingNote) {
    const { data: currentSession } = await supabase
      .from("pickup_sessions")
      .select("billing_note")
      .eq("id", sessionId)
      .maybeSingle()

    const merged = [currentSession?.billing_note, billingNote]
      .filter(Boolean)
      .join("\n")

    await supabase
      .from("pickup_sessions")
      .update({ billing_note: merged })
      .eq("id", sessionId)
  }

  await refreshSessionCounts(sessionId)
  revalidatePickupPaths(session.booking_id)

  return {
    success: true,
    units: units.map((unit) => ({
      id: unit.id,
      code: unit.code,
      labelName: unit.label_name,
    })),
    billingNote,
  }
}

export async function markUnitsMissing(
  sessionId: string,
  unitIds: string[],
  reason: string
): Promise<ActionResult> {
  const authError = await requireOpsStaff()
  if (authError) return authError

  if (!sessionId || unitIds.length === 0) {
    return { success: false, error: "Select at least one missing unit" }
  }

  const supabase = createServiceRoleClient()

  const { data: session, error: sessionError } = await supabase
    .from("pickup_sessions")
    .select("id, booking_id, status, variance_notes")
    .eq("id", sessionId)
    .maybeSingle()

  if (sessionError || !session) {
    return { success: false, error: sessionError?.message ?? "Session not found" }
  }

  if (session.status !== "in_progress") {
    return { success: false, error: "Pickup session is not active" }
  }

  const { error: updateError } = await supabase
    .from("booking_units")
    .update({ pickup_status: "missing" })
    .eq("booking_id", session.booking_id)
    .in("id", unitIds)
    .eq("kind", "unit")
    .eq("pickup_status", "expected")

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  const notes = [session.variance_notes, reason.trim() || "Customer short on units"]
    .filter(Boolean)
    .join("\n")

  await supabase
    .from("pickup_sessions")
    .update({
      variance_notes: notes,
      shortfall_acknowledged: true,
    })
    .eq("id", sessionId)

  await refreshSessionCounts(sessionId)
  revalidatePickupPaths(session.booking_id)

  return { success: true }
}

export async function completePickupWithSignoff(
  sessionId: string,
  input: { signerName: string; signatureDataUrl: string }
): Promise<ActionResult> {
  const authError = await requireOpsStaff()
  if (authError) return authError

  const signerName = input.signerName.trim()
  const signatureDataUrl = input.signatureDataUrl.trim()

  if (!sessionId || !signerName || !signatureDataUrl) {
    return { success: false, error: "Name and signature are required" }
  }

  if (!signatureDataUrl.startsWith("data:image/")) {
    return { success: false, error: "Invalid signature image" }
  }

  const supabase = createServiceRoleClient()

  const { data: session, error: sessionError } = await supabase
    .from("pickup_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle()

  if (sessionError || !session) {
    return { success: false, error: sessionError?.message ?? "Session not found" }
  }

  if (session.status !== "in_progress") {
    return { success: false, error: "Pickup session is not active" }
  }

  await refreshSessionCounts(sessionId)

  const { data: freshSession } = await supabase
    .from("pickup_sessions")
    .select("*")
    .eq("id", sessionId)
    .single()

  if (!freshSession) {
    return { success: false, error: "Session not found" }
  }

  const { data: remaining } = await supabase
    .from("booking_units")
    .select("id")
    .eq("booking_id", freshSession.booking_id)
    .eq("kind", "unit")
    .eq("pickup_status", "expected")

  if ((remaining ?? []).length > 0) {
    return {
      success: false,
      error:
        "Scan remaining units or mark them missing before customer sign-off",
    }
  }

  const now = new Date().toISOString()

  const { error: completeError } = await supabase
    .from("pickup_sessions")
    .update({
      status: "completed",
      signer_name: signerName,
      signature_data_url: signatureDataUrl,
      signed_at: now,
      completed_at: now,
    })
    .eq("id", sessionId)

  if (completeError) {
    return { success: false, error: completeError.message }
  }

  const { error: bookingError } = await supabase
    .from("bookings")
    .update({ status: "picked_up" })
    .eq("id", freshSession.booking_id)
    .in("status", ["scheduled", "picked_up"])

  if (bookingError) {
    return { success: false, error: bookingError.message }
  }

  await supabase
    .from("dispatch_assignments")
    .update({ dispatch_status: "done" })
    .eq("booking_id", freshSession.booking_id)
    .eq("stop_kind", "pickup")

  // Bump stops_done on the assigned shift if present.
  const { data: dispatch } = await supabase
    .from("dispatch_assignments")
    .select("shift_assignment_id")
    .eq("booking_id", freshSession.booking_id)
    .eq("stop_kind", "pickup")
    .maybeSingle()

  if (dispatch?.shift_assignment_id) {
    const { data: assignment } = await supabase
      .from("shift_assignments")
      .select("id, stops_done, stops_total")
      .eq("id", dispatch.shift_assignment_id)
      .maybeSingle()

    if (assignment && assignment.stops_done < assignment.stops_total) {
      await supabase
        .from("shift_assignments")
        .update({ stops_done: assignment.stops_done + 1 })
        .eq("id", assignment.id)
    }
  }

  revalidatePickupPaths(freshSession.booking_id)

  return { success: true }
}
