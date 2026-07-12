import "server-only"

import {
  mapBookingBlockRow,
  type BookingBlock,
  type BookingBlockRow,
} from "@/lib/booking-availability"
import { createServiceRoleClient } from "@/lib/supabase/service"

import type { AvailabilityPageData } from "./availability-types"

function todayIso(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function daysAgoIso(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export async function getBookingBlocks(fromDate?: string): Promise<BookingBlock[]> {
  const supabase = createServiceRoleClient()
  const start = fromDate ?? daysAgoIso(30)

  const { data, error } = await supabase
    .from("booking_blocks")
    .select("id, block_date, time_window_id, reason, created_at")
    .gte("block_date", start)
    .order("block_date", { ascending: true })
    .order("time_window_id", { ascending: true, nullsFirst: true })

  if (error) {
    throw new Error(error.message)
  }

  return ((data as BookingBlockRow[] | null) ?? []).map(mapBookingBlockRow)
}

export async function getAvailabilityPageData(): Promise<AvailabilityPageData> {
  const blocks = await getBookingBlocks(daysAgoIso(7))
  const today = todayIso()

  const upcoming = blocks.filter((b) => b.blockDate >= today)
  const recent = blocks.filter((b) => b.blockDate < today)

  return {
    blocks: [...upcoming, ...recent],
  }
}
