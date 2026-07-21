import type {
  DispatchStopStatus,
  SchedulePageData,
  ScheduleStop,
  ScheduleStopType,
  ShiftDriver,
  ShiftDriverStatus,
  StaffRosterMember,
  UpcomingDay,
} from "@/lib/ops/dispatch-types"
import { derivePickupVariance } from "@/lib/ops/pickup-data"
import { createServiceRoleClient } from "@/lib/supabase/service"

type DispatchAssignmentRow = {
  id: string
  stop_kind: ScheduleStopType
  booking_id: string
  delivery_request_id: string | null
  shift_assignment_id: string | null
  dispatch_status: DispatchStopStatus
  scheduled_time: string | null
  shift_assignments: {
    id: string
    vehicles: { label: string } | null
  } | null
}

type ShiftAssignmentRow = {
  id: string
  staff_id: string | null
  status: ShiftDriverStatus
  stops_total: number
  stops_done: number
  staff: { id: string; name: string } | null
  vehicles: { label: string } | null
}

const UNIVERSITY_SHORT: Record<string, string> = {
  "Memorial University": "Memorial",
  "St. Francis Xavier University": "StFX",
  "Dalhousie University": "Dalhousie",
  "College of the North Atlantic": "CNA",
}

export function getOpsToday(): string {
  return new Date().toLocaleDateString("en-CA")
}

export function getOpsHub(): string {
  return process.env.OPS_HUB_NAME ?? "Vancouver hub"
}

export function formatOpsTodayLabel(date = new Date()): string {
  return date.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function parseScheduleDate(input?: string | null): string {
  const today = getOpsToday()
  if (!input || !/^\d{4}-\d{2}-\d{2}$/.test(input)) return today
  return input
}

export function isPastScheduleDate(date: string): boolean {
  return date < getOpsToday()
}

export function formatScheduleDateLabel(dateStr: string): string {
  return formatOpsTodayLabel(new Date(`${dateStr}T12:00:00`))
}

function shortenUniversity(name: string | null | undefined): string {
  if (!name) return "—"
  return UNIVERSITY_SHORT[name] ?? name
}

function profileName(
  profiles: { full_name: string | null } | { full_name: string | null }[] | null
): string {
  if (!profiles) return "—"
  if (Array.isArray(profiles)) return profiles[0]?.full_name ?? "—"
  return profiles.full_name ?? "—"
}

function countBoxes(
  items: Array<{ kind: string; qty: number }> | null | undefined
): number {
  return (items ?? [])
    .filter((item) => item.kind === "box")
    .reduce((sum, item) => sum + item.qty, 0)
}

function formatScheduleTime(
  timeWindow: string | null | undefined,
  override: string | null | undefined
): string {
  if (override) return override
  if (!timeWindow) return "—"
  const first = timeWindow.split(/[–-]/)[0]?.trim()
  return first || timeWindow
}

function derivePickupStatus(
  bookingStatus: string,
  assigned: DispatchStopStatus | null
): DispatchStopStatus {
  if (bookingStatus === "picked_up" || bookingStatus === "in_storage") return "done"
  if (assigned === "out") return "out"
  return assigned ?? "scheduled"
}

function deriveDeliveryStatus(
  deliveryStatus: string,
  assigned: DispatchStopStatus | null
): DispatchStopStatus {
  if (deliveryStatus === "delivered") return "done"
  if (deliveryStatus === "in_transit") return "out"
  return assigned ?? "scheduled"
}

export function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T12:00:00`)
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString("en-CA")
}

function formatUpcomingLabel(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

async function ensureShift(
  supabase: ReturnType<typeof createServiceRoleClient>,
  shiftDate: string,
  hub: string
) {
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

  if (error) throw error
  return created.id
}

export async function getSchedulePageData(
  selectedDate = getOpsToday()
): Promise<SchedulePageData> {
  const supabase = createServiceRoleClient()
  const today = getOpsToday()
  const hub = getOpsHub()
  const dateLabel = formatScheduleDateLabel(selectedDate)
  const isPastDate = isPastScheduleDate(selectedDate)
  const isToday = selectedDate === today

  if (!isPastDate) {
    await ensureShift(supabase, selectedDate, hub)
  }

  const [
    pickupsResult,
    deliveriesResult,
    dispatchResult,
    shiftResult,
    staffResult,
    upcomingPickupsResult,
    upcomingDeliveriesResult,
    pickupSessionsResult,
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select(
        `
        id,
        pickup_date,
        pickup_address,
        university,
        residence,
        time_window,
        status,
        profiles ( full_name ),
        booking_items ( kind, qty )
      `
      )
      .eq("pickup_date", selectedDate)
      .neq("status", "cancelled"),
    supabase
      .from("delivery_requests")
      .select(
        `
        id,
        booking_id,
        requested_date,
        delivery_address,
        status,
        bookings (
          university,
          time_window,
          profiles ( full_name ),
          booking_items ( kind, qty )
        )
      `
      )
      .eq("requested_date", selectedDate)
      .neq("status", "cancelled"),
    supabase
      .from("dispatch_assignments")
      .select(
        `
        id,
        stop_kind,
        booking_id,
        delivery_request_id,
        shift_assignment_id,
        dispatch_status,
        scheduled_time,
        shift_assignments (
          id,
          vehicles ( label )
        )
      `
      ),
    supabase
      .from("shifts")
      .select(
        `
        id,
        shift_assignments (
          id,
          staff_id,
          status,
          stops_total,
          stops_done,
          staff ( id, name ),
          vehicles ( label )
        )
      `
      )
      .eq("shift_date", selectedDate)
      .eq("hub", hub),
    supabase
      .from("staff")
      .select("id, name, role, phone")
      .eq("active", true)
      .order("name"),
    supabase
      .from("bookings")
      .select("pickup_date, booking_items(kind, qty)")
      .gte("pickup_date", addDays(selectedDate, 1))
      .lte("pickup_date", addDays(selectedDate, 3))
      .neq("status", "cancelled"),
    supabase
      .from("delivery_requests")
      .select("requested_date, bookings(booking_items(kind, qty))")
      .gte("requested_date", addDays(selectedDate, 1))
      .lte("requested_date", addDays(selectedDate, 3))
      .neq("status", "cancelled"),
    supabase
      .from("pickup_sessions")
      .select(
        "booking_id, status, expected_count, scanned_count, added_count, missing_count, completed_at"
      )
      .eq("status", "completed")
      .order("completed_at", { ascending: false }),
  ])

  const pickupVarianceByBooking = new Map<
    string,
    NonNullable<ScheduleStop["pickupVariance"]>
  >()
  for (const row of pickupSessionsResult.data ?? []) {
    if (pickupVarianceByBooking.has(row.booking_id)) continue
    const variance = derivePickupVariance({
      expectedCount: row.expected_count,
      scannedCount: row.scanned_count,
      addedCount: row.added_count,
      missingCount: row.missing_count,
      status: row.status,
    })
    if (variance) pickupVarianceByBooking.set(row.booking_id, variance)
  }
  const dispatchRows = (dispatchResult.data as DispatchAssignmentRow[] | null) ?? []
  const pickupAssignments = new Map(
    dispatchRows
      .filter((row) => row.stop_kind === "pickup")
      .map((row) => [row.booking_id, row])
  )
  const deliveryAssignments = new Map(
    dispatchRows
      .filter((row) => row.delivery_request_id)
      .map((row) => [row.delivery_request_id as string, row])
  )

  const schedule: ScheduleStop[] = []

  for (const row of pickupsResult.data ?? []) {
    const assignment = pickupAssignments.get(row.id)
    const driverLabel =
      assignment?.shift_assignments?.vehicles?.label ?? null

    schedule.push({
      id: row.id,
      stopKey: `pickup:${row.id}`,
      orderId: row.id.slice(0, 8).toUpperCase(),
      time: formatScheduleTime(row.time_window, assignment?.scheduled_time),
      customer: profileName(row.profiles),
      type: "pickup",
      university: shortenUniversity(row.university),
      address: [row.residence, row.pickup_address].filter(Boolean).join(" · ") || row.pickup_address,
      boxes: countBoxes(row.booking_items),
      driver: driverLabel,
      driverAssignmentId: assignment?.shift_assignment_id ?? null,
      dispatchAssignmentId: assignment?.id ?? null,
      status: derivePickupStatus(row.status, assignment?.dispatch_status ?? null),
      pickupVariance: pickupVarianceByBooking.get(row.id) ?? null,
    })
  }

  for (const row of deliveriesResult.data ?? []) {
    const booking = row.bookings
    const assignment = deliveryAssignments.get(row.id)
    const driverLabel =
      assignment?.shift_assignments?.vehicles?.label ?? null

    schedule.push({
      id: row.id,
      stopKey: `delivery:${row.id}`,
      orderId: row.booking_id.slice(0, 8).toUpperCase(),
      time: formatScheduleTime(booking?.time_window, assignment?.scheduled_time),
      customer: profileName(booking?.profiles ?? null),
      type: "delivery",
      university: shortenUniversity(booking?.university),
      address: row.delivery_address,
      boxes: countBoxes(booking?.booking_items),
      driver: driverLabel,
      driverAssignmentId: assignment?.shift_assignment_id ?? null,
      dispatchAssignmentId: assignment?.id ?? null,
      status: deriveDeliveryStatus(row.status, assignment?.dispatch_status ?? null),
      pickupVariance: null,
    })
  }

  schedule.sort((a, b) => a.time.localeCompare(b.time))

  const shiftRow = shiftResult.data?.[0]
  const rawAssignments =
    (shiftRow?.shift_assignments as ShiftAssignmentRow[] | null) ?? []

  const stopCounts = new Map<string, { total: number; done: number }>()
  for (const stop of schedule) {
    if (!stop.driverAssignmentId) continue
    const current = stopCounts.get(stop.driverAssignmentId) ?? { total: 0, done: 0 }
    current.total += 1
    if (stop.status === "done") current.done += 1
    stopCounts.set(stop.driverAssignmentId, current)
  }

  const onShiftStaffIds = new Set(
    rawAssignments.map((assignment) => assignment.staff_id).filter(Boolean)
  )

  const drivers: ShiftDriver[] = rawAssignments.map((assignment) => {
    const counts = stopCounts.get(assignment.id) ?? { total: 0, done: 0 }
    return {
      id: assignment.id,
      staffId: assignment.staff_id,
      name: assignment.staff?.name ?? "—",
      van: assignment.vehicles?.label ?? "—",
      stops: counts.total,
      done: counts.done,
      status: assignment.status,
    }
  })

  const staffRoster: StaffRosterMember[] = ((staffResult.data ?? []) as Array<{
    id: string
    name: string
    role: string
    phone: string | null
  }>)
    .filter((member) => !onShiftStaffIds.has(member.id))
    .map((member) => ({
      id: member.id,
      name: member.name,
      role: member.role.charAt(0).toUpperCase() + member.role.slice(1),
      phone: member.phone,
    }))

  const pickupCount = schedule.filter((stop) => stop.type === "pickup").length
  const deliveryCount = schedule.filter((stop) => stop.type === "delivery").length
  const totalBoxes = schedule.reduce((sum, stop) => sum + stop.boxes, 0)
  const pickupsDone = schedule.filter(
    (stop) => stop.type === "pickup" && stop.status === "done"
  ).length
  const deliveriesOut = schedule.filter(
    (stop) => stop.type === "delivery" && stop.status === "out"
  ).length
  const availableVans = drivers.filter((driver) => driver.status === "available").length

  const pickupLabel = isToday ? "Today's pickups" : "Pickups"
  const deliveryLabel = isToday ? "Today's deliveries" : "Deliveries"
  const scheduleSub = isToday ? undefined : formatUpcomingLabel(selectedDate)

  const stats = [
    {
      key: pickupLabel,
      value: String(pickupCount),
      sub: scheduleSub ? `${pickupsDone} completed · ${scheduleSub}` : `${pickupsDone} completed`,
      icon: "calendar-check" as const,
    },
    {
      key: deliveryLabel,
      value: String(deliveryCount),
      sub: scheduleSub
        ? `${deliveriesOut} out for delivery · ${scheduleSub}`
        : `${deliveriesOut} out for delivery`,
      icon: "truck" as const,
    },
    {
      key: "Boxes to handle",
      value: String(totalBoxes),
      sub: `across ${schedule.length} orders`,
      icon: "box" as const,
    },
    {
      key: "Drivers on shift",
      value: String(drivers.length),
      sub: `${availableVans} van${availableVans === 1 ? "" : "s"} available`,
      icon: "users" as const,
    },
  ]

  const upcomingMap = new Map<string, UpcomingDay>()
  for (let offset = 1; offset <= 3; offset += 1) {
    const date = addDays(selectedDate, offset)
    upcomingMap.set(date, {
      date,
      dateLabel: formatUpcomingLabel(date),
      pickups: 0,
      deliveries: 0,
      boxes: 0,
    })
  }

  for (const row of upcomingPickupsResult.data ?? []) {
    if (!row.pickup_date) continue
    const entry = upcomingMap.get(row.pickup_date)
    if (!entry) continue
    entry.pickups += 1
    entry.boxes += countBoxes(row.booking_items)
  }

  for (const row of upcomingDeliveriesResult.data ?? []) {
    if (!row.requested_date) continue
    const entry = upcomingMap.get(row.requested_date)
    if (!entry) continue
    entry.deliveries += 1
    const booking = row.bookings as {
      booking_items?: Array<{ kind: string; qty: number }>
    } | null
    entry.boxes += countBoxes(booking?.booking_items)
  }

  const upcoming = [...upcomingMap.values()]

  return {
    selectedDate,
    dateLabel,
    isPastDate,
    isToday,
    hub,
    stats,
    schedule,
    drivers,
    staffRoster,
    upcoming,
  }
}
