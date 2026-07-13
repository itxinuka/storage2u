import { MoveInAdminPanel } from "@/components/admin/move-in-admin-panel"
import {
  getCampusById,
  getUniversityById,
} from "@/lib/move-in-campuses"
import { createServiceRoleClient } from "@/lib/supabase/service"
import type { HomeAddress } from "@/lib/mapbox"

export default async function AdminMoveInPage() {
  const supabase = createServiceRoleClient()

  const [{ data: bookings }, { data: quoteRequests }] = await Promise.all([
    supabase
      .from("move_in_bookings")
      .select(
        `
        id,
        university_id,
        campus_id,
        home_address,
        distance_km,
        move_in_date,
        total_cents,
        status,
        created_at,
        contact_name,
        contact_email,
        profiles ( full_name, email )
      `
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("move_in_quote_requests")
      .select("*")
      .order("created_at", { ascending: false }),
  ])

  const formattedBookings =
    bookings?.map((b) => {
      const profile = b.profiles as { full_name: string | null; email: string | null } | null
      const home = b.home_address as HomeAddress
      const university = getUniversityById(b.university_id)
      const campus = getCampusById(b.campus_id)
      return {
        id: b.id,
        customerName: profile?.full_name ?? b.contact_name ?? "—",
        email: profile?.email ?? b.contact_email ?? "—",
        universityName: university?.name ?? b.university_id,
        campusName: campus?.name ?? b.campus_id,
        address: `${home.street}, ${home.city}, ${home.province} ${home.postalCode}`,
        distanceKm: Number(b.distance_km),
        moveInDate: b.move_in_date,
        totalCents: b.total_cents,
        status: b.status,
        createdAt: b.created_at,
      }
    }) ?? []

  const formattedQuotes =
    quoteRequests?.map((q) => {
      const home = q.home_address as HomeAddress
      const university = getUniversityById(q.university_id)
      const campus = getCampusById(q.campus_id)
      return {
        id: q.id,
        name: q.name,
        email: q.email,
        phone: q.phone,
        universityName: university?.name ?? q.university_id,
        campusName: campus?.name ?? q.campus_id,
        address: `${home.street}, ${home.city}, ${home.province} ${home.postalCode}`,
        distanceKm: q.distance_km != null ? Number(q.distance_km) : null,
        moveInDate: q.move_in_date,
        createdAt: q.created_at,
      }
    }) ?? []

  return (
    <MoveInAdminPanel
      bookings={formattedBookings}
      quoteRequests={formattedQuotes}
    />
  )
}
