"use client"

import { Minus, Plus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { BookingData } from "./booking-form"

const PLANS: { id: BookingData["plan"]; name: string; maxBoxes: number; price: number; perks: string[] }[] = [
  {
    id: "starter",
    name: "Starter",
    maxBoxes: 3,
    price: 49,
    perks: ["Up to 3 boxes", "1 free pickup", "1 free delivery"],
  },
  {
    id: "standard",
    name: "Standard",
    maxBoxes: 8,
    price: 89,
    perks: ["Up to 8 boxes", "1 free pickup", "1 free delivery", "Priority scheduling"],
  },
  {
    id: "pro",
    name: "Pro",
    maxBoxes: 20,
    price: 149,
    perks: ["Up to 20 boxes", "Unlimited pickups", "Unlimited deliveries", "Priority scheduling", "Free packing supplies"],
  },
]

interface Props {
  data: BookingData
  update: (fields: Partial<BookingData>) => void
  onNext: () => void
  onBack: () => void
}

export function StepBoxCount({ data, update, onNext, onBack }: Props) {
  const selectedPlan = PLANS.find((p) => p.id === data.plan) ?? PLANS[1]

  const setCount = (n: number) => {
    const clamped = Math.max(1, Math.min(selectedPlan.maxBoxes, n))
    update({ boxCount: clamped })
  }

  const selectPlan = (planId: BookingData["plan"]) => {
    const plan = PLANS.find((p) => p.id === planId)!
    update({ plan: planId, boxCount: Math.min(data.boxCount, plan.maxBoxes) })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">How many boxes do you need?</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Choose a plan and set your box count. You can always add more later.
        </p>
      </div>

      {/* Plan selector */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const active = data.plan === plan.id
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => selectPlan(plan.id)}
              className={cn(
                "relative flex flex-col gap-2 rounded-xl border p-4 text-left transition-all",
                active
                  ? "border-accent bg-accent/5 ring-1 ring-accent"
                  : "border-border bg-card hover:border-primary/40 hover:bg-secondary"
              )}
              aria-pressed={active}
            >
              {plan.id === "standard" && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                  Popular
                </span>
              )}
              <div className="flex items-center justify-between">
                <span className={cn("text-sm font-bold", active ? "text-accent" : "text-foreground")}>
                  {plan.name}
                </span>
                <span className="text-xs font-medium text-muted-foreground">${plan.price}/sem</span>
              </div>
              <ul className="flex flex-col gap-1">
                {plan.perks.map((perk) => (
                  <li key={perk} className="text-xs leading-relaxed text-muted-foreground">
                    {perk}
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>

      {/* Box counter */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-secondary py-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
          <Package className="h-7 w-7 text-primary-foreground" />
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setCount(data.boxCount - 1)}
            disabled={data.boxCount <= 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease box count"
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center gap-0.5">
            <span className="text-4xl font-bold text-foreground tabular-nums">{data.boxCount}</span>
            <span className="text-xs text-muted-foreground">
              {data.boxCount === 1 ? "box" : "boxes"} &nbsp;/&nbsp; max {selectedPlan.maxBoxes}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setCount(data.boxCount + 1)}
            disabled={data.boxCount >= selectedPlan.maxBoxes}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase box count"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Each box is approx. 18&quot; × 18&quot; × 24&quot; — a standard moving box.
        </p>
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
          className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
