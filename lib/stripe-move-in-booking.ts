import "server-only"

import { createServiceRoleClient } from "@/lib/supabase/service"

export async function finalizeMoveInPayment(input: {
  moveInBookingId: string
  stripeSessionId: string
  profileId?: string | null
}): Promise<boolean> {
  const supabase = createServiceRoleClient()

  const { data: booking, error: fetchError } = await supabase
    .from("move_in_bookings")
    .select("id, status")
    .eq("id", input.moveInBookingId)
    .maybeSingle()

  if (fetchError || !booking) {
    console.error("[move-in] booking not found:", input.moveInBookingId)
    return false
  }

  if (booking.status !== "pending_payment") {
    return true
  }

  const { error: updateError } = await supabase
    .from("move_in_bookings")
    .update({
      status: "confirmed",
      stripe_session_id: input.stripeSessionId,
      profile_id: input.profileId ?? undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.moveInBookingId)

  if (updateError) {
    console.error("[move-in] finalize failed:", updateError.message)
    return false
  }

  return true
}

export async function getMoveInBookingForConfirmation(bookingId: string) {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from("move_in_bookings")
    .select("*")
    .eq("id", bookingId)
    .maybeSingle()

  if (error || !data) return null
  return data
}
