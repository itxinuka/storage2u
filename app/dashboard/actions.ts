"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { OPEN_DELIVERY_STATUSES } from "@/lib/dashboard-data"
import { createBillingPortalUrl } from "@/lib/stripe"
import { createClient } from "@/lib/server"

const DASHBOARD_PATHS = [
  "/dashboard",
  "/dashboard/deliveries",
  "/dashboard/account",
  "/dashboard/billing",
] as const

function revalidateDashboard() {
  for (const path of DASHBOARD_PATHS) {
    revalidatePath(path)
  }
}

export type RequestDeliveryResult =
  | { success: true }
  | { success: false; error: string }

/**
 * Records a delivery request for one of the signed-in user's bookings. The
 * booking visually flips to "out for delivery" via the active delivery_requests
 * lookup in the dashboard query.
 */
export async function requestDelivery(
  bookingId: string
): Promise<RequestDeliveryResult> {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, error: "Please sign in to request a delivery." }
  }

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle()

  if (!profile) {
    return { success: false, error: "We couldn't find your account." }
  }

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, profile_id, pickup_address")
    .eq("id", bookingId)
    .maybeSingle()

  if (!booking || booking.profile_id !== profile.id) {
    return { success: false, error: "We couldn't find that booking." }
  }

  const { data: existing } = await supabase
    .from("delivery_requests")
    .select("id")
    .eq("booking_id", bookingId)
    .in("status", [...OPEN_DELIVERY_STATUSES])
    .maybeSingle()

  if (existing) {
    return { success: false, error: "A delivery is already on its way." }
  }

  const { error } = await supabase.from("delivery_requests").insert({
    booking_id: bookingId,
    profile_id: profile.id,
    delivery_address: booking.pickup_address,
    status: "pending",
  })

  if (error) {
    return { success: false, error: "Could not request delivery. Try again." }
  }

  revalidateDashboard()
  return { success: true }
}

export type BillingPortalResult =
  | { url: string }
  | { error: string }

/** Opens the Stripe customer portal for the signed-in user, when configured. */
export async function openBillingPortal(): Promise<BillingPortalResult> {
  const user = await currentUser()
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    null

  if (!email) {
    return { error: "No email on file for billing." }
  }

  const headerList = await headers()
  const host = headerList.get("host")
  const proto = headerList.get("x-forwarded-proto") ?? "https"
  const origin = headerList.get("origin") ?? (host ? `${proto}://${host}` : "")

  const url = await createBillingPortalUrl(email, `${origin}/dashboard/billing`)

  if (!url) {
    return {
      error: "Billing isn't set up yet. Reach out to hello@storage2u.ca.",
    }
  }

  return { url }
}
