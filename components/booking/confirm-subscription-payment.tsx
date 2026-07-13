"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowRight, Box, CalendarDays, CreditCard, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { confirmSubscriptionBooking } from "@/app/book/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { computeSelectionTotals, formatSelectionCounts } from "@/lib/booking-catalog"
import type { BookingWithItems } from "@/lib/database.types"
import { monthlyTotalWithProtection } from "@/lib/protection-plan"

function formatDisplayDate(date: string | null): string {
  if (!date) return "TBD"
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

type ConfirmSubscriptionPaymentProps = {
  booking: BookingWithItems
  mode: "pickup" | "delivery"
}

export function ConfirmSubscriptionPayment({
  booking,
  mode,
}: ConfirmSubscriptionPaymentProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const selection: Record<string, number> = {}
  for (const item of booking.booking_items ?? []) {
    selection[item.catalog_id] = item.qty
  }
  const totals = computeSelectionTotals(selection)
  const monthlyTotal = monthlyTotalWithProtection(
    totals.total,
    booking.protection_plan
  )

  const title =
    mode === "delivery" ? "Confirm your move-in booking" : "Confirm your pickup booking"

  async function handleConfirm() {
    setSubmitting(true)
    try {
      const result = await confirmSubscriptionBooking(booking.id)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      router.push(`/book/complete?booking_id=${result.bookingId}`)
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-6">
          <Logo size="lg" />
          <Link
            href="/book?checkout=cancelled"
            className="text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            Back to booking
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-xl px-6 py-12">
        <Card className="gap-0 border-0 py-0 shadow-brand">
          <CardContent className="p-8 sm:p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-soft">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-center text-3xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-center text-[15px] leading-relaxed text-muted-foreground">
              You already have an active Storage2U subscription. Confirm below to add these
              items to your monthly plan. Your card on file will be charged any prorated amount
              today.
            </p>

            <Card className="mx-auto mt-6 gap-0 border-0 py-0 shadow-[inset_0_0_0_1px_var(--color-border)]">
              <CardContent className="space-y-3.5 p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-soft">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <p className="font-bold text-foreground">
                      {formatDisplayDate(booking.pickup_date)}
                    </p>
                    <p className="text-sm text-muted-foreground">{booking.time_window}</p>
                  </div>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-soft">
                    <Box className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <p className="font-bold text-foreground">
                      {formatSelectionCounts(selection)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${monthlyTotal}/mo added to your subscription
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-5 flex items-start gap-2 px-1 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              Stripe Checkout is only used for your first subscription. Returning customers confirm
              here so items are added to your existing plan instead of creating a duplicate
              subscription.
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <Button onClick={handleConfirm} disabled={submitting} className="w-full">
                {submitting ? "Confirming…" : `Confirm & add $${monthlyTotal}/mo`}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                render={<Link href="/book?checkout=cancelled" />}
                className="w-full"
              >
                Go back and edit
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
