import Link from "next/link"
import { redirect } from "next/navigation"
import { Check } from "lucide-react"

import { formatDisplayDate, formatMoney } from "@/components/booking/booking-form-parts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import {
  getCampusById,
  getUniversityById,
} from "@/lib/move-in-campuses"
import { getMoveInBookingForConfirmation } from "@/lib/stripe-move-in-booking"
import { verifyMoveInCheckoutSession } from "@/app/book/move-in-actions"
import type { HomeAddress } from "@/lib/mapbox"
import type { SelectionMap } from "@/lib/booking-catalog"
import { formatSelectionCounts } from "@/lib/booking-catalog"

type MoveInCompletePageProps = {
  searchParams: Promise<{ session_id?: string; booking_id?: string }>
}

export default async function MoveInCompletePage({
  searchParams,
}: MoveInCompletePageProps) {
  const params = await searchParams
  let bookingId = params.booking_id ?? null

  if (params.session_id) {
    const verified = await verifyMoveInCheckoutSession(params.session_id)
    if (!verified.success) {
      redirect(`/book?mode=delivery&checkout=error`)
    }
    bookingId = verified.bookingId
  }

  if (!bookingId) {
    redirect("/book?mode=delivery")
  }

  const booking = await getMoveInBookingForConfirmation(bookingId)
  if (!booking) {
    redirect("/book?mode=delivery")
  }

  const university = getUniversityById(booking.university_id)
  const campus = getCampusById(booking.campus_id)
  const home = booking.home_address as HomeAddress
  const selection = booking.items as SelectionMap
  const addressLine = `${home.street}, ${home.city}, ${home.province} ${home.postalCode}`

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-6">
          <Logo size="lg" />
          <Link
            href="/"
            className="text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            Exit
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-xl px-6 py-12">
        <Card className="gap-0 border-0 py-0 text-center shadow-brand">
          <CardContent className="p-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent shadow-brand">
              <Check className="h-10 w-10 text-accent-foreground" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Move-in booked!
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              We&apos;ll pick up from <strong className="text-foreground">{addressLine}</strong>{" "}
              and deliver to {campus?.name ?? university?.name} on{" "}
              {formatDisplayDate(booking.move_in_date)}.
            </p>
            <Card className="mx-auto mt-6 max-w-md gap-0 border-0 py-0 text-left shadow-[inset_0_0_0_1px_var(--color-border)]">
              <CardContent className="space-y-3.5 p-5">
                <p className="font-bold text-foreground">
                  {formatSelectionCounts(selection)} · {formatMoney(booking.total_cents)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {booking.distance_km} km · one-time payment confirmed
                </p>
              </CardContent>
            </Card>
            <div className="mt-7">
              <Button render={<Link href="/" />}>Back to home</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
