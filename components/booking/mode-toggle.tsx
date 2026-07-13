"use client"

import { GraduationCap, Package } from "lucide-react"

import { cn } from "@/lib/utils"

export type BookFlowMode = "pickup" | "delivery"

export function ModeToggle({
  mode,
  onChange,
}: {
  mode: BookFlowMode
  onChange: (mode: BookFlowMode) => void
}) {
  const opts: { id: BookFlowMode; label: string; icon: typeof Package }[] = [
    { id: "pickup", label: "Store my stuff", icon: Package },
    { id: "delivery", label: "University move-in", icon: GraduationCap },
  ]

  return (
    <div className="mb-6 inline-flex max-w-full gap-1 rounded-full bg-muted p-1">
      {opts.map(({ id, label, icon: Icon }) => {
        const on = mode === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition-all",
              on
                ? "bg-card text-primary shadow-brand"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
