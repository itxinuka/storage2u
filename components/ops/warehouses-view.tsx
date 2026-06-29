"use client"

import {
  Archive,
  Box,
  ChevronRight,
  MapPin,
  Package,
  Plus,
  Trash2,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

import { addWarehouse, deleteWarehouse } from "@/app/ops/actions"
import { ConfirmDialog } from "@/components/ops/confirm-dialog"
import { Drawer } from "@/components/ops/drawer"
import { EmptyState } from "@/components/ops/empty-state"
import { FilterTabs } from "@/components/ops/filter-tabs"
import { Modal } from "@/components/ops/modal"
import { OrderDetail } from "@/components/ops/order-detail"
import { OrderDrawerFooter } from "@/components/ops/order-drawer-footer"
import { OrderStatus } from "@/components/ops/order-status"
import { PageHead } from "@/components/ops/page-head"
import { SearchBar } from "@/components/ops/search-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getWarehouseOrders } from "@/lib/ops/warehouses-data"
import type {
  OpsWarehouse,
  OpsWarehouseHolding,
  WarehousesPageData,
  WarehousesTabId,
} from "@/lib/ops/warehouses-types"
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

function HoldingAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-soft text-sm font-bold text-primary">
      {initials}
    </span>
  )
}

function matchesHoldingSearch(holding: OpsWarehouseHolding, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  return (
    holding.customer.toLowerCase().includes(q) ||
    holding.university.toLowerCase().includes(q) ||
    holding.bayCode.toLowerCase().includes(q)
  )
}

function matchesOrderSearch(order: OpsOrder, query: string): boolean {
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

function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon: typeof Archive
}) {
  return (
    <Card className="py-5">
      <CardContent className="flex flex-col gap-1.5">
        <span className="flex items-center gap-2 text-[12.5px] font-bold tracking-wide text-muted-foreground uppercase">
          <Icon className="size-[15px] text-primary" />
          {label}
        </span>
        <span className="text-[34px] leading-none font-extrabold tracking-tight text-foreground">
          {value}
        </span>
      </CardContent>
    </Card>
  )
}

function WarehousePicker({
  warehouses,
  selectedId,
  onSelect,
}: {
  warehouses: OpsWarehouse[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="mb-6 grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
      {warehouses.map((warehouse) => {
        const active = warehouse.id === selectedId
        const capacityWarning = warehouse.capacityPct > 78

        return (
          <button
            key={warehouse.id}
            type="button"
            onClick={() => onSelect(warehouse.id)}
            className={cn(
              "cursor-pointer rounded-3xl border-0 bg-card p-5 text-left shadow-brand transition-all hover:-translate-y-0.5 hover:shadow-brand-lg",
              active && "shadow-[inset_0_0_0_2px_var(--primary),var(--shadow-brand-lg)]"
            )}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "inline-flex size-10 shrink-0 items-center justify-center rounded-xl",
                  active ? "bg-primary text-primary-foreground" : "bg-purple-soft text-primary"
                )}
              >
                <Archive className="size-5" />
              </span>
              <div className="min-w-0">
                <div className="truncate text-[15px] font-extrabold text-foreground">
                  {warehouse.name}
                </div>
                <div className="truncate text-[12.5px] text-muted-foreground">
                  {warehouse.city}
                </div>
              </div>
            </div>

            <div className="mt-3.5">
              <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                <span>Capacity</span>
                <span
                  className={cn(
                    "font-bold",
                    active ? "text-primary" : "text-foreground"
                  )}
                >
                  {warehouse.capacityPct}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    capacityWarning ? "bg-amber-500" : "bg-primary"
                  )}
                  style={{ width: `${warehouse.capacityPct}%` }}
                />
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

type WarehousesViewProps = WarehousesPageData

export function WarehousesView({ hub, warehouses, orders }: WarehousesViewProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [optimisticWarehouses, setOptimisticWarehouses] = useState<OpsWarehouse[] | null>(
    null
  )
  const activeWarehouses = optimisticWarehouses ?? warehouses
  const [selectedId, setSelectedId] = useState<string | null>(
    warehouses[0]?.id ?? null
  )
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<WarehousesTabId>("holdings")
  const [selectedOrder, setSelectedOrder] = useState<OpsOrder | null>(null)
  const [adding, setAdding] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [form, setForm] = useState({ name: "", city: "", campuses: "" })

  useEffect(() => {
    setOptimisticWarehouses(null)
  }, [warehouses])

  useEffect(() => {
    if (!activeWarehouses.some((warehouse) => warehouse.id === selectedId)) {
      setSelectedId(activeWarehouses[0]?.id ?? null)
    }
  }, [activeWarehouses, selectedId])

  const selected =
    activeWarehouses.find((warehouse) => warehouse.id === selectedId) ??
    activeWarehouses[0] ??
    null

  const warehouseOrders = useMemo(
    () => (selected ? getWarehouseOrders(selected, orders) : []),
    [selected, orders]
  )

  const totalBoxes = useMemo(
    () => (selected?.holdings ?? []).reduce((sum, holding) => sum + holding.boxCount, 0),
    [selected]
  )

  const totalItems = useMemo(
    () => (selected?.holdings ?? []).reduce((sum, holding) => sum + holding.itemCount, 0),
    [selected]
  )

  const holdings = useMemo(
    () =>
      (selected?.holdings ?? []).filter((holding) =>
        matchesHoldingSearch(holding, query)
      ),
    [selected, query]
  )

  const filteredOrders = useMemo(
    () => warehouseOrders.filter((order) => matchesOrderSearch(order, query)),
    [warehouseOrders, query]
  )

  const tabOptions = useMemo(
    () =>
      [
        ["holdings", `Holdings · ${totalBoxes} boxes`],
        ["orders", `Orders · ${warehouseOrders.length}`],
      ] as const,
    [totalBoxes, warehouseOrders.length]
  )

  function selectWarehouse(id: string) {
    setSelectedId(id)
    setQuery("")
  }

  function handleAddWarehouse() {
    if (!form.name.trim()) {
      toast.error("Facility name is required")
      return
    }

    startTransition(async () => {
      const result = await addWarehouse(form)

      if (!result.success) {
        toast.error(result.error ?? "Failed to add warehouse")
        return
      }

      toast.success("Warehouse added")
      setAdding(false)
      setForm({ name: "", city: "", campuses: "" })
      if (result.id) setSelectedId(result.id)
      router.refresh()
    })
  }

  function handleDeleteWarehouse() {
    if (!selected) return
    const removedId = selected.id
    const remaining = activeWarehouses.filter((warehouse) => warehouse.id !== removedId)

    setOptimisticWarehouses(remaining)
    setSelectedId(remaining[0]?.id ?? null)
    setDeleteOpen(false)

    startTransition(async () => {
      const result = await deleteWarehouse(removedId)

      if (!result.success) {
        toast.error(result.error ?? "Could not delete warehouse")
        setOptimisticWarehouses(null)
        router.refresh()
        return
      }

      toast.success("Warehouse deleted")
      router.refresh()
    })
  }

  if (!selected) {
    return (
      <PageHead title="Warehouses" sub={`0 facilities · ${hub}`}>
        <EmptyState label="No warehouses yet. Add your first facility to get started." />
      </PageHead>
    )
  }

  return (
    <>
      <PageHead
        title="Warehouses"
        sub={`${activeWarehouses.length} facilities · ${hub}`}
      >
        <Button variant="outline" onClick={() => setAdding(true)}>
          <Plus className="size-4" />
          Add warehouse
        </Button>
      </PageHead>

      <WarehousePicker
        warehouses={activeWarehouses}
        selectedId={selected.id}
        onSelect={selectWarehouse}
      />

      <div className="mb-4 flex justify-end">
        <button
          type="button"
          disabled={pending || activeWarehouses.length <= 1}
          onClick={() => setDeleteOpen(true)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-pill)] border-0 bg-[var(--danger-bg)] px-4 py-2.5 text-[13px] font-bold text-[var(--danger-fg)] transition-colors hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="size-4" />
          Delete warehouse
        </button>
      </div>

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Units occupied" value={selected.unitsOccupied} icon={Archive} />
        <StatTile
          label="Boxes stored"
          value={selected.boxCount.toLocaleString()}
          icon={Box}
        />
        <StatTile
          label="Customers here"
          value={selected.holdings.length}
          icon={Users}
        />
        <StatTile label="Items" value={totalItems} icon={Package} />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <FilterTabs
          value={tab}
          onChange={(value) => {
            setTab(value as WarehousesTabId)
            setQuery("")
          }}
          options={tabOptions}
        />
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={
            tab === "holdings"
              ? "Search customer, campus, or bay…"
              : "Search order, customer, or campus…"
          }
        />
      </div>

      {tab === "holdings" ? (
        <Card className="overflow-hidden py-0">
          <div className="hidden grid-cols-[1.6fr_0.9fr_1fr_0.6fr_0.6fr_1fr] gap-3.5 bg-muted px-5 py-3 text-[11px] font-bold tracking-wide text-muted-foreground uppercase md:grid">
            <span>Customer</span>
            <span>Campus</span>
            <span>Bay location</span>
            <span>Boxes</span>
            <span>Items</span>
            <span className="text-right">Stored since</span>
          </div>

          {holdings.length === 0 ? (
            <EmptyState label="No holdings match your search." />
          ) : (
            holdings.map((holding) => (
              <div
                key={holding.id}
                className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-t border-border px-4 py-4 md:grid-cols-[1.6fr_0.9fr_1fr_0.6fr_0.6fr_1fr] md:items-center md:gap-3.5 md:px-5"
              >
                <div className="flex min-w-0 items-center gap-3 md:col-auto">
                  <HoldingAvatar name={holding.customer} />
                  <span className="truncate text-[13.5px] font-bold text-foreground">
                    {holding.customer}
                  </span>
                </div>

                <span className="hidden text-[13.5px] text-foreground md:inline">
                  {holding.university}
                </span>

                <span className="hidden md:inline">
                  <Badge variant="secondary" className="rounded-full font-bold">
                    <MapPin className="size-3" />
                    {holding.bayCode}
                  </Badge>
                </span>

                <span className="hidden text-[13.5px] font-semibold md:inline">
                  {holding.boxCount}
                </span>

                <span className="hidden text-[13.5px] text-foreground md:inline">
                  {holding.itemCount}
                </span>

                <span className="hidden text-right text-[13.5px] text-foreground md:inline">
                  {holding.storedSinceLabel}
                </span>

                <div className="col-span-2 flex flex-wrap items-center gap-2 md:hidden">
                  <span className="text-[13px] text-foreground">
                    {holding.university}
                  </span>
                  <Badge variant="secondary" className="rounded-full font-bold">
                    <MapPin className="size-3" />
                    {holding.bayCode}
                  </Badge>
                  <span className="text-[13px] font-semibold">
                    {holding.boxCount} boxes · {holding.itemCount} items
                  </span>
                  <span className="text-[13px] text-foreground">
                    {holding.storedSinceLabel}
                  </span>
                </div>
              </div>
            ))
          )}
        </Card>
      ) : (
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

          {filteredOrders.length === 0 ? (
            <EmptyState label="No orders at this warehouse match your search." />
          ) : (
            filteredOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setSelectedOrder(order)}
                className="grid w-full cursor-pointer grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-t border-border px-4 py-4 text-left transition-colors hover:bg-purple-50 md:grid-cols-[0.7fr_1.4fr_0.9fr_1.3fr_1fr_0.9fr_1.1fr] md:items-center md:gap-3.5 md:px-5"
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
      )}

      <Drawer
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order #${selectedOrder.displayId}` : ""}
        subtitle={
          selectedOrder
            ? `${selectedOrder.customer} · ${selectedOrder.university}`
            : undefined
        }
        footer={
          selectedOrder ? (
            <OrderDrawerFooter
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          ) : null
        }
      >
        {selectedOrder ? <OrderDetail order={selectedOrder} /> : null}
      </Drawer>

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Add warehouse location"
        subtitle="Create a new storage facility and start assigning campuses to it."
        footer={
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setAdding(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleAddWarehouse}
              disabled={pending}
            >
              <Plus className="size-4" />
              Add warehouse
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-bold text-foreground">
              Facility name
            </span>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Calgary Facility"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-bold text-foreground">City</span>
            <Input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="e.g. Calgary, AB"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-bold text-foreground">
              Campuses served (comma-separated)
            </span>
            <Input
              value={form.campuses}
              onChange={(e) => setForm({ ...form, campuses: e.target.value })}
              placeholder="e.g. U of A, Calgary"
            />
          </label>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Archive className="size-4 shrink-0" />
            <span className="text-[12.5px]">
              New facilities start empty — orders for the campuses you assign will
              appear here.
            </span>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteWarehouse}
        title="Delete this warehouse?"
        description={
          selected ? (
            <>
              <strong>{selected.name}</strong> and its campus assignments will be
              permanently removed. Holdings stored here will also be deleted.
            </>
          ) : null
        }
        confirmLabel="Delete warehouse"
        pending={pending}
      />
    </>
  )
}
