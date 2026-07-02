"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import type { BookingMode } from "@/lib/booking-catalog"
import {
  computeSelectionTotals,
  selectionToLineItems,
} from "@/lib/booking-catalog"
import type { Database } from "@/lib/database.types"
import { createClient } from "@/lib/server"

type BookingItemKind = Database["public"]["Enums"]["booking_item_kind"]
type BookingModeDb = Database["public"]["Enums"]["booking_mode"]

export type CreateBookingInput = {
  mode: BookingMode
  selection: Record<string, number>
  university: string
  residence: string
  address: string
  phone: string
  scheduledDate: string
  timeWindow: string
  deliveryDate?: string | null
  notes?: string | null
}

export type CreateBookingResult =
  | { success: true; bookingId: string }
  | { success: false; error: string; code?: "auth" | "validation" }

function toDbMode(mode: BookingMode): BookingModeDb {
  return mode
}

export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, error: "Please sign in to complete your booking.", code: "auth" }
  }

  const user = await currentUser()
  const lineItems = selectionToLineItems(input.selection)
  const { total, count } = computeSelectionTotals(input.selection)

  if (count === 0) {
    return { success: false, error: "Add at least one box or item.", code: "validation" }
  }

  if (!input.university.trim() || !input.address.trim() || !input.phone.trim()) {
    return { success: false, error: "University, address, and phone are required.", code: "validation" }
  }

  if (!input.scheduledDate || !input.timeWindow) {
    return { success: false, error: "Please pick a date and time window.", code: "validation" }
  }

  const supabase = await createClient()

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || null
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    null

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        clerk_user_id: userId,
        email,
        full_name: fullName,
        phone: input.phone.trim(),
        university: input.university.trim(),
      },
      { onConflict: "clerk_user_id" }
    )
    .select("id")
    .single()

  if (profileError || !profile) {
    return {
      success: false,
      error: profileError?.message ?? "Could not create your profile.",
    }
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      profile_id: profile.id,
      mode: toDbMode(input.mode),
      pickup_address: input.address.trim(),
      pickup_date: input.scheduledDate,
      delivery_date: input.deliveryDate ?? null,
      university: input.university.trim(),
      residence: input.residence.trim() || null,
      contact_phone: input.phone.trim(),
      time_window: input.timeWindow,
      monthly_total_cents: total * 100,
      notes: input.notes?.trim() || null,
      status: "scheduled",
    })
    .select("id")
    .single()

  if (bookingError || !booking) {
    return {
      success: false,
      error: bookingError?.message ?? "Could not save your booking.",
    }
  }

  const rows = lineItems.map((item) => ({
    booking_id: booking.id,
    catalog_id: item.catalog_id,
    name: item.name,
    kind: item.kind as BookingItemKind,
    qty: item.qty,
    unit_price_cents: item.unit_price_cents,
  }))

  const { error: itemsError } = await supabase.from("booking_items").insert(rows)

  if (itemsError) {
    await supabase.from("bookings").delete().eq("id", booking.id)
    return { success: false, error: itemsError.message }
  }

  revalidatePath("/dashboard")
  return { success: true, bookingId: booking.id }
}
