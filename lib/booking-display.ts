import type { ActiveBooking } from "@/components/dashboard/active-storage"
import type { PastBooking } from "@/components/dashboard/past-bookings"
import type { StorageStatus } from "@/components/dashboard/storage-status-badge"
import type { BookingItem, BookingWithItems } from "@/lib/database.types"

type ProfileDisplay = {
  university: string | null
}

const ACTIVE_STATUSES = new Set<BookingWithItems["status"]>([
  "scheduled",
  "picked_up",
  "in_storage",
])

const PAST_STATUSES = new Set<BookingWithItems["status"]>(["delivered", "cancelled"])

function formatPickupDate(date: string | null): string {
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

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`
}

function mapStatus(status: BookingWithItems["status"]): StorageStatus {
  return status
}

function summarizeItems(items: BookingItem[]) {
  const boxCount = items
    .filter((i) => i.kind === "box")
    .reduce((sum, i) => sum + i.qty, 0)
  const itemCount = items
    .filter((i) => i.kind === "item")
    .reduce((sum, i) => sum + i.qty, 0)
  const totalCount = boxCount + itemCount

  const labels = items
    .filter((i) => i.qty > 0)
    .map((i) => `${i.qty} ${i.name.toLowerCase()}`)

  return {
    boxCount,
    itemCount,
    totalCount,
    boxesLabel:
      totalCount > 0 ? `${boxCount} boxes · ${itemCount} items` : "—",
    plan: labels.length > 0 ? labels.join(" · ") : "—",
  }
}

function toDisplayBooking(
  booking: BookingWithItems,
  profile: ProfileDisplay,
  outForDelivery: boolean
) {
  const university = booking.university ?? profile.university ?? "Your campus"
  const summary = summarizeItems(booking.booking_items ?? [])
  const monthlyCost =
    booking.monthly_total_cents > 0
      ? `${formatCurrency(booking.monthly_total_cents)}/mo`
      : undefined

  return {
    id: booking.id,
    title: university,
    pickupDate: formatPickupDate(booking.pickup_date),
    address: booking.pickup_address,
    city: booking.residence ?? "",
    university,
    boxes: summary.boxCount + summary.itemCount,
    boxesLabel: summary.boxesLabel,
    plan: summary.plan,
    status: outForDelivery ? "out_for_delivery" : mapStatus(booking.status),
    monthlyCost,
    monthlyTotalCents: booking.monthly_total_cents,
  }
}

export function splitBookingsForDisplay(
  bookings: BookingWithItems[],
  profile: ProfileDisplay,
  outForDeliveryBookingIds: ReadonlySet<string> = new Set()
): { activeBookings: ActiveBooking[]; pastBookings: PastBooking[] } {
  const activeBookings: ActiveBooking[] = []
  const pastBookings: PastBooking[] = []

  for (const booking of bookings) {
    const base = toDisplayBooking(
      booking,
      profile,
      outForDeliveryBookingIds.has(booking.id)
    )

    if (ACTIVE_STATUSES.has(booking.status)) {
      activeBookings.push(base)
    } else if (PAST_STATUSES.has(booking.status)) {
      pastBookings.push({
        ...base,
        deliveredDate: formatPickupDate(booking.delivery_date ?? booking.pickup_date),
        total:
          booking.monthly_total_cents > 0
            ? formatCurrency(booking.monthly_total_cents)
            : "—",
      })
    }
  }

  return { activeBookings, pastBookings }
}

export type DashboardStatsOptions = {
  /** Active Stripe subscription total in cents; falls back to booking sum when null. */
  monthlyTotalCentsOverride?: number | null
  /** Earliest upcoming delivery date (YYYY-MM-DD) and the boxes on that booking. */
  nextDeliveryDate?: string | null
  nextDeliveryBoxes?: number | null
}

export function computeDashboardStats(
  activeBookings: Array<ActiveBooking & { monthlyTotalCents?: number }>,
  pastBookings: PastBooking[],
  options: DashboardStatsOptions = {}
) {
  const boxCount = activeBookings.reduce((sum, b) => sum + b.boxes, 0)
  const bookingMonthlyCents = activeBookings.reduce(
    (sum, b) => sum + (b.monthlyTotalCents ?? 0),
    0
  )
  const monthlyCents =
    options.monthlyTotalCentsOverride != null
      ? options.monthlyTotalCentsOverride
      : bookingMonthlyCents

  const hasOutForDelivery = activeBookings.some(
    (b) => b.status === "out_for_delivery"
  )

  const nextDelivery = options.nextDeliveryDate
    ? formatShortDate(options.nextDeliveryDate)
    : hasOutForDelivery
      ? "Soon"
      : "—"

  let nextDeliverySub: string
  if (options.nextDeliveryDate) {
    const boxes = options.nextDeliveryBoxes ?? 0
    nextDeliverySub = `${boxes} ${boxes === 1 ? "box" : "boxes"} · out for delivery`
  } else if (activeBookings.length > 0) {
    nextDeliverySub = "request from active storage"
  } else {
    nextDeliverySub = "no deliveries scheduled"
  }

  return {
    boxesStored: boxCount > 0 ? String(boxCount) : "0",
    boxesSub:
      activeBookings.length > 0
        ? `across ${activeBookings.length} pickup${activeBookings.length === 1 ? "" : "s"}`
        : "book a pickup to get started",
    monthlyTotal: monthlyCents > 0 ? formatCurrency(monthlyCents) : "$0",
    monthlySub: monthlyCents > 0 ? "billed on the 1st" : "nothing stored yet",
    nextDelivery,
    nextDeliverySub,
    hasOutForDelivery,
    totalPickups: activeBookings.length,
    totalPast: pastBookings.length,
  }
}
