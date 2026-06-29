import {
  CustomersTable,
  type AdminCustomer,
} from "@/components/admin/customers-table"
import type { Database } from "@/lib/database.types"
import { createServiceRoleClient } from "@/lib/supabase/service"

type BookingStatus = Database["public"]["Enums"]["booking_status"]

const ACTIVE_STORAGE_STATUSES = new Set<BookingStatus>([
  "in_storage",
  "picked_up",
])

type ProfileRow = {
  id: string
  full_name: string | null
  email: string | null
  university: string | null
  phone: string | null
  created_at: string
  bookings: { id: string; status: BookingStatus }[]
}

export default async function AdminCustomersPage() {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      email,
      university,
      phone,
      created_at,
      bookings (
        id,
        status
      )
    `
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch admin customers:", error)
  }

  const customers: AdminCustomer[] = ((data as ProfileRow[] | null) ?? []).map(
    (profile) => {
      const bookings = profile.bookings ?? []

      return {
        id: profile.id,
        name: profile.full_name ?? "—",
        email: profile.email ?? "—",
        university: profile.university ?? "—",
        phone: profile.phone ?? "—",
        activeItems: bookings.filter((booking) =>
          ACTIVE_STORAGE_STATUSES.has(booking.status)
        ).length,
        totalBookings: bookings.length,
        memberSince: profile.created_at,
      }
    }
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View all registered customers and their booking activity.
        </p>
      </div>
      <CustomersTable customers={customers} />
    </div>
  )
}
