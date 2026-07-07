"use client"

import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Database } from "@/lib/database.types"

type BookingStatus = Database["public"]["Enums"]["booking_status"]

export type AdminBooking = {
  id: string
  customerName: string
  email: string
  pickupDate: string | null
  address: string
  itemCount: number
  status: BookingStatus
  createdAt: string
}

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "pending_payment", label: "Payment Pending" },
  { value: "scheduled", label: "Scheduled" },
  { value: "picked_up", label: "Picked Up" },
  { value: "in_storage", label: "In Storage" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const

const STATUS_BADGE: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  pending_payment: {
    label: "Payment Pending",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  scheduled: {
    label: "Scheduled",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  picked_up: {
    label: "Picked Up",
    className: "border-zinc-200 bg-zinc-100 text-zinc-600",
  },
  in_storage: {
    label: "In Storage",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  delivered: {
    label: "Delivered",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-red-200 bg-red-50 text-red-700",
  },
}

function formatDate(date: string | null): string {
  if (!date) return "TBD"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatDateTime(date: string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

interface BookingsTableProps {
  bookings: AdminBooking[]
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredBookings = useMemo(() => {
    if (statusFilter === "all") return bookings
    return bookings.filter((booking) => booking.status === statusFilter)
  }, [bookings, statusFilter])

  return (
    <div className="space-y-4">
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Pickup date</TableHead>
              <TableHead>Address</TableHead>
              <TableHead># of boxes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {booking.customerName}
                  </TableCell>
                  <TableCell>{booking.email}</TableCell>
                  <TableCell>{formatDate(booking.pickupDate)}</TableCell>
                  <TableCell className="max-w-[240px] truncate">
                    {booking.address}
                  </TableCell>
                  <TableCell>{booking.itemCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={STATUS_BADGE[booking.status].className}
                    >
                      {STATUS_BADGE[booking.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(booking.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
