"use client"

import { CalendarDays, MapPin, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { StorageStatusBadge } from "./storage-status-badge"
import type { StorageStatus } from "./storage-status-badge"

export interface ActiveBooking {
  id: string
  pickupDate: string
  address: string
  city: string
  university: string
  boxes: number
  plan: string
  status: StorageStatus
}

interface ActiveStorageProps {
  bookings: ActiveBooking[]
}

function EmptyActiveState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Package className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">No active storage</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        You have no items in storage right now. Book a pickup to get started.
      </p>
    </div>
  )
}

export function ActiveStorage({ bookings }: ActiveStorageProps) {
  return (
    <section>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Active storage
      </h2>

      {bookings.length === 0 ? (
        <EmptyActiveState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <Card key={booking.id} className="gap-0 pb-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  {booking.university}
                </CardTitle>
                <CardAction>
                  <StorageStatusBadge status={booking.status} />
                </CardAction>
              </CardHeader>

              <CardContent className="flex flex-col gap-2.5 pb-4">
                {/* Pickup date */}
                <div className="flex items-start gap-2 text-sm">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Pickup date
                    </span>
                    <p className="font-medium text-foreground">{booking.pickupDate}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Address
                    </span>
                    <p className="font-medium text-foreground">{booking.address}</p>
                    <p className="text-muted-foreground">{booking.city}</p>
                  </div>
                </div>

                {/* Plan + boxes */}
                <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2">
                  <Package className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {booking.plan} plan &middot; {booking.boxes}{" "}
                    {booking.boxes === 1 ? "box" : "boxes"}
                  </span>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  size="sm"
                  className="w-full gap-1.5 bg-primary text-primary-foreground hover:bg-primary/80"
                >
                  <Truck className="h-3.5 w-3.5" />
                  Request delivery
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
