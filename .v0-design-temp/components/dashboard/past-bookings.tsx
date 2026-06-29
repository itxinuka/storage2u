import { ArchiveX } from "lucide-react"
import { StorageStatusBadge } from "./storage-status-badge"
import type { StorageStatus } from "./storage-status-badge"

export interface PastBooking {
  id: string
  pickupDate: string
  deliveredDate: string
  address: string
  university: string
  boxes: number
  plan: string
  status: StorageStatus
  total: string
}

interface PastBookingsProps {
  bookings: PastBooking[]
}

function EmptyPastState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <ArchiveX className="h-4.5 w-4.5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">No past bookings</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Your booking history will appear here.
      </p>
    </div>
  )
}

export function PastBookings({ bookings }: PastBookingsProps) {
  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Past bookings
      </h2>

      {bookings.length === 0 ? (
        <EmptyPastState />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Table header */}
          <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 border-b border-border bg-muted/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
            <span>Location</span>
            <span>Pickup</span>
            <span>Delivered</span>
            <span>Plan</span>
            <span className="text-right">Status</span>
          </div>

          {/* Rows */}
          <ul role="list" className="divide-y divide-border">
            {bookings.map((booking, i) => (
              <li
                key={booking.id}
                className="grid gap-y-1 px-5 py-4 text-sm transition-colors hover:bg-muted/30 sm:grid-cols-[1.5fr_1fr_1fr_1fr_auto] sm:items-center sm:gap-4"
              >
                {/* Location */}
                <div>
                  <p className="font-medium text-foreground">{booking.university}</p>
                  <p className="text-xs text-muted-foreground">{booking.address}</p>
                </div>

                {/* Pickup */}
                <div>
                  <span className="inline text-xs font-medium text-muted-foreground sm:hidden">
                    Pickup:{" "}
                  </span>
                  <span className="text-foreground">{booking.pickupDate}</span>
                </div>

                {/* Delivered */}
                <div>
                  <span className="inline text-xs font-medium text-muted-foreground sm:hidden">
                    Delivered:{" "}
                  </span>
                  <span className="text-foreground">{booking.deliveredDate}</span>
                </div>

                {/* Plan */}
                <div>
                  <span className="inline text-xs font-medium text-muted-foreground sm:hidden">
                    Plan:{" "}
                  </span>
                  <span className="text-foreground">
                    {booking.plan} &middot; {booking.boxes}{" "}
                    {booking.boxes === 1 ? "box" : "boxes"}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between sm:justify-end">
                  <StorageStatusBadge status={booking.status} />
                  <span className="ml-3 text-xs font-medium text-muted-foreground">
                    {booking.total}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
