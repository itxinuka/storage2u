import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar"
import { ActiveStorage } from "@/components/dashboard/active-storage"
import { PastBookings } from "@/components/dashboard/past-bookings"
import type { ActiveBooking } from "@/components/dashboard/active-storage"
import type { PastBooking } from "@/components/dashboard/past-bookings"

// ---------------------------------------------------------------------------
// Mock data — replace with real DB queries when auth is wired up
// ---------------------------------------------------------------------------

const activeBookings: ActiveBooking[] = [
  {
    id: "bk-001",
    pickupDate: "April 28, 2025",
    address: "45 Stuart St, Room 312",
    city: "Kingston, ON",
    university: "Queen's University",
    boxes: 4,
    plan: "Standard",
    status: "in_storage",
  },
  {
    id: "bk-002",
    pickupDate: "May 3, 2025",
    address: "1280 Main St W, Unit 7",
    city: "Hamilton, ON",
    university: "McMaster University",
    boxes: 2,
    plan: "Starter",
    status: "picked_up",
  },
]

const pastBookings: PastBooking[] = [
  {
    id: "bk-000",
    pickupDate: "Sep 2, 2024",
    deliveredDate: "Jan 6, 2025",
    address: "45 Stuart St, Room 312",
    university: "Queen's University",
    boxes: 3,
    plan: "Standard",
    status: "delivered",
    total: "$89",
  },
  {
    id: "bk-099",
    pickupDate: "Apr 30, 2023",
    deliveredDate: "Sep 4, 2023",
    address: "150 College St, Unit 2A",
    university: "University of Toronto",
    boxes: 6,
    plan: "Pro",
    status: "delivered",
    total: "$149",
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">
              My Storage
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your stored items and request deliveries
            </p>
          </div>

          <Button
            size="sm"
            className="shrink-0 gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90 sm:self-start"
            render={<Link href="/book" />}
          >
            <Plus className="h-4 w-4" />
            Book a pickup
          </Button>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-10">
          <ActiveStorage bookings={activeBookings} />
          <PastBookings bookings={pastBookings} />
        </div>
      </main>
    </div>
  )
}
