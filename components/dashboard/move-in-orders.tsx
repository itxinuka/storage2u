"use client"

import { useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { useState, useTransition } from "react"
import { CalendarDays, CreditCard, MapPin } from "lucide-react"
import { toast } from "sonner"

import { createMoveInCheckout } from "@/app/book/move-in-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { MoveInDashboardOrder } from "@/lib/move-in-display"
import { cn } from "@/lib/utils"

const STATUS_LABEL: Record<
  MoveInDashboardOrder["status"],
  { label: string; className: string }
> = {
  pending_payment: {
    label: "Payment pending",
    className: "border-transparent bg-amber-100 text-amber-800",
  },
  confirmed: {
    label: "Confirmed",
    className: "border-transparent bg-purple-soft text-primary",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-transparent bg-red-100 text-red-700",
  },
}

function MoveInCard({
  order,
  pending,
  onCompletePayment,
}: {
  order: MoveInDashboardOrder
  pending: boolean
  onCompletePayment: (bookingId: string) => void
}) {
  const status = STATUS_LABEL[order.status]
  const showPaymentCta = order.status === "pending_payment"

  return (
    <Card className="gap-0 overflow-hidden rounded-3xl border-0 py-0 shadow-brand">
      <div className="bg-purple-soft/70 px-5 pb-4 pt-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge variant="outline" className={cn("rounded-full font-bold", status.className)}>
            {status.label}
          </Badge>
          <Badge variant="outline" className="rounded-full border-transparent bg-muted font-bold">
            {order.itemsLabel}
          </Badge>
        </div>
        <h3 className="text-base font-extrabold text-foreground">{order.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{order.campus}</p>
        <p className="mt-1 text-sm font-semibold text-primary">
          {order.totalLabel} one-time
        </p>
      </div>

      <div className="space-y-3.5 px-5 py-4">
        <div className="flex items-start gap-2.5">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Move-in date
            </p>
            <p className="text-sm font-semibold text-foreground">{order.moveInDate}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Pickup address
            </p>
            <p className="text-sm font-semibold text-foreground">{order.address}</p>
          </div>
        </div>
      </div>

      {showPaymentCta ? (
        <div className="border-t border-border bg-muted/50 p-4">
          <Button
            className="w-full"
            disabled={pending}
            onClick={() => onCompletePayment(order.id)}
          >
            <CreditCard className="h-4 w-4" />
            {pending ? "Redirecting…" : "Complete payment"}
          </Button>
        </div>
      ) : null}
    </Card>
  )
}

type MoveInOrdersProps = {
  activeOrders: MoveInDashboardOrder[]
  pastOrders?: MoveInDashboardOrder[]
}

export function MoveInOrders({ activeOrders, pastOrders = [] }: MoveInOrdersProps) {
  const { openSignIn } = useClerk()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  if (activeOrders.length === 0 && pastOrders.length === 0) {
    return null
  }

  const handleCompletePayment = (bookingId: string) => {
    if (pendingId) return
    setPendingId(bookingId)

    startTransition(async () => {
      try {
        const checkout = await createMoveInCheckout(bookingId)
        if ("url" in checkout && checkout.url) {
          window.location.href = checkout.url
          return
        }
        if ("code" in checkout && checkout.code === "auth") {
          openSignIn({
            forceRedirectUrl: "/dashboard",
            fallbackRedirectUrl: "/dashboard",
          })
          return
        }
        toast.error(
          ("error" in checkout && checkout.error) ||
            "Could not start checkout. Please try again."
        )
      } finally {
        setPendingId(null)
      }
    })
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
          University move-in
        </h2>
        <span className="text-sm font-semibold text-muted-foreground">
          {activeOrders.length} upcoming
        </span>
      </div>

      {activeOrders.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeOrders.map((order) => (
            <MoveInCard
              key={order.id}
              order={order}
              pending={pendingId === order.id}
              onCompletePayment={handleCompletePayment}
            />
          ))}
        </div>
      ) : null}

      {pastOrders.length > 0 ? (
        <div className={activeOrders.length > 0 ? "mt-6" : undefined}>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
            Past move-ins
          </h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pastOrders.map((order) => (
              <MoveInCard
                key={order.id}
                order={order}
                pending={false}
                onCompletePayment={handleCompletePayment}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
