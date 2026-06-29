"use client"

import { cn } from "@/lib/utils"

type FilterTabsProps = {
  value: string
  onChange: (value: string) => void
  options: readonly (readonly [string, string])[]
  className?: string
}

export function FilterTabs({
  value,
  onChange,
  options,
  className,
}: FilterTabsProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap gap-1 rounded-full bg-muted p-1",
        className
      )}
    >
      {options.map(([id, label]) => {
        const active = value === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "cursor-pointer rounded-full border-0 px-4 py-1.5 text-[13px] font-bold whitespace-nowrap transition-colors",
              active
                ? "bg-card text-primary shadow-brand"
                : "bg-transparent text-muted-foreground"
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
