import { getOrdersForCampuses, getOrdersPageData } from "@/lib/ops/orders-data"
import { getOpsHub } from "@/lib/ops/schedule-data"
import type {
  OpsWarehouse,
  OpsWarehouseHolding,
  WarehousesPageData,
} from "@/lib/ops/warehouses-types"
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

const CAMPUS_ALIASES: Record<string, string> = {
  ubc: "UBC",
  "university of british columbia": "UBC",
  sfu: "SFU",
  "simon fraser university": "SFU",
  "u of t": "U of T",
  "university of toronto": "U of T",
  mcgill: "McGill",
  "mcgill university": "McGill",
  waterloo: "Waterloo",
  "university of waterloo": "Waterloo",
  "queen's": "Queen's",
  "queen's university": "Queen's",
  western: "Western",
  "western university": "Western",
  mcmaster: "McMaster",
  "mcmaster university": "McMaster",
  "u of a": "U of A",
  "university of alberta": "U of A",
  york: "York",
  "york university": "York",
  concordia: "Concordia",
  "concordia university": "Concordia",
  dalhousie: "Dalhousie",
  "dalhousie university": "Dalhousie",
  memorial: "Memorial",
  "memorial university": "Memorial",
}

export function normalizeCampusName(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ""
  return CAMPUS_ALIASES[trimmed.toLowerCase()] ?? trimmed
}

export function parseCampusList(input: string): string[] {
  const seen = new Set<string>()
  const campuses: string[] = []

  for (const part of input.split(",")) {
    const campus = normalizeCampusName(part)
    if (!campus) continue
    const key = campus.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    campuses.push(campus)
  }

  return campuses
}

function shortenUniversity(name: string | null | undefined): string {
  if (!name) return "—"
  return UNIVERSITY_SHORT[name] ?? name
}

function profileName(
  profiles:
    | { full_name: string | null }
    | { full_name: string | null }[]
    | null
): string {
  if (!profiles) return "—"
  if (Array.isArray(profiles)) return profiles[0]?.full_name ?? "—"
  return profiles.full_name ?? "—"
}

function formatStoredSince(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

type HoldingRow = {
  id: string
  bay_code: string
  box_count: number
  item_count: number
  stored_since: string
  profiles: { full_name: string | null; university: string | null } | null
  bookings: { university: string | null } | null
}

type WarehouseRow = {
  id: string
  name: string
  city: string
  capacity_pct: number
  units_occupied: number
  box_count: number
  warehouse_campuses: Array<{ campus_name: string }> | null
  storage_holdings: HoldingRow[] | null
}

function mapHolding(row: HoldingRow): OpsWarehouseHolding {
  const university =
    shortenUniversity(row.bookings?.university) ||
    shortenUniversity(row.profiles?.university)

  return {
    id: row.id,
    customer: profileName(row.profiles),
    university,
    bayCode: row.bay_code,
    boxCount: row.box_count,
    itemCount: row.item_count,
    storedSinceLabel: formatStoredSince(row.stored_since),
  }
}

function mapWarehouse(row: WarehouseRow): OpsWarehouse {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    capacityPct: row.capacity_pct,
    unitsOccupied: row.units_occupied,
    boxCount: row.box_count,
    campuses: (row.warehouse_campuses ?? []).map((campus) => campus.campus_name),
    holdings: (row.storage_holdings ?? []).map(mapHolding),
  }
}

export async function getWarehousesPageData(): Promise<WarehousesPageData> {
  const supabase = createServiceRoleClient()
  const hub = getOpsHub()

  const [warehousesResult, ordersData] = await Promise.all([
    supabase
      .from("warehouses")
      .select(
        `
        id,
        name,
        city,
        capacity_pct,
        units_occupied,
        box_count,
        warehouse_campuses ( campus_name ),
        storage_holdings (
          id,
          bay_code,
          box_count,
          item_count,
          stored_since,
          profiles ( full_name, university ),
          bookings ( university )
        )
      `
      )
      .order("name"),
    getOrdersPageData(),
  ])

  if (warehousesResult.error) throw warehousesResult.error

  const warehouses = ((warehousesResult.data as WarehouseRow[] | null) ?? []).map(
    mapWarehouse
  )

  return {
    hub,
    warehouses,
    orders: ordersData.orders,
  }
}

export function getWarehouseOrders(
  warehouse: OpsWarehouse,
  orders: WarehousesPageData["orders"]
) {
  return getOrdersForCampuses(orders, warehouse.campuses)
}
