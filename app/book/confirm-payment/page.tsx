import Link from "next/link"

import { ConfirmSubscriptionPayment } from "@/components/booking/confirm-subscription-payment"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { getBookingForPaymentConfirmation } from "@/lib/booking-complete"

type ConfirmPaymentPageProps = {
  searchParams: Promise<{ booking_id?: string }>
}

export default async function ConfirmPaymentPage({ searchParams }: ConfirmPaymentPageProps) {
  const params = await searchParams
  const bookingId = params.booking_id

  if (!bookingId) {
    return (
      <ErrorScreen
        title="Booking not found"
        message="We couldn't find your booking. Head back and try again."
      />
    )
  }

  const booking = await getBookingForPaymentConfirmation(bookingId)

  if (!booking) {
    return (
      <ErrorScreen
        title="Payment already completed"
        message="This booking has already been paid or can't be confirmed. Check your dashboard for details."
      />
    )
  }

  return (
    <ConfirmSubscriptionPayment
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
