import { formatSelectionCounts, type SelectionMap } from "@/lib/booking-catalog"
import type { MoveInBooking } from "@/lib/database.types"
import { getCampusById, getUniversityById } from "@/lib/move-in-campuses"
import type { HomeAddress } from "@/lib/mapbox"

export type MoveInDashboardOrder = {
  id: string
  title: string
  moveInDate: string
  address: string
  campus: string
  itemsLabel: string
  itemCount: number
  status: MoveInBooking["status"]
  totalLabel: string
}

function formatDate(date: string | null): string {
  if (!date) return "TBD"
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`
}

function toDisplayOrder(booking: MoveInBooking): MoveInDashboardOrder {
  const university = getUniversityById(booking.university_id)
  const campus = getCampusById(booking.campus_id)
  const home = booking.home_address as HomeAddress
  const selection = booking.items as SelectionMap
  const itemCount =
    booking.item_count > 0
      ? booking.item_count
      : Object.values(selection).reduce((sum, qty) => sum + qty, 0)

  return {
    id: booking.id,
    title: university?.name ?? "University move-in",
    moveInDate: formatDate(booking.move_in_date),
    address: `${home.street}, ${home.city}, ${home.province} ${home.postalCode}`,
    campus: campus?.name ?? booking.campus_id,
    itemsLabel: formatSelectionCounts(selection),
    itemCount,
    status: booking.status,
    totalLabel: formatMoney(booking.total_cents),
  }
}

export function splitMoveInForDisplay(bookings: MoveInBooking[]) {
  const today = new Date().toISOString().slice(0, 10)
  const activeMoveIns: MoveInDashboardOrder[] = []
  const pastMoveIns: MoveInDashboardOrder[] = []

  const sorted = [...bookings].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  for (const booking of sorted) {
    const order = toDisplayOrder(booking)
    const isPast =
      booking.status === "cancelled" ||
      (booking.status === "confirmed" && booking.move_in_date < today)

    if (isPast) {
      pastMoveIns.push(order)
    } else {
      activeMoveIns.push(order)
    }
  }

  return { activeMoveIns, pastMoveIns }
}
