import {
  BookingsTable,
  type AdminBooking,
} from "@/components/admin/bookings-table"
import type { Database } from "@/lib/database.types"
import { createServiceRoleClient } from "@/lib/supabase/service"

type BookingStatus = Database["public"]["Enums"]["booking_status"]

type BookingRow = {
  id: string
  status: BookingStatus
  pickup_date: string | null
  pickup_address: string
  created_at: string
  profiles: {
    full_name: string | null
    email: string | null
  } | null
  items: { id: string }[]
}

export default async function AdminBookingsPage() {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      status,
      pickup_date,
      pickup_address,
      created_at,
      profiles (
        full_name,
        email
      ),
      items (
        id
      )
    `
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch admin bookings:", error)
  }

  const bookings: AdminBooking[] = ((data as BookingRow[] | null) ?? []).map(
    (row) => ({
      id: row.id,
      customerName: row.profiles?.full_name ?? "—",
      email: row.profiles?.email ?? "—",
      pickupDate: row.pickup_date,
      address: row.pickup_address,
      itemCount: row.items?.length ?? 0,
      status: row.status,
      createdAt: row.created_at,
    })
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and manage all customer bookings.
        </p>
      </div>
      <BookingsTable bookings={bookings} />
    </div>
  )
}
