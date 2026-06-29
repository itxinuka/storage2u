export const dashboardNavPaths = {
  storage: "/dashboard",
  deliveries: "/dashboard/deliveries",
  billing: "/dashboard/billing",
  account: "/dashboard/account",
} as const

export type DashboardNavId = keyof typeof dashboardNavPaths

export function getActiveNavId(pathname: string): DashboardNavId {
  if (pathname.startsWith("/dashboard/deliveries")) return "deliveries"
  if (pathname.startsWith("/dashboard/billing")) return "billing"
  if (pathname.startsWith("/dashboard/account")) return "account"
  return "storage"
}
