"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { updateBookingStatus } from "@/app/admin/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type OverviewPickup = {
  id: string
  customerName: string
  address: string
  pickupDate: string | null
  itemCount: number
}

export type OverviewDeliveryRequest = {
  id: string
  customerName: string
  requestedDate: string | null
  deliveryAddress: string
}

interface AdminOverviewProps {
  upcomingPickupsCount: number
  pendingDeliveriesCount: number
  inStorageCount: number
  todaysPickups: OverviewPickup[]
  pendingDeliveryRequests: OverviewDeliveryRequest[]
}

function formatDate(date: string | null): string {
  if (!date) return "TBD"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function AdminOverview({
  upcomingPickupsCount,
  pendingDeliveriesCount,
  inStorageCount,
  todaysPickups,
  pendingDeliveryRequests,
}: AdminOverviewProps) {
  const [isPending, startTransition] = useTransition()
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null)

  function handleMarkPickedUp(bookingId: string) {
    setPendingBookingId(bookingId)
    startTransition(() => {
      updateBookingStatus(bookingId, "picked_up").then((result) => {
        setPendingBookingId(null)
        if (result.success) {
          toast.success("Booking marked as picked up")
        } else {
          toast.error(result.error ?? "Failed to update booking status")
        }
      })
    })
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming pickups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              {upcomingPickupsCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              {pendingDeliveriesCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Items in storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              {inStorageCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight">
            Today&apos;s pickups
          </h2>
          <Badge variant="outline">{todaysPickups.length}</Badge>
        </div>
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Pickup time</TableHead>
                <TableHead># of boxes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todaysPickups.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No pickups scheduled for today.
                  </TableCell>
                </TableRow>
              ) : (
                todaysPickups.map((pickup) => (
                  <TableRow key={pickup.id}>
                    <TableCell className="font-medium">
                      {pickup.customerName}
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate">
                      {pickup.address}
                    </TableCell>
                    <TableCell>{formatDate(pickup.pickupDate)}</TableCell>
                    <TableCell>{pickup.itemCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending && pendingBookingId === pickup.id}
                        onClick={() => handleMarkPickedUp(pickup.id)}
                      >
                        {isPending && pendingBookingId === pickup.id
                          ? "Updating..."
                          : "Mark as picked up"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight">
            Pending delivery requests
          </h2>
          <Badge variant="outline">{pendingDeliveryRequests.length}</Badge>
        </div>
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer name</TableHead>
                <TableHead>Requested delivery date</TableHead>
                <TableHead>Delivery address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingDeliveryRequests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No pending delivery requests.
                  </TableCell>
                </TableRow>
              ) : (
                pendingDeliveryRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.customerName}
                    </TableCell>
                    <TableCell>{formatDate(request.requestedDate)}</TableCell>
                    <TableCell className="max-w-[280px] truncate">
                      {request.deliveryAddress}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" disabled>
                        Mark as out for delivery
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
