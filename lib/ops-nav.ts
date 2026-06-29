export const opsNavPaths = {
  schedule: "/ops/schedule",
  orders: "/ops/orders",
  customers: "/ops/customers",
  warehouses: "/ops/warehouses",
} as const

export type OpsNavId = keyof typeof opsNavPaths

export function getActiveOpsNavId(pathname: string): OpsNavId {
  if (pathname.startsWith("/ops/orders")) return "orders"
  if (pathname.startsWith("/ops/customers")) return "customers"
  if (pathname.startsWith("/ops/warehouses")) return "warehouses"
  return "schedule"
}

export const opsNavItems = [
  { id: "schedule" as const, label: "Schedule", icon: "calendar-days" },
  { id: "orders" as const, label: "Orders", icon: "inbox" },
  { id: "customers" as const, label: "Customers", icon: "users" },
  { id: "warehouses" as const, label: "Warehouses", icon: "archive" },
] as const
