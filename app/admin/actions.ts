"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import type { Database } from "@/lib/database.types"
import { createServiceRoleClient } from "@/lib/supabase/service"

type ActionResult = { success: boolean; error?: string }

type BookingStatus = Database["public"]["Enums"]["booking_status"]

const BOOKING_STATUSES = [
  "scheduled",
  "picked_up",
  "in_storage",
  "delivered",
  "cancelled",
] as const satisfies readonly BookingStatus[]

const DELIVERY_STATUSES = [
  "pending",
  "out_for_delivery",
  "delivered",
] as const

type DeliveryStatus = (typeof DELIVERY_STATUSES)[number]

async function requireAdmin(): Promise<ActionResult | null> {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || user?.publicMetadata?.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  return null
}

function isBookingStatus(status: string): status is BookingStatus {
  return (BOOKING_STATUSES as readonly string[]).includes(status)
}

function isDeliveryStatus(status: string): status is DeliveryStatus {
  return (DELIVERY_STATUSES as readonly string[]).includes(status)
}

type DeliveryRequestDbStatus =
  Database["public"]["Enums"]["delivery_request_status"]

function toDeliveryRequestDbStatus(
  status: DeliveryStatus
): DeliveryRequestDbStatus {
  if (status === "out_for_delivery") {
    return "in_transit"
  }
  return status
}

export async function updateBookingStatus(
  bookingId: string,
  status: string
): Promise<ActionResult> {
  const authError = await requireAdmin()
  if (authError) return authError

  if (!bookingId) {
    return { success: false, error: "Booking ID is required" }
  }

  if (!isBookingStatus(status)) {
    return { success: false, error: "Invalid booking status" }
  }

  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function updateDeliveryStatus(
  deliveryRequestId: string,
  status: string
): Promise<ActionResult> {
  const authError = await requireAdmin()
  if (authError) return authError

  if (!deliveryRequestId) {
    return { success: false, error: "Delivery request ID is required" }
  }

  if (!isDeliveryStatus(status)) {
    return { success: false, error: "Invalid delivery status" }
  }

  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .from("delivery_requests")
    .update({ status: toDeliveryRequestDbStatus(status) })
    .eq("id", deliveryRequestId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}
