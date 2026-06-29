import type { BookingItem, BookingWithItems, Database } from "@/lib/database.types"
import { createServiceRoleClient } from "@/lib/supabase/service"

type DeliveryRequestStatus = Database["public"]["Enums"]["delivery_request_status"]

export const OPEN_DELIVERY_STATUSES = ["pending", "scheduled", "in_transit"] as const

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]

export type DeliveryRequestWithBooking = Database["public"]["Tables"]["delivery_requests"]["Row"] & {
  bookings: BookingWithItems | null
}

function formatDate(date: string | null): string {
  if (!date) return "TBD"
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatShortDate(date: string | null): string {
  if (!date) return "—"
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
  })
}

function summarizeItems(items: BookingItem[]) {
  const boxCount = items
    .filter((i) => i.kind === "box")
    .reduce((sum, i) => sum + i.qty, 0)
  const itemCount = items
    .filter((i) => i.kind === "item")
    .reduce((sum, i) => sum + i.qty, 0)
  const totalCount = boxCount + itemCount

  const boxesLabel =
    totalCount > 0 ? `${boxCount} boxes · ${itemCount} items` : "—"

  return { boxCount, itemCount, totalCount, boxesLabel }
}

export type DeliveryDisplay = {
  id: string
  kind: "return" | "pickup"
  status: DeliveryRequestStatus | "scheduled"
  requestedDate: string | null
  requestedDateLabel: string
  address: string
  university: string
  boxesLabel: string
  timeWindow: string | null
  createdAt: string
  createdAtLabel: string
  bookingId: string
}

export async function getProfileForUser(clerkUserId: string) {
  const supabase = createServiceRoleClient()
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle()
  return data
}

export async function getDeliveryPageData(profileId: string) {
  const supabase = createServiceRoleClient()

  const [{ data: deliveryRows }, { data: scheduledPickups }] = await Promise.all([
    supabase
      .from("delivery_requests")
      .select("*, bookings(*, booking_items(*))")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false }),
    supabase
      .from("bookings")
      .select("*, booking_items(*)")
      .eq("profile_id", profileId)
      .eq("mode", "pickup")
      .eq("status", "scheduled")
      .order("pickup_date", { ascending: true }),
  ])

  const returns: DeliveryDisplay[] = (deliveryRows ?? []).map((row) => {
    const booking = row.bookings as BookingWithItems | null
    const items = booking?.booking_items ?? []
    const summary = summarizeItems(items)
    const university = booking?.university ?? "Your campus"

    return {
      id: row.id,
      kind: "return" as const,
      status: row.status,
      requestedDate: row.requested_date,
      requestedDateLabel: formatDate(row.requested_date),
      address: row.delivery_address,
      university,
      boxesLabel: summary.boxesLabel,
      timeWindow: booking?.time_window ?? null,
      createdAt: row.created_at,
      createdAtLabel: formatShortDate(row.created_at.slice(0, 10)),
      bookingId: row.booking_id,
    }
  })

  const pickups: DeliveryDisplay[] = (scheduledPickups ?? []).map((booking) => {
    const items = booking.booking_items ?? []
    const summary = summarizeItems(items)
    const university = booking.university ?? "Your campus"

    return {
      id: booking.id,
      kind: "pickup" as const,
      status: "scheduled" as const,
      requestedDate: booking.pickup_date,
      requestedDateLabel: formatDate(booking.pickup_date),
      address: booking.pickup_address,
      university,
      boxesLabel: summary.boxesLabel,
      timeWindow: booking.time_window,
      createdAt: booking.created_at,
      createdAtLabel: formatShortDate(booking.created_at.slice(0, 10)),
      bookingId: booking.id,
    }
  })

  const openStatuses = new Set<string>(OPEN_DELIVERY_STATUSES)

  const upcoming = [
    ...pickups,
    ...returns.filter((d) => openStatuses.has(d.status)),
  ].sort((a, b) => {
    const aDate = a.requestedDate ?? a.createdAt
    const bDate = b.requestedDate ?? b.createdAt
    return aDate.localeCompare(bDate)
  })

  const history = returns.filter((d) => !openStatuses.has(d.status))

  return { upcoming, history }
}

export type AccountAddress = {
  address: string
  residence: string | null
  university: string | null
  phone: string | null
}

export async function getAccountPageData(profileId: string) {
  const supabase = createServiceRoleClient()

  const { data: latestBooking } = await supabase
    .from("bookings")
    .select("pickup_address, residence, university, contact_phone")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const defaultAddress: AccountAddress | null = latestBooking
    ? {
        address: latestBooking.pickup_address,
        residence: latestBooking.residence,
        university: latestBooking.university,
        phone: latestBooking.contact_phone,
      }
    : null

  const { count: bookingCount } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", profileId)

  return { defaultAddress, bookingCount: bookingCount ?? 0 }
}
