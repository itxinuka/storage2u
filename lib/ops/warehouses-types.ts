import type { OpsOrder } from "@/lib/ops/orders-types"

export type OpsWarehouseHolding = {
  id: string
  customer: string
  university: string
  bayCode: string
  boxCount: number
  itemCount: number
  storedSinceLabel: string
}

export type OpsWarehouse = {
  id: string
  name: string
  city: string
  capacityPct: number
  unitsOccupied: number
  boxCount: number
  campuses: string[]
  holdings: OpsWarehouseHolding[]
}

export type WarehousesPageData = {
  hub: string
  warehouses: OpsWarehouse[]
  orders: OpsOrder[]
}

export type WarehousesTabId = "holdings" | "orders"
