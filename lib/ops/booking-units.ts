import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"

type BookingUnitInsert = Database["public"]["Tables"]["booking_units"]["Insert"]
type BookingUnitRow = Database["public"]["Tables"]["booking_units"]["Row"]

export type BookingUnitItemInput = {
  id: string
  name: string
  qty: number
}

export type AppendBookingUnitInput = {
  bookingItemId: string
  name: string
  qtyToAdd: number
}

export function toOrderDisplayId(bookingId: string): string {
  return bookingId.slice(0, 8).toUpperCase()
}

export function buildUnitLabelCode(displayId: string, globalIndex: number): string {
  return `S2U-${displayId}-${String(globalIndex).padStart(3, "0")}`
}

function parseGlobalIndexFromCode(code: string, displayId: string): number | null {
  const prefix = `S2U-${displayId}-`
  if (!code.startsWith(prefix)) return null
  const suffix = code.slice(prefix.length)
  if (!/^\d+$/.test(suffix)) return null
  return Number.parseInt(suffix, 10)
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
        pickup_status: "expected",
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

/**
 * Appends new physical units for an existing booking (pickup overages).
 * Continues global code numbering and per-item unit_index.
 */
export async function appendBookingUnits(
  supabase: SupabaseClient<Database>,
  bookingId: string,
  items: AppendBookingUnitInput[]
): Promise<{ units: BookingUnitRow[]; error: string | null }> {
  const toAdd = items.filter((item) => item.qtyToAdd > 0)
  if (toAdd.length === 0) {
    return { units: [], error: null }
  }

  const { data: existingUnits, error: existingError } = await supabase
    .from("booking_units")
    .select("id, code, booking_item_id, unit_index")
    .eq("booking_id", bookingId)
    .eq("kind", "unit")

  if (existingError) {
    return { units: [], error: existingError.message }
  }

  const displayId = toOrderDisplayId(bookingId)
  let maxGlobalIndex = 0
  const maxIndexByItem = new Map<string, number>()

  for (const unit of existingUnits ?? []) {
    const parsed = parseGlobalIndexFromCode(unit.code, displayId)
    if (parsed != null && parsed > maxGlobalIndex) {
      maxGlobalIndex = parsed
    }
    if (unit.booking_item_id) {
      const current = maxIndexByItem.get(unit.booking_item_id) ?? 0
      if (unit.unit_index > current) {
        maxIndexByItem.set(unit.booking_item_id, unit.unit_index)
      }
    }
  }

  const rows: BookingUnitInsert[] = []
  let globalIndex = maxGlobalIndex

  for (const item of toAdd) {
    const qty = Math.max(0, Math.floor(item.qtyToAdd))
    let unitIndex = maxIndexByItem.get(item.bookingItemId) ?? 0
    for (let i = 0; i < qty; i += 1) {
      globalIndex += 1
      unitIndex += 1
      rows.push({
        booking_id: bookingId,
        booking_item_id: item.bookingItemId,
        kind: "unit",
        label_name: item.name,
        unit_index: unitIndex,
        code: buildUnitLabelCode(displayId, globalIndex),
        pickup_status: "added",
      })
    }
    maxIndexByItem.set(item.bookingItemId, unitIndex)
  }

  if (rows.length === 0) {
    return { units: [], error: null }
  }

  const { data: inserted, error: insertError } = await supabase
    .from("booking_units")
    .insert(rows)
    .select("*")

  if (insertError) {
    return { units: [], error: insertError.message }
  }

  return { units: inserted ?? [], error: null }
}
