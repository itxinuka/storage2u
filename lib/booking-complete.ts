import "server-only"

import { auth } from "@clerk/nextjs/server"

import { finalizeBookingPayment } from "@/lib/stripe-booking"
import {
  getSubscriptionIdFromSession,
  retrieveCheckoutSession,
} from "@/lib/stripe"
import { createServiceRoleClient } from "@/lib/supabase/service"

export type VerifyCheckoutResult =
  | { success: true; bookingId: string }
  | { success: false; error: string }

/** Verify Stripe Checkout after redirect. Must not call revalidatePath (runs during RSC render). */
export async function verifyCheckoutSession(
  sessionId: string
): Promise<VerifyCheckoutResult> {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, error: "Please sign in to view your booking." }
  }

  const session = await retrieveCheckoutSession(sessionId)
  if (!session) {
    return { success: false, error: "Could not verify payment." }
  }

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return { success: false, error: "Payment is not complete yet." }
  }

  const bookingId =
    session.metadata?.booking_id ?? session.client_reference_id ?? null
  const subscriptionId = getSubscriptionIdFromSession(session)
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null

  if (!bookingId || !subscriptionId || !customerId) {
    return { success: false, error: "Missing payment details." }
  }

  const supabase = createServiceRoleClient()
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
    .select("id, profile_id")
    .eq("id", bookingId)
    .maybeSingle()

  if (!booking || booking.profile_id !== profile.id) {
    return { success: false, error: "We couldn't find that booking." }
  }

  const finalized = await finalizeBookingPayment({
    bookingId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
  })

  if (!finalized) {
    return {
      success: false,
      error:
        "Payment succeeded but we couldn't confirm your booking. Please try again or contact support.",
    }
  }

  return { success: true, bookingId }
}

export async function getBookingForConfirmation(bookingId: string) {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = createServiceRoleClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle()

  if (!profile) return null

  const { data: booking } = await supabase
    .from("bookings")
    .select("*, booking_items(*)")
    .eq("id", bookingId)
    .eq("profile_id", profile.id)
    .maybeSingle()

  return booking
}
