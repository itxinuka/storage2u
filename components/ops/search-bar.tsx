"use client"

import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn("relative max-w-[380px] min-w-[200px] flex-1", className)}
    >
      <Search
        className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[46px] w-full rounded-full border-0 bg-card px-4 pl-11 text-sm font-medium text-foreground shadow-[inset_0_0_0_2px_var(--border)] outline-none transition-shadow placeholder:text-muted-foreground focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]"
      />
    </div>
  )
}
