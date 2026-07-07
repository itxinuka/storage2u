import Link from "next/link"
import {
  ArrowRight,
  Box,
  CalendarDays,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import type { BookingWithItems } from "@/lib/database.types"
import { computeSelectionTotals } from "@/lib/booking-catalog"

function formatDisplayDate(date: string | null): string {
  if (!date) return "TBD"
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

type BookingConfirmationProps = {
  booking: BookingWithItems
  mode: "pickup" | "delivery"
}

export function BookingConfirmation({ booking, mode }: BookingConfirmationProps) {
  const M =
    mode === "delivery"
      ? {
          confTitle: "Move-in booked!",
          confVerb: "We'll deliver everything to",
        }
      : {
          confTitle: "You're all booked!",
          confVerb: "Our team will be at",
        }

  const selection: Record<string, number> = {}
  for (const item of booking.booking_items ?? []) {
    selection[item.catalog_id] = item.qty
  }
  const totals = computeSelectionTotals(selection)

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
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent shadow-brand">
              <Check className="h-10 w-10 text-accent-foreground" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              {M.confTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              We&apos;ve saved your booking. {M.confVerb}{" "}
              <strong className="text-foreground">{booking.pickup_address}</strong> on{" "}
              {formatDisplayDate(booking.pickup_date)}.
            </p>
            <Card className="mx-auto mt-6 max-w-md gap-0 border-0 py-0 text-left shadow-[inset_0_0_0_1px_var(--color-border)]">
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
                      {totals.boxCount} boxes · {totals.itemCount} items · ${totals.total}/mo
                    </p>
                    <p className="text-sm text-muted-foreground">Free pickup & delivery</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button render={<Link href="/dashboard" />}>
                Go to My Storage
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="w-full text-xs text-muted-foreground">
                Booking #{booking.id.slice(0, 8)}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
