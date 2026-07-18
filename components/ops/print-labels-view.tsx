"use client"

import { useEffect } from "react"
import { Printer } from "lucide-react"

import { UnitLabelCard } from "@/components/ops/unit-label-card"
import { Button } from "@/components/ui/button"
import type { OpsUnitLabel } from "@/lib/ops/orders-types"

type PrintLabelsViewProps = {
  displayId: string
  customer: string
  units: OpsUnitLabel[]
}

export function PrintLabelsView({
  displayId,
  customer,
  units,
}: PrintLabelsViewProps) {
  useEffect(() => {
    if (units.length === 0) return
    const timer = window.setTimeout(() => {
      window.print()
    }, 400)
    return () => window.clearTimeout(timer)
  }, [units.length])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">
            Labels · #{displayId}
          </h1>
          <p className="text-sm text-muted-foreground">
            {customer} · {units.length} label{units.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button type="button" onClick={() => window.print()}>
          <Printer className="size-4" />
          Print all
        </Button>
      </div>

      {units.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No labels found for this order.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 print:grid-cols-3 print:gap-3">
          {units.map((unit) => (
            <UnitLabelCard
              key={unit.id}
              unit={unit}
              displayId={displayId}
              className="break-inside-avoid print:rounded-none print:border-black"
            />
          ))}
        </div>
      )}
    </div>
  )
}
