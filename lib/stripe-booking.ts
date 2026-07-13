import "server-only"

import { createServiceRoleClient } from "@/lib/supabase/service"

export async function finalizeBookingPayment({
  bookingId,
  stripeCustomerId,
  stripeSubscriptionId,
  amountTotalCents,
}: {
  bookingId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  /** Final amount charged on the Checkout session (post-discount), in cents. */
  amountTotalCents?: number | null
}): Promise<boolean> {
  const supabase = createServiceRoleClient()

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, profile_id, status")
    .eq("id", bookingId)
    .maybeSingle()

  if (!booking) return false
  if (booking.status !== "pending_payment") return true

  const update: {
    status: "scheduled"
    stripe_subscription_id: string
    stripe_payment_id: string
    monthly_total_cents?: number
  } = {
    status: "scheduled",
    stripe_subscription_id: stripeSubscriptionId,
    stripe_payment_id: stripeSubscriptionId,
  }

  // Persist the amount Stripe actually charged (includes promo discounts).
  if (typeof amountTotalCents === "number" && amountTotalCents >= 0) {
    update.monthly_total_cents = amountTotalCents
  }

  const { error: bookingError } = await supabase
    .from("bookings")
    .update(update)
    .eq("id", bookingId)

  if (bookingError) return false

  await supabase
    .from("profiles")
    .update({ stripe_customer_id: stripeCustomerId })
    .eq("id", booking.profile_id)

  return true
}
