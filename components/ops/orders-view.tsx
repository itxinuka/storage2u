"use client"

import { ChevronRight, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import type { CreateOrderResult } from "@/app/ops/actions"
import { CreateOrderModal } from "@/components/ops/create-order-modal"
import { Drawer } from "@/components/ops/drawer"
import { EmptyState } from "@/components/ops/empty-state"
import { FilterTabs } from "@/components/ops/filter-tabs"
import { OrderDetail } from "@/components/ops/order-detail"
import { OrderDrawerFooter } from "@/components/ops/order-drawer-footer"
import { OrderStatus } from "@/components/ops/order-status"
import { PageHead } from "@/components/ops/page-head"
import { SearchBar } from "@/components/ops/search-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  matchesOrdersFilter,
  ORDERS_FILTER_OPTIONS,
  type OpsOrder,
  type OrdersFilterId,
  type OrdersPageData,
} from "@/lib/ops/orders-types"
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

function matchesSearch(order: OpsOrder, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  return (
    order.customer.toLowerCase().includes(q) ||
    order.displayId.toLowerCase().includes(q) ||
    order.id.toLowerCase().includes(q) ||
    order.university.toLowerCase().includes(q) ||
    (order.universityFull?.toLowerCase().includes(q) ?? false)
  )
}

type OrdersViewProps = OrdersPageData

export function OrdersView({ hub, orders }: OrdersViewProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<OrdersFilterId>("all")
  const [selected, setSelected] = useState<OpsOrder | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [optimisticOrders, setOptimisticOrders] = useState<OpsOrder[] | null>(null)

  useEffect(() => {
    setOptimisticOrders(null)
  }, [orders])

  const activeOrders = optimisticOrders ?? orders

  const rows = useMemo(
    () =>
      activeOrders.filter(
        (order) =>
          matchesOrdersFilter(order.status, filter) && matchesSearch(order, query)
      ),
    [activeOrders, filter, query]
  )

  function handleOrderCreated(result: Extract<CreateOrderResult, { success: true }>) {
    setOptimisticOrders((current) => [result.order, ...(current ?? orders)])
    router.refresh()
  }

  function handleOrderDeleted(orderId: string) {
    setOptimisticOrders((current) =>
      (current ?? orders).filter((order) => order.id !== orderId)
    )
    if (selected?.id === orderId) {
      setSelected(null)
    }
  }

  function handleDeleteFailed() {
    setOptimisticOrders(null)
  }

  return (
    <>
      <PageHead
        title="Orders"
        sub={`${activeOrders.length} total orders · ${hub}`}
      >
        <Button variant="outline" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          New order
        </Button>
      </PageHead>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by customer, order #, or campus…"
        />
        <FilterTabs
          value={filter}
          onChange={(value) => setFilter(value as OrdersFilterId)}
          options={ORDERS_FILTER_OPTIONS}
        />
      </div>

      <Card className="overflow-hidden py-0">
        <div className="hidden grid-cols-[0.7fr_1.4fr_0.9fr_1.3fr_1fr_0.9fr_1.1fr] gap-3.5 bg-muted px-5 py-3 text-[11px] font-bold tracking-wide text-muted-foreground uppercase md:grid">
          <span>Order</span>
          <span>Customer</span>
          <span>Type</span>
          <span>Boxes</span>
          <span>Scheduled</span>
          <span>Monthly</span>
          <span className="text-right">Status</span>
        </div>

        {rows.length === 0 ? (
          <EmptyState label="No orders match your search." />
        ) : (
          rows.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => setSelected(order)}
              className={cn(
                "grid w-full cursor-pointer grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-t border-border px-4 py-4 text-left transition-colors hover:bg-purple-50 md:grid-cols-[0.7fr_1.4fr_0.9fr_1.3fr_1fr_0.9fr_1.1fr] md:items-center md:gap-3.5 md:px-5"
              )}
            >
              <span className="text-[13.5px] font-extrabold text-primary tabular-nums md:col-auto">
                #{order.displayId}
              </span>

              <div className="md:col-auto">
                <div className="text-[13.5px] font-bold text-foreground">
                  {order.customer}
                </div>
                <div className="text-[11.5px] text-muted-foreground">
                  {order.university}
                </div>
              </div>

              <span className="hidden md:inline">
                <TypeBadge type={order.type} />
              </span>

              <span className="hidden text-[13.5px] font-semibold md:inline">
                {order.boxCount} boxes
                {order.itemCount > 0 ? ` · ${order.itemCount} items` : ""}
              </span>

              <span className="hidden text-[13.5px] text-foreground md:inline">
                {order.scheduledDate}
              </span>

              <span className="hidden text-[13.5px] font-bold text-foreground md:inline">
                {order.monthlyDisplay}
              </span>

              <div className="flex items-center justify-end gap-2 md:col-auto">
                <OrderStatus status={order.status} />
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>

              <div className="col-span-2 flex flex-wrap items-center gap-2 md:hidden">
                <TypeBadge type={order.type} />
                <span className="text-[13px] font-semibold">
                  {order.boxCount} boxes
                  {order.itemCount > 0 ? ` · ${order.itemCount} items` : ""}
                </span>
                <span className="text-[13px] text-foreground">
                  {order.scheduledDate}
                </span>
                <span className="text-[13px] font-bold text-foreground">
                  {order.monthlyDisplay}
                </span>
              </div>
            </button>
          ))
        )}
      </Card>

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Order #${selected.displayId}` : ""}
        subtitle={
          selected
            ? `${selected.customer} · ${selected.university}`
            : undefined
        }
        footer={
          selected ? (
            <OrderDrawerFooter
              order={selected}
              onClose={() => setSelected(null)}
              onDeleted={handleOrderDeleted}
              onDeleteFailed={handleDeleteFailed}
            />
          ) : null
        }
      >
        {selected ? <OrderDetail order={selected} /> : null}
      </Drawer>

      <CreateOrderModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleOrderCreated}
      />
    </>
  )
}
