"use client"

import { Box, Package, Truck } from "lucide-react"

import { OrderStatus } from "@/components/ops/order-status"
import { Badge } from "@/components/ui/badge"
import type { OpsOrder } from "@/lib/ops/orders-types"
import { cn } from "@/lib/utils"

function TypeBadge({ type }: { type: OpsOrder["type"] }) {
  if (type === "pickup") {
    return (
      <Badge className="rounded-full border-transparent bg-purple-soft font-bold text-primary">
        Pickup
      </Badge>
    )
  }
  return (
    <Badge className="rounded-full border-transparent bg-lime-soft font-bold text-accent-foreground">
      Delivery
    </Badge>
  )
}

function formatUnitPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`
}

function formatSubtotal(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`
}

function formatMonthlyTotal(cents: number): string {
  return `$${Math.round(cents / 100)}`
}

type OrderDetailProps = {
  order: OpsOrder
  className?: string
}

export function OrderDetail({ order, className }: OrderDetailProps) {
  const typeLabel = order.type === "pickup" ? "Pickup" : "Delivery"
  const monthlyTotal =
    order.monthlyTotalCents > 0
      ? order.monthlyTotalCents
      : order.lineItems.reduce((sum, item) => sum + item.subtotalCents, 0)

  const meta = [
    ["Customer", order.customer],
    ["Campus", order.universityFull ?? order.university],
    ["Order placed", order.placedDateLabel],
    [`Scheduled ${typeLabel.toLowerCase()}`, order.scheduledDate],
  ] as const

  return (
    <div className={cn(className)}>
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <TypeBadge type={order.type} />
        <OrderStatus status={order.status} />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3.5">
        {meta.map(([label, value]) => (
          <div key={label}>
            <span className="block text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
              {label}
            </span>
            <span className="mt-0.5 block text-[14.5px] font-bold text-foreground">
              {value}
            </span>
          </div>
        ))}
      </div>

      <span className="mb-2.5 block text-[12px] font-bold tracking-wide text-muted-foreground uppercase">
        Items &amp; monthly cost
      </span>

      <div className="overflow-hidden rounded-3xl bg-card shadow-brand">
        {order.lineItems.length === 0 ? (
          <div className="px-4 py-5 text-sm text-muted-foreground">
            No line items on this order.
          </div>
        ) : (
          order.lineItems.map((line, index) => {
            const Icon = line.kind === "box" ? Box : Package
            return (
              <div
                key={line.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5",
                  index > 0 && "border-t border-border"
                )}
              >
                <span className="inline-flex size-[38px] shrink-0 items-center justify-center rounded-xl bg-purple-50 text-primary">
                  <Icon className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-foreground">
                    {line.label}
                  </div>
                  <div className="text-[12.5px] text-muted-foreground">
                    {line.qty} × {formatUnitPrice(line.unitPriceCents)}/mo
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {formatSubtotal(line.subtotalCents)}/mo
                </span>
              </div>
            )
          })
        )}

        <div className="flex items-center justify-between bg-muted px-4 py-3.5">
          <span className="text-[13.5px] font-bold text-muted-foreground">
            Monthly total
          </span>
          <span className="text-xl font-extrabold text-foreground">
            {formatMonthlyTotal(monthlyTotal)}
            <span className="text-[12.5px] font-medium text-muted-foreground">
              /mo
            </span>
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-muted-foreground">
        <Truck className="size-[15px] shrink-0" />
        <span className="text-[12.5px]">
          Assigned to {order.driver ?? "Unassigned"} · free pickup &amp;
          delivery on campus
        </span>
      </div>
    </div>
  )
}
