import { ArchiveX } from "lucide-react"

import { StorageStatusBadge } from "@/components/dashboard/storage-status-badge"
import type { StorageStatus } from "@/components/dashboard/storage-status-badge"
import { Card } from "@/components/ui/card"

export interface PastBooking {
  id: string
  title: string
  pickupDate: string
  deliveredDate: string
  address: string
  university: string
  boxes: number
  boxesLabel: string
  plan: string
  status: StorageStatus
  total: string
}

interface PastBookingsProps {
  bookings: PastBooking[]
}

function EmptyPastState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center shadow-brand">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-soft">
        <ArchiveX className="h-5 w-5 text-primary" />
      </div>
      <p className="font-semibold text-foreground">No past bookings</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Your booking history will appear here.
      </p>
    </div>
  )
}

export function PastBookings({ bookings }: PastBookingsProps) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
        Past bookings
      </h2>

      {bookings.length === 0 ? (
        <EmptyPastState />
      ) : (
        <Card className="gap-0 overflow-hidden rounded-3xl border-0 py-0 shadow-brand">
          <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr_auto] gap-4 bg-muted px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground md:grid">
            <span>Booking</span>
            <span>Pickup</span>
            <span>Delivered</span>
            <span>Boxes</span>
            <span className="text-right">Status</span>
          </div>

          <ul role="list">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="grid gap-y-1 border-t border-border px-4 py-4 transition-colors hover:bg-primary/[0.04] md:grid-cols-[1.6fr_1fr_1fr_1fr_auto] md:items-center md:gap-4 md:px-5"
              >
                <div>
                  <p className="text-sm font-bold text-foreground">{booking.title}</p>
                  <p className="text-xs text-muted-foreground">{booking.address}</p>
                </div>

                <div className="hidden text-sm text-foreground md:block">{booking.pickupDate}</div>
                <div className="hidden text-sm text-foreground md:block">{booking.deliveredDate}</div>
                <div className="hidden text-sm text-foreground md:block">{booking.boxesLabel}</div>

                <div className="flex items-center justify-between md:justify-end md:gap-3">
                  <StorageStatusBadge status={booking.status} />
                  <span className="text-xs font-bold text-muted-foreground">{booking.total}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
  )
}
