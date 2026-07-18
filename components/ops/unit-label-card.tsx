"use client"

import { useEffect, useRef } from "react"
import JsBarcode from "jsbarcode"
import { QRCodeSVG } from "qrcode.react"

import type { OpsUnitLabel } from "@/lib/ops/orders-types"
import { cn } from "@/lib/utils"

type BarcodeSvgProps = {
  value: string
  className?: string
  height?: number
  displayValue?: boolean
}

export function BarcodeSvg({
  value,
  className,
  height = 40,
  displayValue = false,
}: BarcodeSvgProps) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!ref.current || !value) return
    try {
      JsBarcode(ref.current, value, {
        format: "CODE128",
        displayValue,
        height,
        width: 1.4,
        margin: 0,
        background: "transparent",
        lineColor: "#111111",
      })
    } catch {
      // Invalid barcode payload — leave empty svg
    }
  }, [value, height, displayValue])

  return <svg ref={ref} className={className} aria-label={value} />
}

type UnitLabelCardProps = {
  unit: OpsUnitLabel
  displayId: string
  className?: string
  compact?: boolean
}

export function UnitLabelCard({
  unit,
  displayId,
  className,
  compact = false,
}: UnitLabelCardProps) {
  const subtitle =
    unit.unitQty != null
      ? `${unit.labelName} · ${unit.unitIndex}/${unit.unitQty}`
      : unit.labelName

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border border-border bg-white p-3 text-center",
        compact ? "gap-1.5 p-2.5" : "gap-2 p-3",
        className
      )}
    >
      <QRCodeSVG
        value={unit.code}
        size={compact ? 72 : 96}
        level="M"
        marginSize={0}
        bgColor="#ffffff"
        fgColor="#111111"
      />
      <BarcodeSvg
        value={unit.code}
        height={compact ? 28 : 36}
        className="h-auto w-full max-w-[180px]"
      />
      <div className="min-w-0">
        <div
          className={cn(
            "font-extrabold tracking-wide text-foreground",
            compact ? "text-[12px]" : "text-[13px]"
          )}
        >
          #{displayId}
        </div>
        <div
          className={cn(
            "text-muted-foreground",
            compact ? "text-[10.5px]" : "text-[11.5px]"
          )}
        >
          {unit.dateLabel}
        </div>
        <div
          className={cn(
            "mt-0.5 font-semibold text-foreground",
            compact ? "text-[10.5px]" : "text-[11.5px]"
          )}
        >
          {subtitle}
        </div>
        <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
          {unit.code}
        </div>
      </div>
    </div>
  )
}
