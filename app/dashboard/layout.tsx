import { auth } from "@clerk/nextjs/server"

import { DashboardLayoutShell } from "@/components/dashboard/dashboard-layout-shell"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await auth.protect()

  return <DashboardLayoutShell>{children}</DashboardLayoutShell>
}
