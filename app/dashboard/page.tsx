import { auth, currentUser } from "@clerk/nextjs/server"

import { DashboardView } from "@/components/dashboard-view"
import { splitBookingsForDisplay } from "@/lib/booking-display"
import { OPEN_DELIVERY_STATUSES } from "@/lib/delivery-statuses"
import type { BookingWithItems, MoveInBooking } from "@/lib/database.types"
import { splitMoveInForDisplay } from "@/lib/move-in-display"
import { getActiveSubscriptionMonthlyCents } from "@/lib/stripe"
import { createClient } from "@/lib/server"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const supabase = await createClient()

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, university")
    .eq("clerk_user_id", userId)
    .maybeSingle()

  if (profileError) {
    console.error("[dashboard] profile query failed:", profileError.message)
  }

  let bookings: BookingWithItems[] = []
  let moveInBookings: MoveInBooking[] = []
  const outForDeliveryIds = new Set<string>()
  let nextDeliveryDate: string | null = null

  if (profile) {
    const [{ data: bookingData }, { data: deliveryData }, { data: moveInData }] =
      await Promise.all([
      supabase
        .from("bookings")
        .select("*, booking_items(*)")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("delivery_requests")
        .select("booking_id, requested_date, status")
        .eq("profile_id", profile.id)
        .in("status", [...OPEN_DELIVERY_STATUSES])
        .order("requested_date", { ascending: true }),
      supabase
        .from("move_in_bookings")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false }),
    ])

    bookings = (bookingData ?? []) as BookingWithItems[]
    moveInBookings = (moveInData ?? []) as MoveInBooking[]

    for (const request of deliveryData ?? []) {
      outForDeliveryIds.add(request.booking_id)
      if (!nextDeliveryDate && request.requested_date) {
        nextDeliveryDate = request.requested_date
      }
    }
  }

  const { activeBookings, pastBookings } = splitBookingsForDisplay(
    bookings,
    { university: profile?.university ?? null },
    outForDeliveryIds
  )

  const { activeMoveIns, pastMoveIns } = splitMoveInForDisplay(moveInBookings)

  const nextDeliveryBoxes =
    activeBookings.find((b) => outForDeliveryIds.has(b.id))?.boxes ?? null

  const user = await currentUser()
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    null
  const monthlyTotalCents = await getActiveSubscriptionMonthlyCents(email)

  return (
    <DashboardView
      activeBookings={activeBookings}
      pastBookings={pastBookings}
      activeMoveIns={activeMoveIns}
      pastMoveIns={pastMoveIns}
      university={profile?.university ?? null}
      monthlyTotalCents={monthlyTotalCents}
      nextDeliveryDate={nextDeliveryDate}
      nextDeliveryBoxes={nextDeliveryBoxes}
    />
  )
}
