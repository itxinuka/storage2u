import { Badge } from "@/components/ui/badge"
import type { Database } from "@/lib/database.types"
import { cn } from "@/lib/utils"

type DeliveryRequestStatus = Database["public"]["Enums"]["delivery_request_status"]
export type DeliveryStatus = DeliveryRequestStatus | "scheduled"

const config: Record<
  DeliveryStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "border-transparent bg-amber-100 text-amber-800",
  },
  scheduled: {
    label: "Scheduled",
    className: "border-transparent bg-purple-soft text-primary",
  },
  in_transit: {
    label: "In transit",
    className: "border-transparent bg-accent text-accent-foreground",
  },
  delivered: {
    label: "Delivered",
    className: "border-transparent bg-lime-soft text-accent-foreground",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-transparent bg-red-100 text-red-700",
  },
}

interface DeliveryStatusBadgeProps {
  status: DeliveryStatus
}

export function DeliveryStatusBadge({ status }: DeliveryStatusBadgeProps) {
  const { label, className } = config[status] ?? config.pending
  return (
    <Badge variant="outline" className={cn("rounded-full font-bold", className)}>
      {label}
    </Badge>
  )
}
