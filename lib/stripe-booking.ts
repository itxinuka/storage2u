import "server-only"

import { createServiceRoleClient } from "@/lib/supabase/service"

export async function finalizeBookingPayment({
  bookingId,
  stripeCustomerId,
  stripeSubscriptionId,
}: {
  bookingId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
}): Promise<boolean> {
  const supabase = createServiceRoleClient()

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, profile_id, status")
    .eq("id", bookingId)
    .maybeSingle()

  if (!booking) return false
  if (booking.status !== "pending_payment") return true

  const { error: bookingError } = await supabase
    .from("bookings")
    .update({
      status: "scheduled",
      stripe_subscription_id: stripeSubscriptionId,
      stripe_payment_id: stripeSubscriptionId,
    })
    .eq("id", bookingId)

  if (bookingError) return false

  await supabase
    .from("profiles")
    .update({ stripe_customer_id: stripeCustomerId })
    .eq("id", booking.profile_id)

  return true
}
