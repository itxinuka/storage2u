import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StorageStatus = "in_storage" | "picked_up" | "delivered" | "pending"

const config: Record<
  StorageStatus,
  { label: string; className: string }
> = {
  in_storage: {
    label: "In Storage",
    className:
      "border-blue-200 bg-blue-50 text-blue-700",
  },
  picked_up: {
    label: "Picked Up",
    className:
      "border-zinc-200 bg-zinc-100 text-zinc-600",
  },
  delivered: {
    label: "Delivered",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  pending: {
    label: "Pending",
    className:
      "border-amber-200 bg-amber-50 text-amber-700",
  },
}

interface StorageStatusBadgeProps {
  status: StorageStatus
}

export function StorageStatusBadge({ status }: StorageStatusBadgeProps) {
  const { label, className } = config[status]
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", className)}
    >
      {label}
    </Badge>
  )
}
