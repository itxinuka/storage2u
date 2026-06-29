"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { CalendarDays, MapPin, Package, Truck } from "lucide-react"
import { toast } from "sonner"

import { requestDelivery } from "@/app/dashboard/actions"
import { StorageStatusBadge } from "@/components/dashboard/storage-status-badge"
import type { StorageStatus } from "@/components/dashboard/storage-status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export interface ActiveBooking {
  id: string
  title: string
  pickupDate: string
  address: string
  city: string
  university: string
  boxes: number
  boxesLabel: string
  plan: string
  status: StorageStatus
  monthlyCost?: string
}

interface ActiveStorageProps {
  bookings: ActiveBooking[]
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}

function ActiveCard({
  booking,
  requested,
  pending,
  onRequest,
}: {
  booking: ActiveBooking
  requested: boolean
  pending: boolean
  onRequest: (id: string) => void
}) {
  const status: StorageStatus = requested ? "out_for_delivery" : booking.status
  const isOut = status === "out_for_delivery"

  return (
    <Card className="gap-0 overflow-hidden rounded-3xl border-0 py-0 shadow-brand">
      <div
        className={cn(
          "px-5 pb-4 pt-5",
          isOut ? "bg-lime-soft/50" : "bg-purple-soft/70"
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <StorageStatusBadge status={status} />
          <Badge variant="outline" className="rounded-full border-transparent bg-muted font-bold">
            {booking.boxesLabel}
          </Badge>
        </div>
        <h3 className="text-base font-extrabold text-foreground">{booking.title}</h3>
        {booking.monthlyCost ? (
          <p className="mt-1 text-sm font-semibold text-primary">{booking.monthlyCost}</p>
        ) : null}
      </div>

      <div className="space-y-3.5 px-5 py-4">
        <DetailRow icon={CalendarDays} label="Stored since" value={booking.pickupDate} />
        <DetailRow icon={MapPin} label="Pickup address" value={booking.address} />
        {isOut ? (
          <div>
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-muted-foreground">
              <span>Delivery progress</span>
              <span>On the way</span>
            </div>
            <Progress value={72}>
              <ProgressTrack className="h-3 bg-muted">
                <ProgressIndicator className="bg-accent" />
              </ProgressTrack>
            </Progress>
          </div>
        ) : null}
      </div>

      <div className="border-t border-border bg-muted/50 p-4">
        {isOut ? (
          <Button variant="outline" className="w-full">
            <Truck className="h-4 w-4" />
            Track delivery
          </Button>
        ) : (
          <Button
            className="w-full"
            disabled={pending}
            onClick={() => onRequest(booking.id)}
          >
            <Truck className="h-4 w-4" />
            {pending ? "Requesting…" : "Request delivery"}
          </Button>
        )}
      </div>
    </Card>
  )
}

function EmptyActiveState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-brand">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-soft">
        <Package className="h-5 w-5 text-primary" />
      </div>
      <p className="font-semibold text-foreground">No storage yet</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Nothing stored with us right now. Book a pickup and we&apos;ll grab your boxes.
      </p>
      <Button className="mt-5" render={<Link href="/book" />}>
        <Truck className="h-4 w-4" />
        Book a pickup
      </Button>
    </div>
  )
}

export function ActiveStorage({ bookings }: ActiveStorageProps) {
  const [requested, setRequested] = useState<Record<string, boolean>>({})
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const handleRequest = (id: string) => {
    if (pendingId) return
    setPendingId(id)
    // Optimistically flip the badge to "Out for delivery".
    setRequested((r) => ({ ...r, [id]: true }))

    startTransition(async () => {
      const result = await requestDelivery(id)
      if (result.success) {
        toast.success("Delivery requested — we'll text you when it's close.")
      } else {
        // Revert the optimistic update on failure.
        setRequested((r) => {
          const next = { ...r }
          delete next[id]
          return next
        })
        toast.error(result.error)
      }
      setPendingId(null)
    })
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
          Active storage
        </h2>
        <span className="text-sm font-semibold text-muted-foreground">
          {bookings.length} pickups
        </span>
      </div>

      {bookings.length === 0 ? (
        <EmptyActiveState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bookings.map((booking) => (
            <ActiveCard
              key={booking.id}
              booking={booking}
              requested={Boolean(requested[booking.id])}
              pending={pendingId === booking.id}
              onRequest={handleRequest}
            />
          ))}
        </div>
      )}
    </section>
  )
}
