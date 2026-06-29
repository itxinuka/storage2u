"use client"

import { Plus } from "lucide-react"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

import { createOrder, type CreateOrderResult } from "@/app/ops/actions"
import { FilterTabs } from "@/components/ops/filter-tabs"
import { Modal } from "@/components/ops/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TIME_WINDOWS } from "@/lib/booking-catalog"
import {
  estimateMonthlyFromCounts,
  formatOpsLineEstimate,
} from "@/lib/ops/order-pricing"
import { siteContent } from "@/lib/site-content"
import { cn } from "@/lib/utils"

const FIELD_CLASS =
  "h-[52px] w-full rounded-full border-0 bg-card px-5 text-[15px] font-medium text-foreground shadow-[inset_0_0_0_2px_var(--color-border)] outline-none transition-shadow placeholder:font-normal placeholder:text-muted-foreground focus-visible:shadow-[inset_0_0_0_2px_var(--color-primary)] focus-visible:ring-0"

type CreateOrderModalProps = {
  open: boolean
  onClose: () => void
  onCreated?: (result: Extract<CreateOrderResult, { success: true }>) => void
}

const defaultForm = (): {
  customerName: string
  type: "pickup" | "delivery"
  campus: string
  timeWindow: string
  address: string
  boxes: number
  items: number
  date: string
} => ({
  customerName: "",
  type: "pickup" as "pickup" | "delivery",
  campus: siteContent.universities[0]?.[0] ?? "",
  timeWindow: `${TIME_WINDOWS[0].label} (${TIME_WINDOWS[0].hours})`,
  address: "",
  boxes: 1,
  items: 0,
  date: new Date().toLocaleDateString("en-CA"),
})

function ModalField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12px] font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}

export function CreateOrderModal({
  open,
  onClose,
  onCreated,
}: CreateOrderModalProps) {
  const [form, setForm] = useState(defaultForm)
  const [pending, startTransition] = useTransition()

  const estimateLines = useMemo(
    () => formatOpsLineEstimate(form.boxes, form.items),
    [form.boxes, form.items]
  )
  const { total: monthlyTotal } = useMemo(
    () => estimateMonthlyFromCounts(form.boxes, form.items),
    [form.boxes, form.items]
  )

  function resetAndClose() {
    setForm(defaultForm())
    onClose()
  }

  function handleSubmit() {
    if (!form.customerName.trim()) {
      toast.error("Customer name is required")
      return
    }
    if (form.boxes <= 0) {
      toast.error("Boxes must be greater than zero")
      return
    }

    startTransition(async () => {
      const result = await createOrder({
        customerName: form.customerName.trim(),
        type: form.type,
        campus: form.campus,
        timeWindow: form.timeWindow,
        address: form.address.trim(),
        boxes: form.boxes,
        items: form.items,
        date: form.date,
      })

      if (!result.success) {
        toast.error(result.error ?? "Could not create order")
        return
      }

      toast.success("Order created and stop scheduled")
      onCreated?.(result)
      resetAndClose()
    })
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title="New order"
      subtitle="Creates a booking and schedules a pickup or delivery stop."
      width={520}
      footer={
        <div className="flex gap-2.5">
          <Button
            variant="outline"
            className="flex-1"
            onClick={resetAndClose}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit} disabled={pending}>
            <Plus className="size-4" />
            Create order
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <ModalField label="Customer name">
          <Input
            className={FIELD_CLASS}
            value={form.customerName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, customerName: e.target.value }))
            }
            placeholder="e.g. Priya Sharma"
          />
        </ModalField>

        <ModalField label="Type">
          <FilterTabs
            value={form.type}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                type: value as "pickup" | "delivery",
              }))
            }
            options={[
              ["pickup", "Pickup"],
              ["delivery", "Delivery"],
            ]}
          />
        </ModalField>

        <ModalField label="Campus">
          <select
            className={FIELD_CLASS}
            value={form.campus}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, campus: e.target.value }))
            }
          >
            {siteContent.universities.map(([name]) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </ModalField>

        <ModalField label="Time window">
          <select
            className={FIELD_CLASS}
            value={form.timeWindow}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, timeWindow: e.target.value }))
            }
          >
            {TIME_WINDOWS.map((window) => {
              const label = `${window.label} (${window.hours})`
              return (
                <option key={window.id} value={label}>
                  {label}
                </option>
              )
            })}
          </select>
        </ModalField>

        <ModalField label="Address">
          <Input
            className={FIELD_CLASS}
            value={form.address}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, address: e.target.value }))
            }
            placeholder="Room / unit & street address"
          />
        </ModalField>

        <div className="grid grid-cols-2 gap-4">
          <ModalField label="Boxes">
            <Input
              className={FIELD_CLASS}
              type="number"
              min={1}
              value={form.boxes}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  boxes: Math.max(0, Number(e.target.value) || 0),
                }))
              }
            />
          </ModalField>
          <ModalField label="Items">
            <Input
              className={FIELD_CLASS}
              type="number"
              min={0}
              value={form.items}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  items: Math.max(0, Number(e.target.value) || 0),
                }))
              }
            />
          </ModalField>
        </div>

        <ModalField label="Scheduled date">
          <Input
            className={FIELD_CLASS}
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, date: e.target.value }))
            }
          />
        </ModalField>

        <div
          className={cn(
            "overflow-hidden rounded-2xl bg-card shadow-brand",
            estimateLines.length === 0 && "hidden"
          )}
        >
          {estimateLines.map((line, index) => (
            <div
              key={`${line.label}-${index}`}
              className={cn(
                "flex items-center justify-between px-4 py-3 text-sm",
                index > 0 && "border-t border-border"
              )}
            >
              <span className="font-semibold text-foreground">
                {line.label}
                <span className="ml-2 font-normal text-muted-foreground">
                  {line.qty} × ${line.unit}/mo
                </span>
              </span>
              <span className="font-bold text-foreground">
                ${line.subtotal}/mo
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between bg-muted px-4 py-3">
            <span className="text-[13.5px] font-bold text-muted-foreground">
              Monthly estimate
            </span>
            <span className="text-xl font-extrabold text-foreground">
              ${monthlyTotal}
              <span className="text-xs font-medium text-muted-foreground">
                /mo
              </span>
            </span>
          </div>
        </div>
      </div>
    </Modal>
  )
}
