"use client"

import { useState } from "react"
import { format, addDays, isBefore, startOfToday } from "date-fns"
import { CalendarIcon, ChevronRight } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { BookingData } from "./booking-form"

interface Props {
  data: BookingData
  update: (fields: Partial<BookingData>) => void
  onNext: () => void
  onBack: () => void
}

type ActivePicker = "pickup" | "delivery"

export function StepDate({ data, update, onNext, onBack }: Props) {
  const [activePicker, setActivePicker] = useState<ActivePicker>("pickup")

  const today = startOfToday()
  const minPickup = addDays(today, 2) // at least 2 days out
  const minDelivery = data.pickupDate ? addDays(data.pickupDate, 1) : addDays(today, 3)

  const canContinue = data.pickupDate !== undefined && data.deliveryDate !== undefined

  const handlePickupSelect = (date: Date | undefined) => {
    update({ pickupDate: date, deliveryDate: undefined })
    if (date) setActivePicker("delivery")
  }

  const handleDeliverySelect = (date: Date | undefined) => {
    update({ deliveryDate: date })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Schedule your pickup &amp; delivery</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Pick a date for us to collect your items, and choose when you want them back.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex rounded-xl border border-border bg-secondary p-1">
        {(["pickup", "delivery"] as ActivePicker[]).map((type) => {
          const date = type === "pickup" ? data.pickupDate : data.deliveryDate
          const label = type === "pickup" ? "Pickup date" : "Delivery date"
          const isActive = activePicker === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => setActivePicker(type)}
              className={cn(
                "flex flex-1 flex-col items-start gap-0.5 rounded-lg px-4 py-3 text-left transition-all",
                isActive ? "bg-card shadow-sm" : "hover:bg-muted/50"
              )}
            >
              <span className={cn("text-xs font-semibold uppercase tracking-wide", isActive ? "text-accent" : "text-muted-foreground")}>
                {label}
              </span>
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className={cn("text-sm font-semibold", date ? "text-foreground" : "text-muted-foreground")}>
                  {date ? format(date, "MMM d, yyyy") : "Select date"}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Calendar */}
      <div className="flex justify-center rounded-2xl border border-border bg-card p-4">
        {activePicker === "pickup" ? (
          <Calendar
            mode="single"
            selected={data.pickupDate}
            onSelect={handlePickupSelect}
            disabled={(date) => isBefore(date, minPickup)}
            classNames={{
              day: "[&>[data-selected-single=true]]:bg-accent [&>[data-selected-single=true]]:text-accent-foreground",
            }}
          />
        ) : (
          <Calendar
            mode="single"
            selected={data.deliveryDate}
            onSelect={handleDeliverySelect}
            disabled={(date) => isBefore(date, minDelivery)}
          />
        )}
      </div>

      {/* Date summary */}
      {data.pickupDate && (
        <div className="flex items-center gap-3 rounded-xl bg-secondary px-5 py-3 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-foreground">
              Pickup: {format(data.pickupDate, "EEEE, MMMM d")}
            </span>
            {data.deliveryDate && (
              <span className="text-muted-foreground">
                Delivery: {format(data.deliveryDate, "EEEE, MMMM d")}
              </span>
            )}
          </div>
          {data.pickupDate && !data.deliveryDate && (
            <div className="ml-auto flex items-center gap-1 text-xs text-accent font-medium">
              Now pick delivery <ChevronRight className="h-3 w-3" />
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-border pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Back
        </button>
        <Button
          onClick={onNext}
          disabled={!canContinue}
          className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
