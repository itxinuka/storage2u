"use client"

import { usePathname } from "next/navigation"

import {
  DashboardBottomNav,
  DashboardMobileHeader,
  DashboardSidebar,
} from "@/components/dashboard/dashboard-shell"
import { getActiveNavId } from "@/lib/dashboard-nav"

export function DashboardLayoutShell({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const active = getActiveNavId(pathname)

  return (
    <div className="min-h-screen bg-background lg:flex">
      <DashboardSidebar active={active} />

      <div className="min-w-0 flex-1">
        <DashboardMobileHeader />

        <main className="mx-auto max-w-[1080px] px-4 py-6 pb-28 lg:px-8 lg:py-8 lg:pb-12">
          {children}
        </main>
      </div>

      <DashboardBottomNav active={active} />
    </div>
  )
}
