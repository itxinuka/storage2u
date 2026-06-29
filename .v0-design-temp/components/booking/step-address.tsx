"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BookingData } from "./booking-form"

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
]

interface Props {
  data: BookingData
  update: (fields: Partial<BookingData>) => void
  onNext: () => void
  onBack: () => void
}

export function StepAddress({ data, update, onNext, onBack }: Props) {
  const canContinue =
    data.address.trim() !== "" &&
    data.city.trim() !== "" &&
    data.state !== "" &&
    data.zip.trim().length >= 5

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Where should we pick up?</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Enter the address where our team will collect your items.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Street address */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="address">Street address</Label>
          <Input
            id="address"
            placeholder="123 Main St"
            value={data.address}
            onChange={(e) => update({ address: e.target.value })}
          />
        </div>

        {/* Apt / Unit */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="unit">
            Apt / Unit{" "}
            <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="unit"
            placeholder="Apt 4B, Room 210..."
            value={data.unit}
            onChange={(e) => update({ unit: e.target.value })}
          />
        </div>

        {/* City / State / Zip row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Ann Arbor"
              value={data.city}
              onChange={(e) => update({ city: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="state">State</Label>
            <select
              id="state"
              value={data.state}
              onChange={(e) => update({ state: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="State"
            >
              <option value="">State</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="zip">ZIP code</Label>
            <Input
              id="zip"
              placeholder="48103"
              value={data.zip}
              maxLength={10}
              onChange={(e) => update({ zip: e.target.value.replace(/\D/g, "").slice(0, 5) })}
            />
          </div>
        </div>
      </div>

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
