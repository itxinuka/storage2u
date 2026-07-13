"use client"

import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
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

type MoveInStatus = Database["public"]["Enums"]["move_in_booking_status"]

export type AdminMoveInBooking = {
  id: string
  customerName: string
  email: string
  universityName: string
  campusName: string
  address: string
  distanceKm: number
  moveInDate: string
  totalCents: number
  status: MoveInStatus
  createdAt: string
}

export type AdminMoveInQuoteRequest = {
  id: string
  name: string
  email: string
  phone: string
  universityName: string
  campusName: string
  address: string
  distanceKm: number | null
  moveInDate: string
  createdAt: string
}

const STATUS_BADGE: Record<
  MoveInStatus,
  { label: string; className: string }
> = {
  pending_payment: {
    label: "Payment Pending",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  confirmed: {
    label: "Confirmed",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-red-200 bg-red-50 text-red-700",
  },
}

function formatDate(date: string | null): string {
  if (!date) return "TBD"
  return new Date(date).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`
}

type MoveInAdminPanelProps = {
  bookings: AdminMoveInBooking[]
  quoteRequests: AdminMoveInQuoteRequest[]
}

export function MoveInAdminPanel({
  bookings,
  quoteRequests,
}: MoveInAdminPanelProps) {
  const [tab, setTab] = useState<"bookings" | "quotes">("bookings")

  const sortedBookings = useMemo(
    () =>
      [...bookings].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [bookings]
  )

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Move-in</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          One-time university move-in bookings and custom quote requests.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
          <TabsTrigger value="quotes">Quote requests ({quoteRequests.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "bookings" ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No move-in bookings yet.
                  </TableCell>
                </TableRow>
              ) : (
                sortedBookings.map((b) => {
                  const badge = STATUS_BADGE[b.status]
                  return (
                    <TableRow key={b.id}>
                      <TableCell>
                        <div className="font-medium">{b.customerName}</div>
                        <div className="text-xs text-muted-foreground">{b.email}</div>
                      </TableCell>
                      <TableCell>
                        <div>{b.universityName}</div>
                        <div className="text-xs text-muted-foreground">{b.campusName}</div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{b.address}</TableCell>
                      <TableCell>{b.distanceKm.toFixed(1)} km</TableCell>
                      <TableCell>{formatDate(b.moveInDate)}</TableCell>
                      <TableCell>{formatMoney(b.totalCents)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={badge.className}>
                          {badge.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Move-in</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quoteRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No quote requests yet.
                  </TableCell>
                </TableRow>
              ) : (
                quoteRequests.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>
                      <div className="font-medium">{q.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {q.email} · {q.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{q.universityName}</div>
                      <div className="text-xs text-muted-foreground">{q.campusName}</div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{q.address}</TableCell>
                    <TableCell>
                      {q.distanceKm != null ? `${q.distanceKm.toFixed(1)} km` : "—"}
                    </TableCell>
                    <TableCell>{formatDate(q.moveInDate)}</TableCell>
                    <TableCell>{formatDate(q.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
