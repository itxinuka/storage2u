"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk, useUser } from "@clerk/nextjs"
import {
  Archive,
  CalendarDays,
  CalendarOff,
  Inbox,
  LogOut,
  MapPin,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Logo } from "@/components/logo"
import { Badge } from "@/components/ui/badge"
import {
  getActiveOpsNavId,
  opsNavItems,
  opsNavPaths,
  type OpsNavId,
} from "@/lib/ops-nav"
import { cn } from "@/lib/utils"

const navIcons: Record<string, LucideIcon> = {
  "calendar-days": CalendarDays,
  "calendar-off": CalendarOff,
  inbox: Inbox,
  users: Users,
  archive: Archive,
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function OpsAvatar({
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

function OpsSidebar({
  active,
  hub,
}: {
  active: OpsNavId
  hub: string
}) {
  const { signOut } = useClerk()

  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col gap-1.5 border-r border-border bg-card px-4 py-5 lg:flex">
      <div className="px-2.5 pb-4">
        <Logo size="md" />
      </div>

      <div className="px-2.5 pb-2.5">
        <Badge
          variant="outline"
          className="rounded-full border-transparent bg-muted font-semibold text-muted-foreground"
        >
          <MapPin className="size-3" />
          {hub}
        </Badge>
      </div>

      <nav className="flex flex-col gap-0.5">
        {opsNavItems.map((item) => {
          const Icon = navIcons[item.icon] ?? CalendarDays
          const isActive = active === item.id
          return (
            <Link
              key={item.id}
              href={opsNavPaths[item.id]}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors",
                isActive
                  ? "bg-purple-50 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-[19px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => signOut({ redirectUrl: "/" })}
        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <LogOut className="size-[19px]" />
        Sign out
      </button>
    </aside>
  )
}

function OpsMobileHeader() {
  const { user } = useUser()
  const displayName = user?.fullName ?? "Staff"

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
      <Logo size="md" />
      <OpsAvatar
        name={displayName}
        imageUrl={user?.imageUrl}
        size={36}
      />
    </header>
  )
}

function OpsBottomNav({ active }: { active: OpsNavId }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-border bg-card px-2 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] lg:hidden">
      {opsNavItems.map((item) => {
        const Icon = navIcons[item.icon] ?? CalendarDays
        const isActive = active === item.id
        return (
          <Link
            key={item.id}
            href={opsNavPaths[item.id]}
            className={cn(
              "flex flex-col items-center gap-1 text-[11px] font-semibold",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="size-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function OpsLayoutShell({
  hub,
  children,
}: Readonly<{
  hub: string
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const active = getActiveOpsNavId(pathname)
  const isLabelsPrint = pathname.includes("/labels")

  return (
    <div
      className={cn(
        "min-h-screen bg-background lg:flex",
        isLabelsPrint && "print:block"
      )}
    >
      <div className={cn(isLabelsPrint && "print:hidden")}>
        <OpsSidebar active={active} hub={hub} />
      </div>

      <div className="min-w-0 flex-1">
        <div className={cn(isLabelsPrint && "print:hidden")}>
          <OpsMobileHeader />
        </div>

        <main
          className={cn(
            "mx-auto max-w-[1040px] px-4 py-6 pb-28 lg:px-8 lg:py-9 lg:pb-12",
            isLabelsPrint && "print:max-w-none print:p-0 print:pb-0"
          )}
        >
          {children}
        </main>
      </div>

      <div className={cn(isLabelsPrint && "print:hidden")}>
        <OpsBottomNav active={active} />
      </div>
    </div>
  )
}
