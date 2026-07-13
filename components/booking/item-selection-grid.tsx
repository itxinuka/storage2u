import { Box } from "lucide-react"

import { ItemIcon } from "@/components/booking/item-icon"
import {
  BOOKING_BOXES,
  BOOKING_ITEMS,
  type SelectionMap,
} from "@/lib/booking-catalog"
import { cn } from "@/lib/utils"

import { Counter } from "./booking-form-parts"

type ItemSelectionGridProps = {
  selection: SelectionMap
  onChange: (catalogId: string, qty: number) => void
  hidePrices?: boolean
  note?: string
}

export function ItemSelectionGrid({
  selection,
  onChange,
  hidePrices = false,
  note,
}: ItemSelectionGridProps) {
  return (
    <div>
      <div className="mb-7 space-y-3">
        {BOOKING_BOXES.map((box) => {
          const n = selection[box.id] ?? 0
          return (
            <div
              key={box.id}
              className={cn(
                "flex items-center gap-4 rounded-3xl bg-card p-4 transition-shadow",
                n > 0
                  ? "shadow-[inset_0_0_0_2px_var(--color-primary)]"
                  : "shadow-brand"
              )}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-soft">
                <Box className="h-5 w-5 text-primary" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground">
                  {box.name}
                  {!hidePrices ? (
                    <span className="font-semibold text-primary"> · ${box.price}/mo</span>
                  ) : null}
                </p>
                {box.dims ? (
                  <p className="text-sm text-muted-foreground">
                    {box.dims}
                    {box.blurb ? ` — ${box.blurb}` : ""}
                  </p>
                ) : null}
              </div>
              <Counter value={n} onChange={(v) => onChange(box.id, v)} />
            </div>
          )
        })}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {BOOKING_ITEMS.map((item) => {
          const n = selection[item.id] ?? 0
          return (
            <div
              key={item.id}
              className={cn(
                "flex flex-col gap-3 rounded-3xl bg-card p-4 transition-shadow sm:flex-row sm:items-center",
                n > 0
                  ? "shadow-[inset_0_0_0_2px_var(--color-primary)]"
                  : "shadow-brand"
              )}
            >
              <div className="flex flex-1 items-start gap-3">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-soft">
                  <ItemIcon
                    name={item.icon ?? "box"}
                    size={20}
                    className="text-primary"
                  />
                </span>
                <div>
                  <p className="font-bold text-foreground">{item.name}</p>
                  {!hidePrices ? (
                    <p className="text-sm font-semibold text-primary">${item.price}/mo</p>
                  ) : item.dims ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.dims}
                      {item.blurb ? ` — ${item.blurb}` : ""}
                    </p>
                  ) : null}
                </div>
              </div>
              <Counter value={n} onChange={(v) => onChange(item.id, v)} />
            </div>
          )
        })}
      </div>
      {note ? (
        <p className="mt-4 text-sm text-muted-foreground">{note}</p>
      ) : null}
    </div>
  )
}
