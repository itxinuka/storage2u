import {
  AdminOverview,
  type OverviewDeliveryRequest,
  type OverviewPickup,
} from "@/components/admin/admin-overview"
import { createServiceRoleClient } from "@/lib/supabase/service"

type ScheduledBookingRow = {
  id: string
  pickup_date: string | null
  pickup_address: string
  profiles: {
    full_name: string | null
  } | null
  items: { id: string }[]
}

type PendingDeliveryRow = {
  id: string
  requested_date: string | null
  delivery_address: string
  profiles: {
    full_name: string | null
  } | null
}

function getTodayDateString(): string {
  return new Date().toLocaleDateString("en-CA")
}

export default async function AdminPage() {
  const supabase = createServiceRoleClient()
  const today = getTodayDateString()

  const [
    scheduledResult,
    pendingDeliveriesResult,
    inStorageResult,
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select(
        `
        id,
        pickup_date,
        pickup_address,
        profiles (
          full_name
        ),
        items (
          id
        )
      `
      )
      .eq("status", "scheduled")
      .order("pickup_date", { ascending: true }),
    supabase
      .from("delivery_requests")
      .select(
        `
        id,
        requested_date,
        delivery_address,
        profiles (
          full_name
        )
      `
      )
      .eq("status", "pending")
      .order("requested_date", { ascending: true }),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "in_storage"),
  ])

  if (scheduledResult.error) {
    console.error("Failed to fetch scheduled bookings:", scheduledResult.error)
  }
  if (pendingDeliveriesResult.error) {
    console.error(
      "Failed to fetch pending delivery requests:",
      pendingDeliveriesResult.error
    )
  }
  if (inStorageResult.error) {
    console.error("Failed to fetch in-storage count:", inStorageResult.error)
  }

  const scheduledBookings =
    (scheduledResult.data as ScheduledBookingRow[] | null) ?? []

  const todaysPickups: OverviewPickup[] = scheduledBookings
    .filter((row) => row.pickup_date === today)
    .map((row) => ({
      id: row.id,
      customerName: row.profiles?.full_name ?? "—",
      address: row.pickup_address,
      pickupDate: row.pickup_date,
      itemCount: row.items?.length ?? 0,
    }))

  const pendingDeliveryRequests: OverviewDeliveryRequest[] = (
    (pendingDeliveriesResult.data as PendingDeliveryRow[] | null) ?? []
  ).map((row) => ({
    id: row.id,
    customerName: row.profiles?.full_name ?? "—",
    requestedDate: row.requested_date,
    deliveryAddress: row.delivery_address,
  }))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daily operations at a glance.
        </p>
      </div>
      <AdminOverview
        upcomingPickupsCount={scheduledBookings.length}
        pendingDeliveriesCount={pendingDeliveryRequests.length}
        inStorageCount={inStorageResult.count ?? 0}
        todaysPickups={todaysPickups}
        pendingDeliveryRequests={pendingDeliveryRequests}
      />
    </div>
  )
}
