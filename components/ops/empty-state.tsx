import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

type EmptyStateProps = {
  label: string
  className?: string
}

export function EmptyState({ label, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "px-6 py-12 text-center text-muted-foreground",
        className
      )}
    >
      <Search
        className="mx-auto mb-2.5 size-7 text-border"
        aria-hidden
      />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  )
}
