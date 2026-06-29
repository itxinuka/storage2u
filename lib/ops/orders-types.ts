import type { OpsOrderStatus } from "@/lib/ops-types"

export type OpsOrderLineItem = {
  id: string
  kind: "box" | "item"
  label: string
  qty: number
  unitPriceCents: number
  subtotalCents: number
}

export type OpsOrder = {
  id: string
  displayId: string
  profileId: string
  customer: string
  customerEmail: string | null
  customerPhone: string | null
  university: string
  universityFull: string | null
  type: "pickup" | "delivery"
  status: OpsOrderStatus
  boxCount: number
  itemCount: number
  scheduledDate: string
  monthlyTotalCents: number
  monthlyDisplay: string
  createdAt: string
  placedDateLabel: string
  lineItems: OpsOrderLineItem[]
  driver: string | null
}

export type OrdersPageData = {
  hub: string
  orders: OpsOrder[]
}

export type OrdersFilterId =
  | "all"
  | "active"
  | "in_storage"
  | "delivered"
  | "cancelled"

export const ORDERS_FILTER_OPTIONS: readonly (readonly [OrdersFilterId, string])[] =
  [
    ["all", "All"],
    ["active", "Active"],
    ["in_storage", "In storage"],
    ["delivered", "Delivered"],
    ["cancelled", "Cancelled"],
  ] as const

export function matchesOrdersFilter(
  status: OpsOrderStatus,
  filter: OrdersFilterId
): boolean {
  if (filter === "all") return true
  if (filter === "active") {
    return (
      status === "scheduled" ||
      status === "in_storage" ||
      status === "out_for_delivery"
    )
  }
  return status === filter
}
