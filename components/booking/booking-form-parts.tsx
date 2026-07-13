import Link from "next/link"
import { Check, Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"

export function StepHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{sub}</p>
    </div>
  )
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  )
}

export const FIELD_CLASS =
  "h-[52px] w-full rounded-full border-0 bg-card px-5 text-[15px] font-medium text-foreground shadow-[inset_0_0_0_2px_var(--color-border)] outline-none transition-shadow placeholder:font-normal placeholder:text-muted-foreground focus-visible:shadow-[inset_0_0_0_2px_var(--color-primary)] focus-visible:ring-0"

export function Counter({
  value,
  onChange,
}: {
  value: number
  onChange: (next: number) => void
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        aria-label="Decrease"
        disabled={value <= 0}
        onClick={() => onChange(Math.max(0, value - 1))}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-card text-lg font-bold text-foreground disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-[22px] text-center text-xl font-extrabold tabular-nums text-foreground">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(value + 1)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-card text-lg font-bold text-foreground"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

export function formatDisplayDate(iso: string) {
  if (!iso) return ""
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export function ReviewRow({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-soft">
        <Icon className="h-4 w-4 text-primary" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-bold text-foreground">{value}</p>
        {sub ? <p className="text-sm text-muted-foreground">{sub}</p> : null}
      </div>
    </div>
  )
}

export function formatMoney(cents: number): string {
  const dollars = cents / 100
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`
}

export function ProtectionToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "w-full rounded-2xl px-4 py-4 text-left transition-shadow",
        enabled
          ? "bg-purple-50 shadow-[inset_0_0_0_2px_var(--color-primary)]"
          : "bg-muted shadow-[inset_0_0_0_1.5px_var(--color-border)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-foreground">Add Protection Plan</p>
          <p className="mt-2 text-xs text-muted-foreground">
            <Link
              href="/terms#protection-plan"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              View terms
            </Link>
          </p>
        </div>
        <span
          className={cn(
            "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            enabled
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card"
          )}
          aria-hidden
        >
          {enabled ? <Check className="h-3.5 w-3.5" /> : null}
        </span>
      </div>
    </button>
  )
}
