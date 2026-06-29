"use client"

import Link from "next/link"
import { useUser, UserButton } from "@clerk/nextjs"
import { Package } from "lucide-react"

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function DashboardNavbar() {
  const { user, isLoaded } = useUser()

  const displayName =
    user?.fullName ??
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ??
    "Student"
  const email = user?.primaryEmailAddress?.emailAddress ?? ""
  const initials = getInitials(displayName)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-card px-6">
      <Link href="/" className="flex items-center gap-2 text-primary">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <Package className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-heading text-base font-semibold tracking-tight">
          Storage<span className="text-accent">2U</span>
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-3">
        {isLoaded && user ? (
          <>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground select-none">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none text-foreground">
                  {displayName}
                </p>
                {email ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{email}</p>
                ) : null}
              </div>
            </div>

            <div className="h-5 w-px bg-border" />

            <UserButton />
          </>
        ) : null}
      </div>
    </header>
  )
}
