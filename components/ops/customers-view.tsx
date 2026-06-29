"use client"

import { ChevronRight, Package, Plus, Truck } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { Drawer } from "@/components/ops/drawer"
import { EmptyState } from "@/components/ops/empty-state"
import { FilterTabs } from "@/components/ops/filter-tabs"
import { MessageButton } from "@/components/ops/message-button"
import { OrderDetail } from "@/components/ops/order-detail"
import { OrderDrawerFooter } from "@/components/ops/order-drawer-footer"
import { OrderStatus } from "@/components/ops/order-status"
import { PageHead } from "@/components/ops/page-head"
import { SearchBar } from "@/components/ops/search-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  CUSTOMERS_FILTER_OPTIONS,
  matchesCustomersFilter,
  type CustomersFilterId,
  type CustomersPageData,
  type OpsCustomer,
} from "@/lib/ops/customers-types"
import type { OpsOrder } from "@/lib/ops/orders-types"
import { cn } from "@/lib/utils"

function CustomerAvatar({
  name,
  active,
  size = 38,
}: {
  name: string
  active: boolean
  size?: number
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-sm font-bold",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-purple-soft text-primary"
      )}
    >
      {initials}
    </span>
  )
}

function matchesSearch(customer: OpsCustomer, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  return (
    customer.name.toLowerCase().includes(q) ||
    customer.email.toLowerCase().includes(q) ||
    customer.university.toLowerCase().includes(q) ||
    (customer.universityFull?.toLowerCase().includes(q) ?? false)
  )
}

function OrderTypeIcon({ type }: { type: OpsOrder["type"] }) {
  const Icon = type === "pickup" ? Package : Truck
  return (
    <span className="inline-flex size-[38px] shrink-0 items-center justify-center rounded-xl bg-purple-50 text-primary">
      <Icon className="size-[18px]" />
    </span>
  )
}

type CustomersViewProps = CustomersPageData

export function CustomersView({ customers, orders }: CustomersViewProps) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<CustomersFilterId>("all")
  const [selected, setSelected] = useState<OpsCustomer | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OpsOrder | null>(null)

  const activeCount = useMemo(
    () => customers.filter((customer) => customer.status === "active").length,
    [customers]
  )

  const rows = useMemo(
    () =>
      customers.filter(
        (customer) =>
          matchesCustomersFilter(customer.status, filter) &&
          matchesSearch(customer, query)
      ),
    [customers, filter, query]
  )

  const customerOrders = useMemo(() => {
    if (!selected) return []
    return orders
      .filter((order) => order.profileId === selected.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  }, [orders, selected])

  function closeCustomer() {
    setSelected(null)
    setSelectedOrder(null)
  }

  return (
    <>
      <PageHead
        title="Customers"
        sub={`${customers.length} customers · ${activeCount} active`}
      >
        <Button
          variant="outline"
          onClick={() =>
            toast.info(
              "Customers sign up through the website. Staff cannot create accounts directly."
            )
          }
        >
          <Plus className="size-4" />
          Add customer
        </Button>
      </PageHead>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by name, email, or campus…"
        />
        <FilterTabs
          value={filter}
          onChange={(value) => setFilter(value as CustomersFilterId)}
          options={CUSTOMERS_FILTER_OPTIONS}
        />
      </div>

      <Card className="overflow-hidden py-0">
        <div className="hidden grid-cols-[1.8fr_0.9fr_1.1fr_0.9fr_0.9fr_0.9fr] gap-3.5 bg-muted px-5 py-3 text-[11px] font-bold tracking-wide text-muted-foreground uppercase md:grid">
          <span>Customer</span>
          <span>Campus</span>
          <span>Phone</span>
          <span>Stored</span>
          <span>Monthly</span>
          <span className="text-right">Status</span>
        </div>

        {rows.length === 0 ? (
          <EmptyState label="No customers match your search." />
        ) : (
          rows.map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => {
                setSelectedOrder(null)
                setSelected(customer)
              }}
              className="grid w-full cursor-pointer grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-t border-border px-4 py-4 text-left transition-colors hover:bg-purple-50 md:grid-cols-[1.8fr_0.9fr_1.1fr_0.9fr_0.9fr_0.9fr] md:items-center md:gap-3.5 md:px-5"
            >
              <div className="flex min-w-0 items-center gap-3 md:col-auto">
                <CustomerAvatar
                  name={customer.name}
                  active={customer.status === "active"}
                />
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] font-bold text-foreground">
                    {customer.name}
                  </div>
                  <div className="truncate text-[11.5px] text-muted-foreground">
                    {customer.email}
                  </div>
                </div>
              </div>

              <span className="hidden text-[13.5px] text-foreground md:inline">
                {customer.university}
              </span>

              <span className="hidden text-[13.5px] text-foreground md:inline">
                {customer.phone}
              </span>

              <span className="hidden text-[13.5px] font-semibold md:inline">
                {customer.boxCount > 0
                  ? `${customer.boxCount} boxes`
                  : "—"}
              </span>

              <span className="hidden text-[13.5px] font-bold text-foreground md:inline">
                {customer.monthlyDisplay}
              </span>

              <div className="flex items-center justify-end gap-2 md:col-auto">
                {customer.status === "active" ? (
                  <Badge className="rounded-full border-transparent bg-lime-soft font-bold text-accent-foreground">
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="rounded-full font-bold"
                  >
                    Past
                  </Badge>
                )}
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>

              <div className="col-span-2 flex flex-wrap items-center gap-2 md:hidden">
                <span className="text-[13px] text-foreground">
                  {customer.university}
                </span>
                <span className="text-[13px] text-foreground">
                  {customer.phone}
                </span>
                <span className="text-[13px] font-semibold">
                  {customer.boxCount > 0
                    ? `${customer.boxCount} boxes`
                    : "—"}
                </span>
                <span className="text-[13px] font-bold text-foreground">
                  {customer.monthlyDisplay}
                </span>
              </div>
            </button>
          ))
        )}
      </Card>

      <Drawer
        open={!!selected}
        onClose={closeCustomer}
        title={selected?.name ?? ""}
        subtitle={selected?.university}
        footer={
          selected ? (
            <div className="flex gap-2.5">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  toast.info("Editing customer profiles is coming soon")
                }
              >
                Edit
              </Button>
              <MessageButton
                className="flex-1"
                email={selected.email}
                phone={selected.phone}
                customerName={selected.name}
              />
            </div>
          ) : null
        }
      >
        {selected ? (
          <div>
            <div className="mb-5 flex items-center gap-3.5">
              <CustomerAvatar
                name={selected.name}
                active={selected.status === "active"}
                size={52}
              />
              <div>
                {selected.status === "active" ? (
                  <Badge className="rounded-full border-transparent bg-lime-soft font-bold text-accent-foreground">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="rounded-full font-bold">
                    Past customer
                  </Badge>
                )}
                <div className="mt-1 text-[13px] text-muted-foreground">
                  Customer since {selected.sinceLabel}
                </div>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3">
              {(
                [
                  ["Email", selected.email],
                  ["Phone", selected.phone],
                  [
                    "Currently stored",
                    selected.boxCount > 0
                      ? `${selected.boxCount} boxes`
                      : "None",
                  ],
                  ["Monthly", selected.monthlyDisplay],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <span className="block text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                    {label}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-bold text-foreground">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <span className="mb-2.5 block text-[12px] font-bold tracking-wide text-muted-foreground uppercase">
              Orders ({customerOrders.length})
            </span>

            {customerOrders.length === 0 ? (
              <div className="py-2 text-[13.5px] text-muted-foreground">
                No orders on record.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {customerOrders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="flex cursor-pointer items-center gap-3 rounded-3xl bg-card p-3.5 text-left shadow-brand transition-colors hover:bg-purple-50"
                  >
                    <OrderTypeIcon type={order.type} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-bold text-foreground">
                        #{order.displayId} ·{" "}
                        {order.type === "pickup" ? "Pickup" : "Delivery"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.boxCount} boxes
                        {order.itemCount > 0
                          ? ` · ${order.itemCount} items`
                          : ""}{" "}
                        · {order.scheduledDate}
                      </div>
                    </div>
                    <OrderStatus status={order.status} />
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </Drawer>

      <Drawer
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order #${selectedOrder.displayId}` : ""}
        subtitle={
          selectedOrder
            ? `${selectedOrder.customer} · ${selectedOrder.university}`
            : undefined
        }
        footer={selectedOrder ? <OrderDrawerFooter order={selectedOrder} /> : null}
      >
        {selectedOrder ? <OrderDetail order={selectedOrder} /> : null}
      </Drawer>
    </>
  )
}
