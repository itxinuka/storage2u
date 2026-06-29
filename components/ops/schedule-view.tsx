"use client"

import {
  Box,
  CalendarCheck,
  CalendarDays,
  CircleCheck,
  Plus,
  Trash2,
  Truck,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

import type { CreateOrderResult } from "@/app/ops/actions"
import { addStaffToShift, assignStopToDriver, deleteScheduledStop } from "@/app/ops/actions"
import { ConfirmDialog } from "@/components/ops/confirm-dialog"
import { CreateOrderModal } from "@/components/ops/create-order-modal"
import { FilterTabs, Modal, PageHead } from "@/components/ops"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type {
  SchedulePageData,
  ScheduleStat,
  ScheduleStop,
  ShiftDriver,
  StaffRosterMember,
} from "@/lib/ops/dispatch-types"
import { cn } from "@/lib/utils"

const statIcons = {
  "calendar-check": CalendarCheck,
  truck: Truck,
  box: Box,
  users: Users,
} as const

function StatTile({ stat }: { stat: ScheduleStat }) {
  const Icon = statIcons[stat.icon]
  return (
    <Card className="py-5">
      <CardContent className="flex flex-col gap-1.5">
        <span className="flex items-center gap-2 text-[12.5px] font-bold tracking-wide text-muted-foreground uppercase">
          <Icon className="size-[15px] text-primary" />
          {stat.key}
        </span>
        <span className="text-[34px] leading-none font-extrabold tracking-tight text-foreground">
          {stat.value}
        </span>
        <span className="text-[13px] text-muted-foreground">{stat.sub}</span>
      </CardContent>
    </Card>
  )
}

function TypeBadge({ type }: { type: ScheduleStop["type"] }) {
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

function DispatchStatusBadge({ status }: { status: ScheduleStop["status"] }) {
  if (status === "done") {
    return (
      <Badge className="rounded-full border-transparent bg-lime-soft font-bold text-accent-foreground">
        <CircleCheck className="size-3" />
        Completed
      </Badge>
    )
  }
  if (status === "out") {
    return (
      <Badge className="rounded-full border-transparent bg-primary font-bold text-primary-foreground">
        Out for delivery
      </Badge>
    )
  }
  return (
    <Badge
      variant="outline"
      className="rounded-full border-transparent bg-muted font-bold text-muted-foreground"
    >
      Scheduled
    </Badge>
  )
}

function DriverStatusBadge({ status }: { status: ShiftDriver["status"] }) {
  if (status === "on_route") {
    return (
      <Badge className="rounded-full border-transparent bg-primary font-bold text-primary-foreground">
        On route
      </Badge>
    )
  }
  if (status === "loading") {
    return (
      <Badge
        variant="outline"
        className="rounded-full border-transparent bg-muted font-bold text-muted-foreground"
      >
        Loading
      </Badge>
    )
  }
  return (
    <Badge className="rounded-full border-transparent bg-lime-soft font-bold text-accent-foreground">
      Available
    </Badge>
  )
}

function DriverAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <span className="inline-flex size-[42px] shrink-0 items-center justify-center rounded-full bg-purple-soft text-sm font-bold text-primary">
      {initials || "?"}
    </span>
  )
}

type ScheduleViewProps = SchedulePageData

export function ScheduleView({
  todayLabel,
  hub,
  stats,
  schedule,
  drivers,
  staffRoster,
  upcoming,
}: ScheduleViewProps) {
  const router = useRouter()
  const [filter, setFilter] = useState("all")
  const [assignStop, setAssignStop] = useState<ScheduleStop | null>(null)
  const [addShiftOpen, setAddShiftOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteStop, setDeleteStop] = useState<ScheduleStop | null>(null)
  const [optimisticSchedule, setOptimisticSchedule] = useState<ScheduleStop[] | null>(
    null
  )
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    setOptimisticSchedule(null)
  }, [schedule])

  const activeSchedule = optimisticSchedule ?? schedule

  const rows = useMemo(
    () =>
      activeSchedule.filter((stop) =>
        filter === "all" ? true : stop.type === filter
      ),
    [filter, activeSchedule]
  )

  const assignableDrivers = drivers.filter((driver) => driver.van !== "—")

  function refresh() {
    router.refresh()
  }

  function handleAssign(shiftAssignmentId: string) {
    if (!assignStop) return
    startTransition(async () => {
      const result = await assignStopToDriver({
        stopKey: assignStop.stopKey,
        shiftAssignmentId,
      })
      if (!result.success) {
        toast.error(result.error ?? "Could not assign driver")
        return
      }
      toast.success("Driver assigned")
      setAssignStop(null)
      refresh()
    })
  }

  function handleAddToShift(staff: StaffRosterMember) {
    startTransition(async () => {
      const result = await addStaffToShift(staff.id)
      if (!result.success) {
        toast.error(result.error ?? "Could not add to shift")
        return
      }
      toast.success(`${staff.name} added to shift`)
      setAddShiftOpen(false)
      refresh()
    })
  }

  function handleOrderCreated(result: Extract<CreateOrderResult, { success: true }>) {
    if (result.stop) {
      setOptimisticSchedule((current) => {
        const base = current ?? schedule
        return [...base, result.stop as ScheduleStop].sort((a, b) =>
          a.time.localeCompare(b.time)
        )
      })
    }
    refresh()
  }

  function handleDeleteStop() {
    if (!deleteStop) return
    const stopKey = deleteStop.stopKey
    const previous = optimisticSchedule ?? schedule

    setOptimisticSchedule(previous.filter((stop) => stop.stopKey !== stopKey))
    setDeleteStop(null)

    startTransition(async () => {
      const result = await deleteScheduledStop(stopKey)
      if (!result.success) {
        toast.error(result.error ?? "Could not remove stop")
        setOptimisticSchedule(null)
        refresh()
        return
      }
      toast.success("Scheduled stop removed")
      refresh()
    })
  }

  return (
    <div>
      <PageHead title="Operations" sub={`${todayLabel} · ${hub}`}>
        <Button variant="outline" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          New order
        </Button>
      </PageHead>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatTile key={stat.key} stat={stat} />
        ))}
      </div>

      <section className="mb-11">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            Today&apos;s schedule
          </h2>
          <FilterTabs
            value={filter}
            onChange={setFilter}
            options={[
              ["all", "All"],
              ["pickup", "Pickups"],
              ["delivery", "Deliveries"],
            ]}
          />
        </div>

        <Card className="overflow-hidden py-0">
          <div className="hidden grid-cols-[0.7fr_1.3fr_0.9fr_2fr_0.6fr_1fr_1.1fr_auto] gap-3.5 bg-muted px-5 py-3 text-[11px] font-bold tracking-wide text-muted-foreground uppercase md:grid">
            <span>Time</span>
            <span>Customer</span>
            <span>Type</span>
            <span>Campus / address</span>
            <span>Boxes</span>
            <span>Driver</span>
            <span className="text-right">Status</span>
            <span className="sr-only">Actions</span>
          </div>

          {rows.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              No stops scheduled for today.
            </div>
          ) : (
            rows.map((stop) => (
              <div
                key={stop.stopKey}
                className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-t border-border px-4 py-4 md:grid-cols-[0.7fr_1.3fr_0.9fr_2fr_0.6fr_1fr_1.1fr_auto] md:items-center md:gap-3.5 md:px-5"
              >
                <span className="text-[13.5px] font-extrabold text-foreground tabular-nums md:col-auto">
                  {stop.time}
                </span>

                <div className="md:col-auto">
                  <div className="text-[13.5px] font-bold text-foreground">
                    {stop.customer}
                  </div>
                  <div className="text-[11.5px] text-muted-foreground">
                    #{stop.orderId}
                  </div>
                </div>

                <span className="hidden md:inline">
                  <TypeBadge type={stop.type} />
                </span>

                <div className="col-span-2 min-w-0 text-[13px] md:col-auto">
                  <span className="font-bold text-foreground">
                    {stop.university}
                  </span>
                  <span className="text-muted-foreground"> · {stop.address}</span>
                </div>

                <span className="hidden text-[13.5px] font-semibold md:inline">
                  {stop.boxes}
                </span>

                <span className="hidden md:inline">
                  {!stop.driver ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => setAssignStop(stop)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-0 bg-purple-50 px-3 py-1.5 text-[12.5px] font-bold text-primary"
                    >
                      <Plus className="size-3.5" />
                      Assign
                    </button>
                  ) : (
                    <Badge
                      variant="outline"
                      className="rounded-full border-transparent bg-muted font-bold text-muted-foreground"
                    >
                      <Truck className="size-3" />
                      {stop.driver}
                    </Badge>
                  )}
                </span>

                <div className="flex items-center justify-end gap-2 md:col-auto">
                  <DispatchStatusBadge status={stop.status} />
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => setDeleteStop(stop)}
                    aria-label="Remove scheduled stop"
                    className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-[var(--danger-bg)] text-[var(--danger-fg)] transition-colors hover:brightness-95 disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="col-span-2 flex flex-wrap items-center gap-2 md:hidden">
                  <TypeBadge type={stop.type} />
                  <span className="text-[13px] font-semibold">
                    {stop.boxes} boxes
                  </span>
                  {!stop.driver ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => setAssignStop(stop)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-0 bg-purple-50 px-3 py-1.5 text-[12.5px] font-bold text-primary"
                    >
                      <Plus className="size-3.5" />
                      Assign
                    </button>
                  ) : (
                    <Badge
                      variant="outline"
                      className="rounded-full border-transparent bg-muted font-bold text-muted-foreground"
                    >
                      <Truck className="size-3" />
                      {stop.driver}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </Card>
      </section>

      <div className="grid items-start gap-7 xl:grid-cols-2">
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              Drivers on shift ({drivers.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              disabled={pending || staffRoster.length === 0}
              onClick={() => setAddShiftOpen(true)}
            >
              <Plus className="size-3.5" />
              Add to shift
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {drivers.length === 0 ? (
              <Card className="py-5">
                <CardContent className="text-sm text-muted-foreground">
                  No drivers on shift yet. Add staff from the roster.
                </CardContent>
              </Card>
            ) : (
              drivers.map((driver) => {
                const pct = driver.stops
                  ? Math.round((driver.done / driver.stops) * 100)
                  : 0
                return (
                  <Card key={driver.id} className="py-4">
                    <CardContent className="flex items-center gap-3.5">
                      <DriverAvatar name={driver.name === "—" ? driver.van : driver.name} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[14.5px] font-bold whitespace-nowrap text-foreground">
                            {driver.van}
                          </span>
                          <DriverStatusBadge status={driver.status} />
                        </div>
                        <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                          {driver.name === "—" ? "Unassigned" : driver.name}
                          {driver.stops > 0
                            ? ` · ${driver.done}/${driver.stops} stops`
                            : ""}
                        </div>
                        {driver.stops > 0 ? (
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            Next few days
          </h2>
          <Card className="overflow-hidden py-0">
            {upcoming.map((day, index) => (
              <div
                key={day.date}
                className={cn(
                  "flex items-center gap-3.5 px-5 py-4",
                  index > 0 && "border-t border-border"
                )}
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-soft text-primary">
                  <CalendarDays className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-foreground">
                    {day.dateLabel}
                  </div>
                  <div className="text-[12.5px] text-muted-foreground">
                    {day.pickups} pickups · {day.deliveries} deliveries
                  </div>
                </div>
                <span className="text-[13px] font-bold text-primary">
                  {day.boxes} boxes
                </span>
              </div>
            ))}
          </Card>

          <Card className="mt-3 border-primary bg-primary py-5 text-primary-foreground">
            <CardContent className="flex flex-col gap-2">
              <span className="text-[14.5px] font-extrabold">
                Move-out week is busy
              </span>
              <span className="text-[12.5px] leading-relaxed text-primary-foreground/80">
                {upcoming[0]
                  ? `${upcoming[0].boxes} boxes booked tomorrow. Consider scheduling a 4th van.`
                  : "Review upcoming volume and schedule extra vans if needed."}
              </span>
            </CardContent>
          </Card>
        </section>
      </div>

      <Modal
        open={!!assignStop}
        onClose={() => setAssignStop(null)}
        title="Assign driver"
        subtitle={
          assignStop
            ? `#${assignStop.orderId} · ${assignStop.customer} · ${assignStop.time}`
            : undefined
        }
      >
        <div className="flex flex-col gap-2.5">
          {assignableDrivers.length === 0 ? (
            <p className="py-2 text-center text-sm text-muted-foreground">
              Add a driver to today&apos;s shift first.
            </p>
          ) : (
            assignableDrivers.map((driver) => (
              <button
                key={driver.id}
                type="button"
                disabled={pending}
                onClick={() => handleAssign(driver.id)}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border-0 bg-card p-3.5 text-left shadow-brand"
              >
                <DriverAvatar name={driver.name === "—" ? driver.van : driver.name} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-foreground">
                    {driver.van}
                  </div>
                  <div className="text-[12.5px] text-muted-foreground">
                    {driver.name === "—" ? "Unassigned" : driver.name}
                    {driver.stops
                      ? ` · ${driver.stops - driver.done} stops left`
                      : " · available"}
                  </div>
                </div>
                <DriverStatusBadge status={driver.status} />
              </button>
            ))
          )}
        </div>
      </Modal>

      <Modal
        open={addShiftOpen}
        onClose={() => setAddShiftOpen(false)}
        title="Add to today's shift"
        subtitle="Put a driver or mover on shift and give them a van."
      >
        <div className="flex flex-col gap-2.5">
          {staffRoster.length === 0 ? (
            <p className="py-2 text-center text-sm text-muted-foreground">
              Everyone&apos;s already on shift.
            </p>
          ) : (
            staffRoster.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-brand"
              >
                <DriverAvatar name={staff.name} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-foreground">
                    {staff.name}
                  </div>
                  <div className="text-[12.5px] text-muted-foreground">
                    {staff.role}
                    {staff.phone ? ` · ${staff.phone}` : ""}
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={pending}
                  onClick={() => handleAddToShift(staff)}
                >
                  <Plus className="size-3.5" />
                  Add
                </Button>
              </div>
            ))
          )}
        </div>
      </Modal>

      <CreateOrderModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleOrderCreated}
      />

      <ConfirmDialog
        open={!!deleteStop}
        onClose={() => setDeleteStop(null)}
        onConfirm={handleDeleteStop}
        title="Remove this stop?"
        description={
          deleteStop ? (
            <>
              The scheduled {deleteStop.type} for <strong>{deleteStop.customer}</strong>{" "}
              will be removed from the schedule. The order itself will stay in the system.
            </>
          ) : null
        }
        confirmLabel="Remove stop"
        pending={pending}
      />
    </div>
  )
}
