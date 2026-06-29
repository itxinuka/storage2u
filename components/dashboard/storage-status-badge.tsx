import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StorageStatus =
  | "in_storage"
  | "picked_up"
  | "delivered"
  | "pending"
  | "scheduled"
  | "cancelled"
  | "out_for_delivery"

const config: Record<
  StorageStatus,
  { label: string; className: string }
> = {
  in_storage: {
    label: "In storage",
    className: "border-transparent bg-purple-soft text-primary",
  },
  picked_up: {
    label: "Picked up",
    className: "border-transparent bg-muted text-muted-foreground",
  },
  out_for_delivery: {
    label: "Out for delivery",
    className: "border-transparent bg-accent text-accent-foreground",
  },
  delivered: {
    label: "Delivered",
    className: "border-transparent bg-lime-soft text-accent-foreground",
  },
  pending: {
    label: "Pending",
    className: "border-transparent bg-amber-100 text-amber-800",
  },
  scheduled: {
    label: "Scheduled",
    className: "border-transparent bg-purple-soft text-primary",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-transparent bg-red-100 text-red-700",
  },
}

interface StorageStatusBadgeProps {
  status: StorageStatus
}

export function StorageStatusBadge({ status }: StorageStatusBadgeProps) {
  const { label, className } = config[status] ?? config.pending
  return (
    <Badge variant="outline" className={cn("rounded-full font-bold", className)}>
      {label}
    </Badge>
  )
}
