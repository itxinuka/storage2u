import { Badge } from "@/components/ui/badge"
import type { OpsOrderStatus } from "@/lib/ops-types"
import { cn } from "@/lib/utils"

const config: Record<
  OpsOrderStatus,
  { label: string; className: string }
> = {
  scheduled: {
    label: "Scheduled",
    className: "border-transparent bg-muted text-muted-foreground",
  },
  in_storage: {
    label: "In storage",
    className: "border-transparent bg-purple-soft text-primary",
  },
  out_for_delivery: {
    label: "Out for delivery",
    className: "border-transparent bg-primary text-primary-foreground",
  },
  delivered: {
    label: "Delivered",
    className: "border-transparent bg-lime-soft text-accent-foreground",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-transparent bg-muted text-muted-foreground",
  },
}

type OrderStatusProps = {
  status: OpsOrderStatus
  className?: string
}

export function OrderStatus({ status, className }: OrderStatusProps) {
  const { label, className: toneClass } =
    config[status] ?? config.scheduled

  return (
    <Badge
      variant="outline"
      className={cn("rounded-full font-bold", toneClass, className)}
    >
      {label}
    </Badge>
  )
}
