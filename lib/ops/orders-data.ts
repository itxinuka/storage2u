import { OPEN_DELIVERY_STATUSES } from "@/lib/delivery-statuses"
import type { Database } from "@/lib/database.types"
import type { OpsOrderStatus } from "@/lib/ops-types"
import { getOpsHub } from "@/lib/ops/schedule-data"
import type { OpsOrder, OpsOrderLineItem, OrdersPageData } from "@/lib/ops/orders-types"
import { createServiceRoleClient } from "@/lib/supabase/service"

type BookingStatus = Database["public"]["Enums"]["booking_status"]
type DeliveryRequestStatus =
  Database["public"]["Enums"]["delivery_request_status"]

type BookingRow = {
  id: string
  profile_id: string
  created_at: string
  pickup_date: string | null
  delivery_date: string | null
  university: string | null
  mode: Database["public"]["Enums"]["booking_mode"]
  status: BookingStatus
  monthly_total_cents: number
  profiles:
    | {
        full_name: string | null
        email: string | null
        phone: string | null
      }
    | {
        full_name: string | null
        email: string | null
        phone: string | null
      }[]
    | null
  booking_items: Array<{
    id: string
    kind: Database["public"]["Enums"]["booking_item_kind"]
    name: string
    qty: number
    unit_price_cents: number
  }> | null
}

type DeliveryRow = {
  booking_id: string
  status: DeliveryRequestStatus
  requested_date: string | null
}

type DispatchRow = {
  booking_id: string
  stop_kind: Database["public"]["Enums"]["stop_kind"]
  shift_assignments: {
    vehicles: { label: string } | null
  } | null
}

const UNIVERSITY_SHORT: Record<string, string> = {
  "Memorial University": "Memorial",
  "St. Francis Xavier University": "StFX",
  "Dalhousie University": "Dalhousie",
  "College of the North Atlantic": "CNA",
}

function shortenUniversity(name: string | null | undefined): string {
  if (!name) return "—"
  return UNIVERSITY_SHORT[name] ?? name
}

function profileName(
  profiles: BookingRow["profiles"]
): string {
  if (!profiles) return "—"
  if (Array.isArray(profiles)) return profiles[0]?.full_name ?? "—"
  return profiles.full_name ?? "—"
}

function profileContact(
  profiles: BookingRow["profiles"],
  field: "email" | "phone"
): string | null {
  if (!profiles) return null
  const profile = Array.isArray(profiles) ? profiles[0] : profiles
  return profile?.[field]?.trim() || null
}

function formatOrderDate(date: string | null | undefined): string {
  if (!date) return "—"
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatPlacedDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatMonthly(cents: number): string {
  if (cents <= 0) return "—"
  return `$${Math.round(cents / 100)}/mo`
}

function toDisplayId(id: string): string {
  return id.slice(0, 8).toUpperCase()
}

export function mapBookingToOpsStatus(
  bookingStatus: BookingStatus,
  openDelivery: Pick<DeliveryRow, "status"> | null
): OpsOrderStatus {
  if (bookingStatus === "cancelled") return "cancelled"
  if (bookingStatus === "delivered") return "delivered"

  if (
    openDelivery &&
    (OPEN_DELIVERY_STATUSES as readonly string[]).includes(openDelivery.status)
  ) {
    return "out_for_delivery"
  }

  if (bookingStatus === "in_storage" || bookingStatus === "picked_up") {
    return "in_storage"
  }

  return "scheduled"
}

function buildLineItems(
  items: BookingRow["booking_items"]
): OpsOrderLineItem[] {
  return (items ?? [])
    .filter((item) => item.qty > 0)
    .map((item) => ({
      id: item.id,
      kind: item.kind,
      label: item.name,
      qty: item.qty,
      unitPriceCents: item.unit_price_cents,
      subtotalCents: item.qty * item.unit_price_cents,
    }))
}

function countBoxes(items: BookingRow["booking_items"]): number {
  return (items ?? [])
    .filter((item) => item.kind === "box")
    .reduce((sum, item) => sum + item.qty, 0)
}

function countItems(items: BookingRow["booking_items"]): number {
  return (items ?? [])
    .filter((item) => item.kind === "item")
    .reduce((sum, item) => sum + item.qty, 0)
}

function resolveOrderType(
  mode: BookingRow["mode"],
  openDelivery: DeliveryRow | null
): "pickup" | "delivery" {
  if (openDelivery) return "delivery"
  return mode
}

function resolveScheduledDate(
  row: BookingRow,
  openDelivery: DeliveryRow | null,
  orderType: "pickup" | "delivery"
): string {
  if (orderType === "delivery") {
    return formatOrderDate(
      openDelivery?.requested_date ?? row.delivery_date ?? row.pickup_date
    )
  }
  return formatOrderDate(row.pickup_date)
}

function resolveDriverLabel(
  bookingId: string,
  orderType: "pickup" | "delivery",
  dispatchByBooking: Map<string, DispatchRow[]>
): string | null {
  const rows = dispatchByBooking.get(bookingId) ?? []
  const preferred =
    rows.find((row) => row.stop_kind === orderType) ??
    rows.find((row) => row.stop_kind === "delivery") ??
    rows[0]

  return preferred?.shift_assignments?.vehicles?.label ?? null
}

export async function getOrdersPageData(): Promise<OrdersPageData> {
  const supabase = createServiceRoleClient()
  const hub = getOpsHub()

  const [bookingsResult, deliveriesResult, dispatchResult] = await Promise.all([
    supabase
      .from("bookings")
      .select(
        `
        id,
        profile_id,
        created_at,
        pickup_date,
        delivery_date,
        university,
        mode,
        status,
        monthly_total_cents,
        profiles ( full_name, email, phone ),
        booking_items ( id, kind, name, qty, unit_price_cents )
      `
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("delivery_requests")
      .select("booking_id, status, requested_date")
      .in("status", [...OPEN_DELIVERY_STATUSES]),
    supabase
      .from("dispatch_assignments")
      .select(
        `
        booking_id,
        stop_kind,
        shift_assignments (
          vehicles ( label )
        )
      `
      ),
  ])

  if (bookingsResult.error) throw bookingsResult.error
  if (deliveriesResult.error) throw deliveriesResult.error
  if (dispatchResult.error) throw dispatchResult.error

  const openDeliveryByBooking = new Map<string, DeliveryRow>()
  for (const row of deliveriesResult.data ?? []) {
    if (!openDeliveryByBooking.has(row.booking_id)) {
      openDeliveryByBooking.set(row.booking_id, row)
    }
  }

  const dispatchByBooking = new Map<string, DispatchRow[]>()
  for (const row of (dispatchResult.data as DispatchRow[] | null) ?? []) {
    const current = dispatchByBooking.get(row.booking_id) ?? []
    current.push(row)
    dispatchByBooking.set(row.booking_id, current)
  }

  const orders: OpsOrder[] = ((bookingsResult.data as BookingRow[] | null) ?? []).map(
    (row) => {
      const openDelivery = openDeliveryByBooking.get(row.id) ?? null
      const status = mapBookingToOpsStatus(row.status, openDelivery)
      const type = resolveOrderType(row.mode, openDelivery)
      const lineItems = buildLineItems(row.booking_items)
      const monthlyTotalCents =
        row.monthly_total_cents > 0
          ? row.monthly_total_cents
          : lineItems.reduce((sum, item) => sum + item.subtotalCents, 0)

      return {
        id: row.id,
        displayId: toDisplayId(row.id),
        profileId: row.profile_id,
        customer: profileName(row.profiles),
        customerEmail: profileContact(row.profiles, "email"),
        customerPhone: profileContact(row.profiles, "phone"),
        university: shortenUniversity(row.university),
        universityFull: row.university,
        type,
        status,
        boxCount: countBoxes(row.booking_items),
        itemCount: countItems(row.booking_items),
        scheduledDate: resolveScheduledDate(row, openDelivery, type),
        monthlyTotalCents,
        monthlyDisplay: formatMonthly(monthlyTotalCents),
        createdAt: row.created_at,
        placedDateLabel: formatPlacedDate(row.created_at),
        lineItems,
        driver: resolveDriverLabel(row.id, type, dispatchByBooking),
      }
    }
  )

  return { hub, orders }
}

export function getOrdersForCampuses(
  orders: OpsOrder[],
  campuses: string[]
): OpsOrder[] {
  if (campuses.length === 0) return []

  const campusSet = new Set(campuses.map((campus) => campus.toLowerCase()))

  return orders.filter(
    (order) =>
      campusSet.has(order.university.toLowerCase()) ||
      (order.universityFull
        ? campusSet.has(order.universityFull.toLowerCase())
        : false)
  )
}
