import type { OpsOrder } from "@/lib/ops/orders-types"
import { getOrdersPageData } from "@/lib/ops/orders-data"
import type { CustomersPageData, OpsCustomer } from "@/lib/ops/customers-types"
import {
  deriveActiveMonthlyCents,
  deriveCustomerStatus,
  deriveStoredBoxCount,
} from "@/lib/ops/customers-types"
import { createServiceRoleClient } from "@/lib/supabase/service"

const UNIVERSITY_SHORT: Record<string, string> = {
  "University of British Columbia": "UBC",
  "Simon Fraser University": "SFU",
  "University of Toronto": "U of T",
  "McGill University": "McGill",
  "University of Waterloo": "Waterloo",
  "Queen's University": "Queen's",
  "Western University": "Western",
  "McMaster University": "McMaster",
  "University of Alberta": "U of A",
  "York University": "York",
  "Concordia University": "Concordia",
  "Dalhousie University": "Dalhousie",
  "Memorial University": "Memorial",
}

function shortenUniversity(name: string | null | undefined): string {
  if (!name) return "—"
  return UNIVERSITY_SHORT[name] ?? name
}

function formatMonthly(cents: number): string {
  if (cents <= 0) return "—"
  return `$${Math.round(cents / 100)}/mo`
}

function formatSinceDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    month: "short",
    year: "numeric",
  })
}

function resolveUniversity(
  profileUniversity: string | null,
  orders: OpsOrder[]
): { short: string; full: string | null } {
  if (profileUniversity) {
    return {
      short: shortenUniversity(profileUniversity),
      full: profileUniversity,
    }
  }

  const latest = orders[0]
  if (latest) {
    return {
      short: latest.university,
      full: latest.universityFull,
    }
  }

  return { short: "—", full: null }
}

function buildCustomer(
  profile: {
    id: string
    full_name: string | null
    email: string | null
    phone: string | null
    university: string | null
    created_at: string
  },
  orders: OpsOrder[]
): OpsCustomer {
  const monthlyTotalCents = deriveActiveMonthlyCents(orders)
  const { short, full } = resolveUniversity(profile.university, orders)

  return {
    id: profile.id,
    name: profile.full_name?.trim() || "—",
    email: profile.email?.trim() || "—",
    university: short,
    universityFull: full,
    phone: profile.phone?.trim() || "—",
    status: deriveCustomerStatus(orders),
    boxCount: deriveStoredBoxCount(orders),
    monthlyTotalCents,
    monthlyDisplay: formatMonthly(monthlyTotalCents),
    sinceLabel: formatSinceDate(profile.created_at),
  }
}

export async function getCustomersPageData(): Promise<CustomersPageData> {
  const supabase = createServiceRoleClient()

  const [profilesResult, ordersData] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, phone, university, created_at")
      .order("full_name", { ascending: true }),
    getOrdersPageData(),
  ])

  if (profilesResult.error) throw profilesResult.error

  const ordersByProfile = new Map<string, OpsOrder[]>()
  for (const order of ordersData.orders) {
    const current = ordersByProfile.get(order.profileId) ?? []
    current.push(order)
    ordersByProfile.set(order.profileId, current)
  }

  for (const orders of ordersByProfile.values()) {
    orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  const customers = ((profilesResult.data ?? []) as Array<{
    id: string
    full_name: string | null
    email: string | null
    phone: string | null
    university: string | null
    created_at: string
  }>).map((profile) =>
    buildCustomer(profile, ordersByProfile.get(profile.id) ?? [])
  )

  customers.sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "active" ? -1 : 1
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  })

  return {
    customers,
    orders: ordersData.orders,
  }
}
