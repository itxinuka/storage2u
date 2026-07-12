import Link from "next/link"

import {
  getBookingForConfirmation,
  verifyCheckoutSession,
} from "@/lib/booking-complete"
import { BookingConfirmation } from "@/components/booking/booking-confirmation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/logo"

type CompletePageProps = {
  searchParams: Promise<{ session_id?: string; booking_id?: string }>
}

export default async function BookCompletePage({ searchParams }: CompletePageProps) {
  const params = await searchParams
  let bookingId = params.booking_id ?? null

  if (params.session_id) {
    const verified = await verifyCheckoutSession(params.session_id)
    if (!verified.success) {
      return (
        <ErrorScreen
          title="Payment not confirmed"
          message={verified.error}
        />
      )
    }
    bookingId = verified.bookingId
  }

  if (!bookingId) {
    return (
      <ErrorScreen
        title="Booking not found"
        message="We couldn't find your booking. Head back to the dashboard or try booking again."
      />
    )
  }

  const booking = await getBookingForConfirmation(bookingId)

  if (!booking) {
    return (
      <ErrorScreen
        title="Booking not found"
        message="We couldn't load your booking details."
      />
    )
  }

  return (
    <BookingConfirmation
      booking={booking}
      mode={booking.mode === "delivery" ? "delivery" : "pickup"}
    />
  )
}

function ErrorScreen({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-6">
          <Logo size="lg" />
          <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-primary">
            Exit
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-xl px-6 py-12">
        <Card className="gap-0 border-0 py-0 text-center shadow-brand">
          <CardContent className="p-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">{message}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button render={<Link href="/book" />}>Back to booking</Button>
              <Button variant="ghost" render={<Link href="/dashboard" />}>
                Go to dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
