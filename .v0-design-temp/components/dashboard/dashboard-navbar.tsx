"use client"

import { Package, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-card px-6">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 text-primary">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <Package className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-heading text-base font-semibold tracking-tight">
          Storage<span className="text-accent">2U</span>
        </span>
      </a>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Avatar + name */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground select-none">
            AJ
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none text-foreground">Alex Johnson</p>
            <p className="mt-0.5 text-xs text-muted-foreground">alex@queensu.ca</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Sign out */}
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </header>
  )
}
