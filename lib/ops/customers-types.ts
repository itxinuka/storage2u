import type { OpsOrderStatus } from "@/lib/ops-types"
import type { OpsOrder } from "@/lib/ops/orders-types"

export type OpsCustomerStatus = "active" | "past"

export type OpsCustomer = {
  id: string
  name: string
  email: string
  university: string
  universityFull: string | null
  phone: string
  status: OpsCustomerStatus
  boxCount: number
  monthlyTotalCents: number
  monthlyDisplay: string
  sinceLabel: string
}

export type CustomersPageData = {
  customers: OpsCustomer[]
  orders: OpsOrder[]
}

export type CustomersFilterId = "all" | "active" | "past"

export const CUSTOMERS_FILTER_OPTIONS: readonly (readonly [
  CustomersFilterId,
  string,
])[] = [
  ["all", "All"],
  ["active", "Active"],
  ["past", "Past"],
] as const

const ACTIVE_ORDER_STATUSES: readonly OpsOrderStatus[] = [
  "scheduled",
  "in_storage",
  "out_for_delivery",
]

const STORED_ORDER_STATUSES: readonly OpsOrderStatus[] = [
  "in_storage",
  "out_for_delivery",
]

export function deriveCustomerStatus(
  orders: OpsOrder[]
): OpsCustomerStatus {
  return orders.some((order) =>
    (ACTIVE_ORDER_STATUSES as readonly string[]).includes(order.status)
  )
    ? "active"
    : "past"
}

export function deriveStoredBoxCount(orders: OpsOrder[]): number {
  return orders
    .filter((order) =>
      (STORED_ORDER_STATUSES as readonly string[]).includes(order.status)
    )
    .reduce((sum, order) => sum + order.boxCount, 0)
}

export function deriveActiveMonthlyCents(orders: OpsOrder[]): number {
  return orders
    .filter((order) =>
      (ACTIVE_ORDER_STATUSES as readonly string[]).includes(order.status)
    )
    .reduce((sum, order) => sum + order.monthlyTotalCents, 0)
}

export function matchesCustomersFilter(
  status: OpsCustomerStatus,
  filter: CustomersFilterId
): boolean {
  if (filter === "all") return true
  return status === filter
}
