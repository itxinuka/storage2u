import type { Database } from "@/lib/database.types"
import type { OpsUnitLabel } from "@/lib/ops/orders-types"
import { toOrderDisplayId } from "@/lib/ops/booking-units"
import { createServiceRoleClient } from "@/lib/supabase/service"

type BookingUnitKind = Database["public"]["Enums"]["booking_unit_kind"]

export type OrderLabelsPageData = {
  bookingId: string
  displayId: string
  customer: string
  units: OpsUnitLabel[]
}

function formatPlacedDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export async function getOrderLabelsPageData(
  bookingId: string
): Promise<OrderLabelsPageData | null> {
  const supabase = createServiceRoleClient()

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select(
      `
      id,
      created_at,
      profiles ( full_name ),
      booking_items ( id, qty ),
      booking_units (
        id,
        kind,
        code,
        label_name,
        unit_index,
        booking_item_id,
        created_at
      )
    `
    )
    .eq("id", bookingId)
    .maybeSingle()

  if (bookingError) throw bookingError
  if (!booking) return null

  const profiles = booking.profiles as
    | { full_name: string | null }
    | { full_name: string | null }[]
    | null
  const customer = Array.isArray(profiles)
    ? (profiles[0]?.full_name ?? "—")
    : (profiles?.full_name ?? "—")

  const items = (booking.booking_items ?? []) as Array<{
    id: string
    qty: number
  }>
  const qtyByItemId = new Map(items.map((item) => [item.id, item.qty]))

  const rawUnits = (booking.booking_units ?? []) as Array<{
    id: string
    kind: BookingUnitKind
    code: string
    label_name: string
    unit_index: number
    booking_item_id: string | null
    created_at: string
  }>

  const units: OpsUnitLabel[] = [...rawUnits]
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
      dateLabel: formatPlacedDate(unit.created_at),
    }))

  return {
    bookingId: booking.id,
    displayId: toOrderDisplayId(booking.id),
    customer,
    units,
  }
}
