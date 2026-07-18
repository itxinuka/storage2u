import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"

type BookingUnitInsert = Database["public"]["Tables"]["booking_units"]["Insert"]

export type BookingUnitItemInput = {
  id: string
  name: string
  qty: number
}

export function toOrderDisplayId(bookingId: string): string {
  return bookingId.slice(0, 8).toUpperCase()
}

export function buildUnitLabelCode(displayId: string, globalIndex: number): string {
  return `S2U-${displayId}-${String(globalIndex).padStart(3, "0")}`
}

/**
 * Inserts one label per physical unit (qty expanded).
 * Idempotent: skips insert if any unit labels already exist for the booking.
 */
export async function ensureBookingUnits(
  supabase: SupabaseClient<Database>,
  bookingId: string,
  items: BookingUnitItemInput[],
  createdAt?: string
): Promise<{ error: string | null }> {
  const { data: existing, error: existingError } = await supabase
    .from("booking_units")
    .select("id")
    .eq("booking_id", bookingId)
    .eq("kind", "unit")
    .limit(1)
    .maybeSingle()

  if (existingError) {
    return { error: existingError.message }
  }
  if (existing) {
    return { error: null }
  }

  const displayId = toOrderDisplayId(bookingId)
  const rows: BookingUnitInsert[] = []

  let globalIndex = 0
  for (const item of items) {
    const qty = Math.max(0, Math.floor(item.qty))
    for (let unitIndex = 1; unitIndex <= qty; unitIndex += 1) {
      globalIndex += 1
      rows.push({
        booking_id: bookingId,
        booking_item_id: item.id,
        kind: "unit",
        label_name: item.name,
        unit_index: unitIndex,
        code: buildUnitLabelCode(displayId, globalIndex),
        ...(createdAt ? { created_at: createdAt } : {}),
      })
    }
  }

  if (rows.length === 0) {
    return { error: null }
  }

  const { error: insertError } = await supabase.from("booking_units").insert(rows)
  if (insertError) {
    return { error: insertError.message }
  }

  return { error: null }
}
