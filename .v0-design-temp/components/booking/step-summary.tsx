"use client"

import { format } from "date-fns"
import { MapPin, Package, Calendar, GraduationCap, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BookingData } from "./booking-form"

const PLAN_PRICES: Record<BookingData["plan"], number> = {
  starter: 49,
  standard: 89,
  pro: 149,
}

interface SummaryRowProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
}

function SummaryRow({ icon, label, value, sub }: SummaryRowProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
        {icon}
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-semibold text-foreground">{value}</span>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
    </div>
  )
}

interface Props {
  data: BookingData
  onBack: () => void
  onSubmit: () => void
}

export function StepSummary({ data, onBack, onSubmit }: Props) {
  const price = PLAN_PRICES[data.plan]
  const fullAddress = [data.address, data.unit, data.city, data.state, data.zip]
    .filter(Boolean)
    .join(", ")

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Review your booking</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Double-check everything before we confirm your pickup.
        </p>
      </div>

      {/* Summary card */}
      <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-5 p-6">
          <SummaryRow
            icon={<GraduationCap className="h-4 w-4 text-primary" />}
            label="University"
            value={data.university}
          />
          <SummaryRow
            icon={<MapPin className="h-4 w-4 text-primary" />}
            label="Pickup address"
            value={fullAddress}
          />
          <SummaryRow
            icon={<Package className="h-4 w-4 text-primary" />}
            label="Plan & boxes"
            value={`${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)} plan — ${data.boxCount} ${data.boxCount === 1 ? "box" : "boxes"}`}
          />
          <SummaryRow
            icon={<Calendar className="h-4 w-4 text-primary" />}
            label="Pickup date"
            value={data.pickupDate ? format(data.pickupDate, "EEEE, MMMM d, yyyy") : "—"}
          />
          <SummaryRow
            icon={<Calendar className="h-4 w-4 text-accent" />}
            label="Delivery date"
            value={data.deliveryDate ? format(data.deliveryDate, "EEEE, MMMM d, yyyy") : "—"}
          />
        </div>

        {/* Pricing footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-secondary/60 rounded-b-2xl">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total due today</span>
            <span className="text-2xl font-bold text-foreground">${price}<span className="text-sm font-normal text-muted-foreground">/semester</span></span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">$0 hidden fees</span>
          </div>
        </div>
      </div>

      {/* Terms notice */}
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        By confirming, you agree to the Storage2U{" "}
        <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
          Privacy Policy
        </a>
        .
      </p>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Back
        </button>
        <Button
          onClick={onSubmit}
          className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8"
        >
          Confirm booking
        </Button>
      </div>
    </div>
  )
}
