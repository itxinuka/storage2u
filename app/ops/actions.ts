"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

import type { BookingMode } from "@/lib/booking-catalog"
import {
  computeSelectionTotals,
  selectionToLineItems,
} from "@/lib/booking-catalog"
import type { Database } from "@/lib/database.types"
import { isOpsStaff } from "@/lib/ops/auth"
import {
  buildLineItemsFromCounts,
  countsToSelection,
} from "@/lib/ops/order-pricing"
import { ensureBookingUnits } from "@/lib/ops/booking-units"
import type { OpsOrder } from "@/lib/ops/orders-types"
import type { ScheduleStop } from "@/lib/ops/dispatch-types"
import { getOpsHub, getOpsToday, isPastScheduleDate } from "@/lib/ops/schedule-data"
import { parseCampusList } from "@/lib/ops/warehouses-data"
import { createServiceRoleClient } from "@/lib/supabase/service"

type ActionResult = { success: boolean; error?: string }
type BookingItemKind = Database["public"]["Enums"]["booking_item_kind"]

type StopKind = Database["public"]["Enums"]["stop_kind"]

async function requireOpsStaff(): Promise<ActionResult | null> {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !isOpsStaff(user?.publicMetadata?.role)) {
    return { success: false, error: "Unauthorized" }
  }

  return null
}

async function getOrCreateShift(shiftDate: string) {
  if (isPastScheduleDate(shiftDate)) {
    throw new Error("Cannot modify past shifts")
  }

  const supabase = createServiceRoleClient()
  const hub = getOpsHub()

  const { data: existing } = await supabase
    .from("shifts")
    .select("id")
    .eq("shift_date", shiftDate)
    .eq("hub", hub)
    .maybeSingle()

  if (existing) return existing.id

  const { data: created, error } = await supabase
    .from("shifts")
    .insert({ shift_date: shiftDate, hub })
    .select("id")
    .single()

  if (error) throw new Error(error.message)
  return created.id
}

async function findAvailableVehicle(shiftId: string) {
  const supabase = createServiceRoleClient()

  const [{ data: vehicles }, { data: assignments }] = await Promise.all([
    supabase.from("vehicles").select("id, label").eq("active", true).order("label"),
    supabase
      .from("shift_assignments")
      .select("vehicle_id")
      .eq("shift_id", shiftId),
  ])

  const usedVehicleIds = new Set(
    (assignments ?? []).map((row) => row.vehicle_id)
  )

  const available = (vehicles ?? []).find((vehicle) => !usedVehicleIds.has(vehicle.id))
  return available ?? null
}

export async function addStaffToShift(
  staffId: string,
  shiftDate = getOpsToday()
): Promise<ActionResult> {
  const authError = await requireOpsStaff()
  if (authError) return { success: false, error: authError.error }

  if (!staffId) {
    return { success: false, error: "Staff member is required" }
  }

  if (isPastScheduleDate(shiftDate)) {
    return { success: false, error: "Cannot modify past shifts" }
  }

  const supabase = createServiceRoleClient()
  let shiftId: string
  try {
    shiftId = await getOrCreateShift(shiftDate)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Could not create shift",
    }
  }

  const { data: existingAssignment } = await supabase
    .from("shift_assignments")
    .select("id")
    .eq("shift_id", shiftId)
    .eq("staff_id", staffId)
    .maybeSingle()

  if (existingAssignment) {
    return { success: false, error: "Staff member is already on shift" }
  }

  const vehicle = await findAvailableVehicle(shiftId)
  if (!vehicle) {
    return { success: false, error: "No vans available for this shift" }
  }

  const { error } = await supabase.from("shift_assignments").insert({
    shift_id: shiftId,
    staff_id: staffId,
    vehicle_id: vehicle.id,
    status: "available",
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/ops/schedule")
  return { success: true }
}

export type CreateStaffInput = {
  name: string
  role?: "driver" | "mover" | "dispatcher"
  phone?: string
}

export async function createStaffProfile(
  input: CreateStaffInput
): Promise<ActionResult & { id?: string }> {
  const authError = await requireOpsStaff()
  if (authError) return { success: false, error: authError.error }

  const name = input.name.trim()
  if (!name) {
    return { success: false, error: "Name is required" }
  }

  const supabase = createServiceRoleClient()
  const { data: staff, error } = await supabase
    .from("staff")
    .insert({
      name,
      role: input.role ?? "driver",
      phone: input.phone?.trim() || null,
      active: true,
    })
    .select("id")
    .single()

  if (error || !staff) {
    return { success: false, error: error?.message ?? "Could not create staff profile" }
  }

  revalidatePath("/ops/schedule")
  return { success: true, id: staff.id }
}

export async function removeStaffFromShift(
  shiftAssignmentId: string,
  shiftDate = getOpsToday()
): Promise<ActionResult & { unassignedStops?: number }> {
  const authError = await requireOpsStaff()
  if (authError) return { success: false, error: authError.error }

  if (!shiftAssignmentId) {
    return { success: false, error: "Shift assignment is required" }
  }

  if (isPastScheduleDate(shiftDate)) {
    return { success: false, error: "Cannot modify past shifts" }
  }

  const supabase = createServiceRoleClient()

  const { data: shiftAssignment, error: shiftError } = await supabase
    .from("shift_assignments")
    .select("id, shifts(shift_date, hub)")
    .eq("id", shiftAssignmentId)
    .maybeSingle()

  if (shiftError || !shiftAssignment) {
    return { success: false, error: "Shift assignment not found" }
  }

  const shift = shiftAssignment.shifts as { shift_date: string; hub: string } | null
  if (
    !shift ||
    shift.shift_date !== shiftDate ||
    shift.hub !== getOpsHub()
  ) {
    return { success: false, error: "Driver is not on this day's shift" }
  }

  const { count } = await supabase
    .from("dispatch_assignments")
    .select("id", { count: "exact", head: true })
    .eq("shift_assignment_id", shiftAssignmentId)

  const { error } = await supabase
    .from("shift_assignments")
    .delete()
    .eq("id", shiftAssignmentId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/ops/schedule")
  return { success: true, unassignedStops: count ?? 0 }
}

export async function unassignStopFromDriver(
  stopKey: string,
  shiftDate = getOpsToday()
): Promise<ActionResult> {
  const authError = await requireOpsStaff()
  if (authError) return { success: false, error: authError.error }

  if (isPastScheduleDate(shiftDate)) {
    return { success: false, error: "Cannot modify past schedule" }
  }

  const [kind, id] = stopKey.split(":") as [StopKind, string]
  if ((kind !== "pickup" && kind !== "delivery") || !id) {
    return { success: false, error: "Invalid stop" }
  }

  const supabase = createServiceRoleClient()

  if (kind === "pickup") {
    const { data: booking } = await supabase
      .from("bookings")
      .select("id, pickup_date, status")
      .eq("id", id)
      .maybeSingle()

    if (!booking) {
      return { success: false, error: "Pickup not found" }
    }

    if (booking.pickup_date !== shiftDate) {
      return { success: false, error: "Pickup date does not match shift date" }
    }

    if (booking.status === "picked_up" || booking.status === "in_storage") {
      return { success: false, error: "Cannot unassign a completed pickup" }
    }

    const { data: assignment } = await supabase
      .from("dispatch_assignments")
      .select("id, dispatch_status")
      .eq("booking_id", booking.id)
      .eq("stop_kind", "pickup")
      .maybeSingle()

    if (!assignment) {
      return { success: false, error: "Stop is not assigned to a driver" }
    }

    if (assignment.dispatch_status === "done") {
      return { success: false, error: "Cannot unassign a completed stop" }
    }

    const { error } = await supabase
      .from("dispatch_assignments")
      .update({ shift_assignment_id: null, dispatch_status: "scheduled" })
      .eq("id", assignment.id)

    if (error) {
      return { success: false, error: error.message }
    }
  } else {
    const { data: delivery } = await supabase
      .from("delivery_requests")
      .select("id, requested_date, status")
      .eq("id", id)
      .maybeSingle()

    if (!delivery) {
      return { success: false, error: "Delivery not found" }
    }

    if (delivery.requested_date !== shiftDate) {
      return { success: false, error: "Delivery date does not match shift date" }
    }

    if (delivery.status === "delivered") {
      return { success: false, error: "Cannot unassign a completed delivery" }
    }

    const { data: assignment } = await supabase
      .from("dispatch_assignments")
      .select("id, dispatch_status")
      .eq("delivery_request_id", delivery.id)
      .maybeSingle()

    if (!assignment) {
      return { success: false, error: "Stop is not assigned to a driver" }
    }

    if (assignment.dispatch_status === "done") {
      return { success: false, error: "Cannot unassign a completed stop" }
    }

    const { error } = await supabase
      .from("dispatch_assignments")
      .update({ shift_assignment_id: null, dispatch_status: "scheduled" })
      .eq("id", assignment.id)

    if (error) {
      return { success: false, error: error.message }
    }
  }

  revalidatePath("/ops/schedule")
  return { success: true }
}

type AssignStopInput = {
  stopKey: string
  shiftAssignmentId: string
  shiftDate?: string
}

export async function assignStopToDriver(input: AssignStopInput): Promise<ActionResult> {
  const authError = await requireOpsStaff()
  if (authError) return { success: false, error: authError.error }

  const { stopKey, shiftAssignmentId, shiftDate = getOpsToday() } = input
  if (!stopKey || !shiftAssignmentId) {
    return { success: false, error: "Stop and driver are required" }
  }

  if (isPastScheduleDate(shiftDate)) {
    return { success: false, error: "Cannot modify past schedule" }
  }

  const [kind, id] = stopKey.split(":") as [StopKind, string]
  if ((kind !== "pickup" && kind !== "delivery") || !id) {
    return { success: false, error: "Invalid stop" }
  }

  const supabase = createServiceRoleClient()

  const { data: shiftAssignment, error: shiftError } = await supabase
    .from("shift_assignments")
    .select("id, shift_id, shifts(shift_date, hub)")
    .eq("id", shiftAssignmentId)
    .maybeSingle()

  if (shiftError || !shiftAssignment) {
    return { success: false, error: "Driver assignment not found" }
  }

  const shift = shiftAssignment.shifts as { shift_date: string; hub: string } | null
  if (
    !shift ||
    shift.shift_date !== shiftDate ||
    shift.hub !== getOpsHub()
  ) {
    return { success: false, error: "Driver is not on this day's shift" }
  }

  if (kind === "pickup") {
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, pickup_date")
      .eq("id", id)
      .maybeSingle()

    if (bookingError || !booking) {
      return { success: false, error: "Pickup not found" }
    }

    if (booking.pickup_date !== shiftDate) {
      return { success: false, error: "Pickup date does not match shift date" }
    }

    const { data: existing } = await supabase
      .from("dispatch_assignments")
      .select("id")
      .eq("booking_id", booking.id)
      .eq("stop_kind", "pickup")
      .maybeSingle()

    const payload = {
      stop_kind: "pickup" as const,
      booking_id: booking.id,
      delivery_request_id: null,
      shift_assignment_id: shiftAssignmentId,
      dispatch_status: "scheduled" as const,
    }

    const { error } = existing
      ? await supabase
          .from("dispatch_assignments")
          .update(payload)
          .eq("id", existing.id)
      : await supabase.from("dispatch_assignments").insert(payload)

    if (error) {
      return { success: false, error: error.message }
    }
  } else {
    const { data: delivery, error: deliveryError } = await supabase
      .from("delivery_requests")
      .select("id, booking_id, requested_date")
      .eq("id", id)
      .maybeSingle()

    if (deliveryError || !delivery) {
      return { success: false, error: "Delivery not found" }
    }

    if (delivery.requested_date !== shiftDate) {
      return { success: false, error: "Delivery date does not match shift date" }
    }

    const { data: existing } = await supabase
      .from("dispatch_assignments")
      .select("id")
      .eq("delivery_request_id", delivery.id)
      .maybeSingle()

    const payload = {
      stop_kind: "delivery" as const,
      booking_id: delivery.booking_id,
      delivery_request_id: delivery.id,
      shift_assignment_id: shiftAssignmentId,
      dispatch_status: "scheduled" as const,
    }

    const { error } = existing
      ? await supabase
          .from("dispatch_assignments")
          .update(payload)
          .eq("id", existing.id)
      : await supabase.from("dispatch_assignments").insert(payload)

    if (error) {
      return { success: false, error: error.message }
    }
  }

  revalidatePath("/ops/schedule")
  return { success: true }
}

type AddWarehouseInput = {
  name: string
  city: string
  campuses: string
}

export async function addWarehouse(
  input: AddWarehouseInput
): Promise<ActionResult & { id?: string }> {
  const authError = await requireOpsStaff()
  if (authError) return { success: false, error: authError.error }

  const name = input.name.trim()
  if (!name) {
    return { success: false, error: "Facility name is required" }
  }

  const city = input.city.trim() || "—"
  const campuses = parseCampusList(input.campuses)
  const supabase = createServiceRoleClient()

  const { data: warehouse, error } = await supabase
    .from("warehouses")
    .insert({
      name,
      city,
      capacity_pct: 0,
      units_occupied: 0,
      box_count: 0,
    })
    .select("id")
    .single()

  if (error || !warehouse) {
    return { success: false, error: error?.message ?? "Failed to create warehouse" }
  }

  if (campuses.length > 0) {
    const { error: campusError } = await supabase.from("warehouse_campuses").insert(
      campuses.map((campusName) => ({
        warehouse_id: warehouse.id,
        campus_name: campusName,
      }))
    )

    if (campusError) {
      return { success: false, error: campusError.message }
    }
  }

  revalidatePath("/ops/warehouses")
  return { success: true, id: warehouse.id }
}

const UNIVERSITY_SHORT: Record<string, string> = {
  "Memorial University": "Memorial",
  "St. Francis Xavier University": "StFX",
  "Dalhousie University": "Dalhousie",
  "College of the North Atlantic": "CNA",
}

function shortenUniversity(name: string): string {
  return UNIVERSITY_SHORT[name] ?? name
}

function formatScheduleDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatScheduleTime(timeWindow: string): string {
  const first = timeWindow.split(/[–-]/)[0]?.trim()
  return first || timeWindow
}

async function findOrCreateOpsProfile(
  supabase: ReturnType<typeof createServiceRoleClient>,
  customerName: string,
  campus: string
) {
  const name = customerName.trim()

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .ilike("full_name", name)
    .limit(1)
    .maybeSingle()

  if (existing) return existing.id

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({
      clerk_user_id: `ops_${randomUUID()}`,
      full_name: name,
      university: campus,
    })
    .select("id")
    .single()

  if (error || !created) {
    throw new Error(error?.message ?? "Could not create customer profile")
  }

  return created.id
}

export type CreateOrderInput = {
  customerName: string
  type: BookingMode
  campus: string
  timeWindow: string
  address: string
  boxes: number
  items: number
  date: string
  viewDate?: string
}

export type CreateOrderResult =
  | {
      success: true
      bookingId: string
      stopKey: string
      order: OpsOrder
      stop: ScheduleStop | null
    }
  | { success: false; error?: string }

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const authError = await requireOpsStaff()
  if (authError) return { success: false, error: authError.error }

  const customerName = input.customerName.trim()
  if (!customerName) {
    return { success: false, error: "Customer name is required" }
  }
  if (input.boxes <= 0) {
    return { success: false, error: "Boxes must be greater than zero" }
  }
  if (!input.date || !input.timeWindow) {
    return { success: false, error: "Date and time window are required" }
  }

  const viewDate = input.viewDate ?? getOpsToday()
  if (isPastScheduleDate(viewDate)) {
    return { success: false, error: "Cannot create orders for past dates" }
  }

  const supabase = createServiceRoleClient()
  const selection = countsToSelection(input.boxes, input.items)
  const { total } = computeSelectionTotals(selection)
  const lineItems = selectionToLineItems(selection)

  try {
    const profileId = await findOrCreateOpsProfile(
      supabase,
      customerName,
      input.campus.trim()
    )

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        profile_id: profileId,
        mode: input.type,
        pickup_address: input.address.trim() || "—",
        pickup_date: input.type === "pickup" ? input.date : null,
        delivery_date: input.type === "delivery" ? input.date : null,
        university: input.campus.trim(),
        time_window: input.timeWindow,
        monthly_total_cents: total * 100,
        status: input.type === "delivery" ? "in_storage" : "scheduled",
      })
      .select("id, created_at")
      .single()

    if (bookingError || !booking) {
      return {
        success: false,
        error: bookingError?.message ?? "Could not create order",
      }
    }

    const itemRows = lineItems.map((item) => ({
      booking_id: booking.id,
      catalog_id: item.catalog_id,
      name: item.name,
      kind: item.kind as BookingItemKind,
      qty: item.qty,
      unit_price_cents: item.unit_price_cents,
    }))

    const { data: insertedItems, error: itemsError } = await supabase
      .from("booking_items")
      .insert(itemRows)
      .select("id, name, qty")

    if (itemsError || !insertedItems) {
      await supabase.from("bookings").delete().eq("id", booking.id)
      return {
        success: false,
        error: itemsError?.message ?? "Could not save order items",
      }
    }

    const unitsResult = await ensureBookingUnits(
      supabase,
      booking.id,
      insertedItems,
      booking.created_at
    )
    if (unitsResult.error) {
      await supabase.from("bookings").delete().eq("id", booking.id)
      return { success: false, error: unitsResult.error }
    }

    const { data: unitRows } = await supabase
      .from("booking_units")
      .select(
        "id, kind, code, label_name, unit_index, booking_item_id, created_at"
      )
      .eq("booking_id", booking.id)
      .order("kind", { ascending: true })
      .order("unit_index", { ascending: true })

    let stopKey: string
    let deliveryRequestId: string | null = null

    if (input.type === "pickup") {
      stopKey = `pickup:${booking.id}`
      const { error: dispatchError } = await supabase
        .from("dispatch_assignments")
        .insert({
          stop_kind: "pickup",
          booking_id: booking.id,
          delivery_request_id: null,
          shift_assignment_id: null,
          dispatch_status: "scheduled",
        })

      if (dispatchError) {
        await supabase.from("bookings").delete().eq("id", booking.id)
        return { success: false, error: dispatchError.message }
      }
    } else {
      const { data: delivery, error: deliveryError } = await supabase
        .from("delivery_requests")
        .insert({
          booking_id: booking.id,
          profile_id: profileId,
          delivery_address: input.address.trim() || "—",
          requested_date: input.date,
          status: "scheduled",
        })
        .select("id")
        .single()

      if (deliveryError || !delivery) {
        await supabase.from("bookings").delete().eq("id", booking.id)
        return {
          success: false,
          error: deliveryError?.message ?? "Could not schedule delivery stop",
        }
      }

      deliveryRequestId = delivery.id
      stopKey = `delivery:${delivery.id}`

      const { error: dispatchError } = await supabase
        .from("dispatch_assignments")
        .insert({
          stop_kind: "delivery",
          booking_id: booking.id,
          delivery_request_id: delivery.id,
          shift_assignment_id: null,
          dispatch_status: "scheduled",
        })

      if (dispatchError) {
        await supabase.from("delivery_requests").delete().eq("id", delivery.id)
        await supabase.from("bookings").delete().eq("id", booking.id)
        return { success: false, error: dispatchError.message }
      }
    }

    const orderLineItems = buildLineItemsFromCounts(input.boxes, input.items)
    const monthlyTotalCents = total * 100
    const qtyByItemId = new Map(insertedItems.map((item) => [item.id, item.qty]))
    const placedDateLabel = formatScheduleDate(booking.created_at.slice(0, 10))

    const order: OpsOrder = {
      id: booking.id,
      displayId: booking.id.slice(0, 8).toUpperCase(),
      profileId,
      customer: customerName,
      customerEmail: null,
      customerPhone: null,
      university: shortenUniversity(input.campus),
      universityFull: input.campus,
      type: input.type,
      status: input.type === "delivery" ? "in_storage" : "scheduled",
      boxCount: input.boxes,
      itemCount: input.items,
      scheduledDate: formatScheduleDate(input.date),
      monthlyTotalCents,
      monthlyDisplay: `$${total}/mo`,
      createdAt: booking.created_at,
      placedDateLabel,
      lineItems: orderLineItems,
      units: [...(unitRows ?? [])]
        .filter((unit) => unit.kind === "unit")
        .sort((a, b) => {
          if (a.unit_index !== b.unit_index) return a.unit_index - b.unit_index
          return a.code.localeCompare(b.code)
        })
        .map((unit) => ({
        id: unit.id,
        kind: unit.kind,
        code: unit.code,
        labelName: unit.label_name,
        unitIndex: unit.unit_index,
        unitQty: unit.booking_item_id
          ? (qtyByItemId.get(unit.booking_item_id) ?? null)
          : null,
        bookingItemId: unit.booking_item_id,
        createdAt: unit.created_at,
        dateLabel: placedDateLabel,
      })),
      driver: null,
      pickupVariance: null,
      pickupSignoff: null,
    }

    const stop: ScheduleStop | null =
      input.date === viewDate
        ? {
            id: input.type === "pickup" ? booking.id : (deliveryRequestId as string),
            stopKey,
            orderId: booking.id.slice(0, 8).toUpperCase(),
            time: formatScheduleTime(input.timeWindow),
            customer: customerName,
            type: input.type,
            university: shortenUniversity(input.campus),
            address: input.address.trim() || "—",
            boxes: input.boxes,
            driver: null,
            driverAssignmentId: null,
            dispatchAssignmentId: null,
            status: "scheduled",
            pickupVariance: null,
          }
        : null

    revalidatePath("/ops/schedule")
    revalidatePath("/ops/orders")
    revalidatePath("/ops/customers")
    revalidatePath("/ops/warehouses")

    return { success: true, bookingId: booking.id, stopKey, order, stop }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Could not create order",
    }
  }
}

export async function deleteScheduledStop(
  stopKey: string,
  shiftDate = getOpsToday()
): Promise<ActionResult> {
  const authError = await requireOpsStaff()
  if (authError) return { success: false, error: authError.error }

  if (isPastScheduleDate(shiftDate)) {
    return { success: false, error: "Cannot modify past schedule" }
  }

  const [kind, id] = stopKey.split(":") as [StopKind, string]
  if ((kind !== "pickup" && kind !== "delivery") || !id) {
    return { success: false, error: "Invalid stop" }
  }

  const supabase = createServiceRoleClient()

  if (kind === "pickup") {
    const { data: booking } = await supabase
      .from("bookings")
      .select("pickup_date")
      .eq("id", id)
      .maybeSingle()

    if (booking?.pickup_date && isPastScheduleDate(booking.pickup_date)) {
      return { success: false, error: "Cannot modify past schedule" }
    }

    const { error: dispatchError } = await supabase
      .from("dispatch_assignments")
      .delete()
      .eq("booking_id", id)
      .eq("stop_kind", "pickup")

    if (dispatchError) {
      return { success: false, error: dispatchError.message }
    }

    const { error: bookingError } = await supabase
      .from("bookings")
      .update({ pickup_date: null })
      .eq("id", id)

    if (bookingError) {
      return { success: false, error: bookingError.message }
    }
  } else {
    const { data: delivery } = await supabase
      .from("delivery_requests")
      .select("requested_date")
      .eq("id", id)
      .maybeSingle()

    if (delivery?.requested_date && isPastScheduleDate(delivery.requested_date)) {
      return { success: false, error: "Cannot modify past schedule" }
    }

    const { error } = await supabase.from("delivery_requests").delete().eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }
  }

  revalidatePath("/ops/schedule")
  return { success: true }
}

export async function deleteOrder(bookingId: string): Promise<ActionResult> {
  const authError = await requireOpsStaff()
  if (authError) return { success: false, error: authError.error }

  if (!bookingId) {
    return { success: false, error: "Order is required" }
  }

  const supabase = createServiceRoleClient()

  await supabase.from("delivery_requests").delete().eq("booking_id", bookingId)

  const { error } = await supabase.from("bookings").delete().eq("id", bookingId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/ops/orders")
  revalidatePath("/ops/schedule")
  revalidatePath("/ops/customers")
  revalidatePath("/ops/warehouses")
  return { success: true }
}

export async function deleteWarehouse(warehouseId: string): Promise<ActionResult> {
  const authError = await requireOpsStaff()
  if (authError) return { success: false, error: authError.error }

  if (!warehouseId) {
    return { success: false, error: "Warehouse is required" }
  }

  const supabase = createServiceRoleClient()

  const { count, error: countError } = await supabase
    .from("warehouses")
    .select("id", { count: "exact", head: true })

  if (countError) {
    return { success: false, error: countError.message }
  }

  if ((count ?? 0) <= 1) {
    return { success: false, error: "At least one warehouse must remain" }
  }

  const { error } = await supabase.from("warehouses").delete().eq("id", warehouseId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/ops/warehouses")
  return { success: true }
}

type AddBookingBlockInput = {
  blockDate: string
  scope: "entire_day" | "specific_windows"
  timeWindowIds?: string[]
  reason?: string
}

export async function addBookingBlock(
  input: AddBookingBlockInput
): Promise<ActionResult> {
  const authError = await requireOpsStaff()
  if (authError) return { success: false, error: authError.error }

  const { userId } = await auth()
  const blockDate = input.blockDate.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(blockDate)) {
    return { success: false, error: "A valid date is required" }
  }

  const reason = input.reason?.trim() || null
  const supabase = createServiceRoleClient()

  if (input.scope === "entire_day") {
    const { error: clearError } = await supabase
      .from("booking_blocks")
      .delete()
      .eq("block_date", blockDate)

    if (clearError) {
      return { success: false, error: clearError.message }
    }

    const { error } = await supabase.from("booking_blocks").insert({
      block_date: blockDate,
      time_window_id: null,
      reason,
      created_by: userId,
    })

    if (error) {
      return { success: false, error: error.message }
    }
  } else {
    const windowIds = (input.timeWindowIds ?? []).filter((id) =>
      ["morning", "afternoon", "evening"].includes(id)
    )

    if (windowIds.length === 0) {
      return { success: false, error: "Select at least one time window" }
    }

    const { data: existing } = await supabase
      .from("booking_blocks")
      .select("time_window_id")
      .eq("block_date", blockDate)

    const hasFullDay = (existing ?? []).some((row) => row.time_window_id === null)
    if (hasFullDay) {
      return {
        success: false,
        error: "That date is already fully blocked. Remove the full-day block first.",
      }
    }

    const existingIds = new Set(
      (existing ?? [])
        .map((row) => row.time_window_id)
        .filter((id): id is string => Boolean(id))
    )

    const toInsert = windowIds
      .filter((id) => !existingIds.has(id))
      .map((time_window_id) => ({
        block_date: blockDate,
        time_window_id,
        reason,
        created_by: userId,
      }))

    if (toInsert.length === 0) {
      return { success: false, error: "Those time windows are already blocked" }
    }

    const { error } = await supabase.from("booking_blocks").insert(toInsert)

    if (error) {
      return { success: false, error: error.message }
    }
  }

  revalidatePath("/ops/availability")
  return { success: true }
}

export async function removeBookingBlock(blockId: string): Promise<ActionResult> {
  const authError = await requireOpsStaff()
  if (authError) return { success: false, error: authError.error }

  if (!blockId) {
    return { success: false, error: "Block is required" }
  }

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from("booking_blocks").delete().eq("id", blockId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/ops/availability")
  return { success: true }
}
