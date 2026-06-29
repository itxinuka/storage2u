"use client"

import Image from "next/image"
import Link from "next/link"
import { useClerk, useUser } from "@clerk/nextjs"
import {
  DollarSign,
  LogOut,
  Package,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { siteContent } from "@/lib/site-content"
import { cn } from "@/lib/utils"

const navIcons: Record<string, LucideIcon> = {
  package: Package,
  truck: Truck,
  "dollar-sign": DollarSign,
  users: Users,
}

import { dashboardNavPaths, type DashboardNavId } from "@/lib/dashboard-nav"

type DashboardNavProps = {
  active: DashboardNavId
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function Avatar({
  name,
  imageUrl,
  size,
}: {
  name: string
  imageUrl?: string | null
  size: number
}) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={name}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
      />
    )
  }
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground"
      style={{ height: size, width: size, fontSize: size * 0.35 }}
    >
      {getInitials(name)}
    </span>
  )
}

export function DashboardSidebar({ active }: DashboardNavProps) {
  const { user } = useUser()
  const { signOut } = useClerk()
  const displayName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "Student"
  const campus =
    (user?.publicMetadata?.university as string | undefined) ?? "Your campus"

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-border bg-card px-3.5 py-5 lg:flex">
      <div className="px-2.5 pb-4">
        <Logo size="md" />
      </div>

      <div className="mb-2 flex items-center gap-3 border-b border-border px-2.5 pb-4">
        <Avatar name={user?.fullName ?? displayName} imageUrl={user?.imageUrl} size={40} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{campus}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        {siteContent.dashboard.nav.map((item) => {
          const Icon = navIcons[item.icon] ?? Package
          const isActive = active === item.id
          const href = dashboardNavPaths[item.id as DashboardNavId]
          return (
            <Link
              key={item.id}
              href={href}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-full px-3.5 py-2.5 text-left text-sm font-semibold transition-colors",
                isActive
                  ? "bg-purple-soft text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full",
                  isActive && "bg-primary/10"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex-1" />

      <Card className="mb-2 gap-0 rounded-3xl border-0 bg-primary py-0 text-primary-foreground shadow-brand">
        <CardContent className="flex flex-col gap-2.5 p-4">
          <p className="text-sm font-bold">{siteContent.dashboard.sidebarCta.title}</p>
          <p className="text-xs leading-relaxed text-primary-foreground/75">
            {siteContent.dashboard.sidebarCta.body}
          </p>
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            render={<Link href="/book" />}
          >
            {siteContent.dashboard.sidebarCta.btn}
          </Button>
        </CardContent>
      </Card>

      <button
        type="button"
        onClick={() => signOut({ redirectUrl: "/" })}
        className="flex items-center gap-2.5 rounded-full px-3.5 py-2.5 text-left text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  )
}

export function DashboardBottomNav({ active }: DashboardNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-border bg-card px-2 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] lg:hidden">
      {siteContent.dashboard.nav.map((item) => {
        const Icon = navIcons[item.icon] ?? Package
        const isActive = active === item.id
        const href = dashboardNavPaths[item.id as DashboardNavId]
        return (
          <Link
            key={item.id}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 text-[11px] font-semibold",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function DashboardMobileHeader() {
  const { user } = useUser()

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
      <Logo size="md" />
      <Avatar name={user?.fullName ?? "Student"} imageUrl={user?.imageUrl} size={36} />
    </header>
  )
}

export function DashboardStatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: LucideIcon
  label: string
  value: string
  sub: string
  tone: "purple" | "lime" | "soft"
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3.5 rounded-3xl p-5 shadow-brand transition-transform hover:-translate-y-0.5 hover:shadow-brand-lg",
        tone === "purple" && "bg-primary text-white",
        tone === "lime" && "bg-accent text-accent-foreground",
        tone === "soft" && "bg-card text-foreground"
      )}
    >
      <span
        className={cn(
          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
          tone === "purple" && "bg-white/15",
          tone === "lime" && "bg-accent-foreground/10",
          tone === "soft" && "bg-purple-soft text-primary"
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p
          className={cn(
            "text-[11px] font-bold uppercase tracking-wide",
            tone === "purple" && "text-white/70",
            tone === "lime" && "text-accent-foreground/70",
            tone === "soft" && "text-muted-foreground"
          )}
        >
          {label}
        </p>
        <p className="text-3xl font-extrabold tracking-tight">{value}</p>
        <p
          className={cn(
            "text-xs",
            tone === "purple" && "text-white/65",
            tone === "lime" && "text-accent-foreground/65",
            tone === "soft" && "text-muted-foreground"
          )}
        >
          {sub}
        </p>
      </div>
    </div>
  )
}
