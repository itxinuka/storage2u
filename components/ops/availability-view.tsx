"use client"

import { Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

import { addBookingBlock, removeBookingBlock } from "@/app/ops/actions"
import { ConfirmDialog } from "@/components/ops/confirm-dialog"
import { EmptyState } from "@/components/ops/empty-state"
import { Modal } from "@/components/ops/modal"
import { PageHead } from "@/components/ops/page-head"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  blockScopeLabel,
  type BookingBlock,
  type TimeWindowId,
} from "@/lib/booking-availability"
import { TIME_WINDOWS } from "@/lib/booking-catalog"
import type { AvailabilityPageData } from "@/lib/ops/availability-types"
import { cn } from "@/lib/utils"

function formatBlockDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function todayIso(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

type BlockScope = "entire_day" | "specific_windows"

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[13px] font-bold tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  )
}

export function AvailabilityView({ blocks }: AvailabilityPageData) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [blockDate, setBlockDate] = useState("")
  const [scope, setScope] = useState<BlockScope>("entire_day")
  const [selectedWindows, setSelectedWindows] = useState<TimeWindowId[]>([])
  const [reason, setReason] = useState("")

  const today = todayIso()
  const upcoming = useMemo(
    () => blocks.filter((b) => b.blockDate >= today),
    [blocks, today]
  )
  const recent = useMemo(
    () => blocks.filter((b) => b.blockDate < today),
    [blocks, today]
  )

  const resetForm = () => {
    setBlockDate("")
    setScope("entire_day")
    setSelectedWindows([])
    setReason("")
  }

  const toggleWindow = (id: TimeWindowId) => {
    setSelectedWindows((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    )
  }

  const handleAdd = () => {
    if (!blockDate) {
      toast.error("Pick a date to block")
      return
    }

    startTransition(async () => {
      const result = await addBookingBlock({
        blockDate,
        scope,
        timeWindowIds: scope === "specific_windows" ? selectedWindows : undefined,
        reason: reason || undefined,
      })

      if (!result.success) {
        toast.error(result.error ?? "Could not add block")
        return
      }

      toast.success("Availability updated")
      setModalOpen(false)
      resetForm()
      router.refresh()
    })
  }

  const handleRemove = (id: string) => {
    startTransition(async () => {
      const result = await removeBookingBlock(id)
      if (!result.success) {
        toast.error(result.error ?? "Could not remove block")
        return
      }

      toast.success("Block removed")
      setConfirmId(null)
      router.refresh()
    })
  }

  const renderBlockRow = (block: BookingBlock) => {
    const isPast = block.blockDate < today

    return (
      <div
        key={block.id}
        className="flex items-start justify-between gap-4 rounded-2xl bg-card px-4 py-3.5 shadow-[inset_0_0_0_1px_var(--color-border)]"
      >
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-foreground">{formatBlockDate(block.blockDate)}</p>
            {isPast ? (
              <Badge variant="secondary" className="rounded-full">
                Past
              </Badge>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">{blockScopeLabel(block)}</p>
          {block.reason ? (
            <p className="text-sm text-muted-foreground">{block.reason}</p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => setConfirmId(block.id)}
          disabled={pending}
          aria-label="Remove block"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <PageHead
        title="Availability"
        sub="Block dates and time windows from customer booking"
      >
        <Button onClick={() => setModalOpen(true)} disabled={pending}>
          <Plus className="size-4" />
          Block availability
        </Button>
      </PageHead>

      {blocks.length === 0 ? (
        <EmptyState label="No blocks yet — add one to close off dates or time windows." />
      ) : (
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
              Upcoming
            </h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming blocks.</p>
            ) : (
              <div className="space-y-2">{upcoming.map(renderBlockRow)}</div>
            )}
          </section>

          {recent.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
                Recent
              </h2>
              <div className="space-y-2">{recent.map(renderBlockRow)}</div>
            </section>
          ) : null}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          resetForm()
        }}
        title="Block availability"
        footer={
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setModalOpen(false)
                resetForm()
              }}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleAdd} disabled={pending}>
              {pending ? "Saving…" : "Save block"}
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          <div>
            <FieldLabel>Date</FieldLabel>
            <Input
              type="date"
              min={today}
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel>Scope</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: "entire_day" as const, label: "Entire day" },
                  { id: "specific_windows" as const, label: "Specific windows" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setScope(opt.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    scope === opt.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-purple-100"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {scope === "specific_windows" ? (
            <div>
              <FieldLabel>Time windows</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {TIME_WINDOWS.map((window) => {
                  const on = selectedWindows.includes(window.id)
                  return (
                    <button
                      key={window.id}
                      type="button"
                      onClick={() => toggleWindow(window.id)}
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-left transition-shadow",
                        on
                          ? "bg-purple-50 shadow-[inset_0_0_0_2px_var(--color-primary)]"
                          : "bg-card shadow-[inset_0_0_0_1.5px_var(--color-border)]"
                      )}
                    >
                      <span
                        className={cn(
                          "block text-sm font-bold",
                          on ? "text-primary" : "text-foreground"
                        )}
                      >
                        {window.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {window.hours}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}

          <div>
            <FieldLabel>Reason (optional)</FieldLabel>
            <Input
              placeholder="e.g. Holiday, van maintenance"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) handleRemove(confirmId)
        }}
        title="Remove this block?"
        description="Customers will be able to book this date or window again."
        confirmLabel="Remove block"
        pending={pending}
      />
    </>
  )
}
