"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuth, useClerk, useUser } from "@clerk/nextjs"
import {
  ArrowRight,
  Box,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { createBooking, createCheckoutSession } from "@/app/book/actions"
import { ItemIcon } from "@/components/booking/item-icon"
import { StepIndicator } from "@/components/booking/step-indicator"
import { Logo } from "@/components/logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  BOOKING_BOXES,
  BOOKING_CATALOG,
  BOOKING_ITEMS,
  BOOKING_MODES,
  RESIDENCES,
  TIME_WINDOWS,
  computeSelectionTotals,
  type BookingMode,
  type SelectionMap,
} from "@/lib/booking-catalog"
import { siteContent } from "@/lib/site-content"
import { cn } from "@/lib/utils"

type BookingWizardProps = {
  initialMode?: BookingMode
}

type FormState = {
  selection: SelectionMap
  university: string
  residence: string
  address: string
  phone: string
  scheduledDate: string
  timeWindow: string
  deliveryDate: string
}

const defaultSelection: SelectionMap = { medium: 0, large: 0 }

const BOOKING_DRAFT_KEY = "s2u-booking-draft"

type BookingDraft = {
  mode: BookingMode
  step: number
  form: FormState
}

function defaultFormState(): FormState {
  return {
    selection: { ...defaultSelection },
    university: siteContent.universities[1]?.[0] ?? "",
    residence: RESIDENCES[0],
    address: "",
    phone: "",
    scheduledDate: "",
    timeWindow: "Afternoon (12–4 PM)",
    deliveryDate: "",
  }
}

function createDefaultDraft(initialMode: BookingMode): BookingDraft {
  return {
    mode: initialMode,
    step: 0,
    form: defaultFormState(),
  }
}

function readStoredBookingDraft(initialMode: BookingMode): BookingDraft {
  const fallback = createDefaultDraft(initialMode)
  if (typeof window === "undefined") return fallback
  try {
    const raw = sessionStorage.getItem(BOOKING_DRAFT_KEY)
    if (!raw) return fallback
    const draft = JSON.parse(raw) as BookingDraft
    return {
      mode: draft.mode === "delivery" ? "delivery" : "pickup",
      step: Math.min(Math.max(Number(draft.step) || 0, 0), 4),
      form: { ...defaultFormState(), ...draft.form, selection: draft.form?.selection ?? defaultSelection },
    }
  } catch {
    return fallback
  }
}

function StepHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{sub}</p>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  )
}

/** Prototype "fake-input": tall pill field with an inset 2px stroke (no border). */
const FIELD_CLASS =
  "h-[52px] w-full rounded-full border-0 bg-card px-5 text-[15px] font-medium text-foreground shadow-[inset_0_0_0_2px_var(--color-border)] outline-none transition-shadow placeholder:font-normal placeholder:text-muted-foreground focus-visible:shadow-[inset_0_0_0_2px_var(--color-primary)] focus-visible:ring-0"

function Counter({
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

function ScheduleCalendar({
  value,
  onChange,
}: {
  value: string
  onChange: (iso: string) => void
}) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [view, setView] = useState(() => {
    const base = value ? new Date(`${value}T12:00:00`) : today
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const dow = ["S", "M", "T", "W", "T", "F", "S"]
  const year = view.getFullYear()
  const month = view.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthLabel = view.toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  })
  const atCurrentMonth =
    year === today.getFullYear() && month === today.getMonth()

  const toIso = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`

  const cells: React.ReactNode[] = []
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(<span key={`empty-${i}`} aria-hidden />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toIso(d)
    const past = new Date(year, month, d) < today
    const selected = iso === value
    cells.push(
      <button
        key={d}
        type="button"
        disabled={past}
        aria-pressed={selected}
        onClick={() => onChange(iso)}
        className={cn(
          "flex aspect-square items-center justify-center rounded-full text-sm font-semibold transition-colors",
          selected
            ? "bg-primary text-primary-foreground"
            : past
              ? "cursor-not-allowed text-border"
              : "bg-muted text-foreground hover:bg-purple-100"
        )}
      >
        {d}
      </button>
    )
  }

  return (
    <div className="max-w-[360px] rounded-3xl bg-card p-5 shadow-[inset_0_0_0_1px_var(--color-border)]">
      <div className="mb-3.5 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          disabled={atCurrentMonth}
          onClick={() => setView(new Date(year, month - 1, 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-[15px] font-bold text-foreground">{monthLabel}</span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setView(new Date(year, month + 1, 1))}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-border bg-card text-foreground transition-colors hover:bg-muted"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mb-1.5 grid grid-cols-7 gap-1.5">
        {dow.map((d, i) => (
          <span
            key={i}
            className="py-1 text-center text-[11px] font-bold text-muted-foreground"
          >
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">{cells}</div>
    </div>
  )
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: BookingMode
  onChange: (mode: BookingMode) => void
}) {
  const opts: { id: BookingMode; label: string; icon: typeof Package }[] = [
    { id: "pickup", label: "Store my stuff", icon: Package },
    { id: "delivery", label: "University move-in", icon: GraduationCap },
  ]

  return (
    <div className="mb-6 inline-flex max-w-full gap-1 rounded-full bg-muted p-1">
      {opts.map(({ id, label, icon: Icon }) => {
        const on = mode === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition-all",
              on
                ? "bg-card text-primary shadow-brand"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        )
      })}
    </div>
  )
}

function OrderSummary({
  mode,
  selection,
}: {
  mode: BookingMode
  selection: SelectionMap
}) {
  const M = BOOKING_MODES[mode]
  const { total, boxCount, itemCount } = computeSelectionTotals(selection)

  return (
    <aside className="space-y-3 self-start lg:sticky lg:top-24">
      <Card className="gap-0 border-0 py-0 shadow-brand">
        <CardContent className="flex flex-col gap-3.5 p-6">
          <h3 className="text-lg font-extrabold text-foreground">{M.summaryTitle}</h3>
          <div className="space-y-2">
            {BOOKING_CATALOG.map((entry) =>
              selection[entry.id] ? (
                <div
                  key={entry.id}
                  className="flex items-baseline justify-between gap-3 text-sm"
                >
                  <span className="text-muted-foreground">
                    {entry.name} × {selection[entry.id]}
                  </span>
                  <span className="font-semibold text-foreground">
                    ${entry.price * selection[entry.id]!}/mo
                  </span>
                </div>
              ) : null
            )}
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">
              {boxCount} boxes · {itemCount} items
            </span>
            <span className="text-2xl font-extrabold text-foreground">
              ${total}
              <span className="text-sm font-medium text-muted-foreground">/mo</span>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2.5 text-xs text-muted-foreground">
            <Truck className="h-4 w-4 shrink-0 text-primary" />
            Free pickup & delivery on campus
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        Everything insured up to $500 · cancel anytime
      </div>
    </aside>
  )
}

function formatDisplayDate(iso: string) {
  if (!iso) return ""
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export function BookingWizard({ initialMode = "pickup" }: BookingWizardProps) {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const searchParams = useSearchParams()

  const defaultDraft = useMemo(() => createDefaultDraft(initialMode), [initialMode])
  const [mode, setMode] = useState<BookingMode>(defaultDraft.mode)
  const [step, setStep] = useState(defaultDraft.step)

  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [pendingSubmit, setPendingSubmit] = useState(false)
  const [pendingStep, setPendingStep] = useState<number | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [draftHydrated, setDraftHydrated] = useState(false)

  const [form, setForm] = useState<FormState>(defaultDraft.form)

  const M = BOOKING_MODES[mode]
  const steps = M.steps.map((label, i) => ({ id: i + 1, label }))
  const totals = computeSelectionTotals(form.selection)

  const updateSelection = (id: string, qty: number) => {
    setForm((prev) => ({
      ...prev,
      selection: { ...prev.selection, [id]: qty },
    }))
  }

  const submitBooking = useCallback(async () => {
    setSubmitting(true)
    try {
      const result = await createBooking({
        mode,
        selection: form.selection,
        university: form.university,
        residence: form.residence,
        address: form.address,
        phone: form.phone,
        scheduledDate: form.scheduledDate,
        timeWindow: form.timeWindow,
        deliveryDate: mode === "pickup" ? form.deliveryDate || null : null,
        notes: null,
      })

      if (!result.success) {
        if (result.code === "auth") {
          setPendingSubmit(true)
          openSignIn({
            forceRedirectUrl: "/book",
            fallbackRedirectUrl: "/book",
          })
          return
        }
        setPendingSubmit(false)
        toast.error(result.error)
        return
      }

      const checkout = await createCheckoutSession(result.bookingId)
      if ("url" in checkout) {
        setPendingSubmit(false)
        sessionStorage.removeItem(BOOKING_DRAFT_KEY)
        window.location.href = checkout.url
        return
      }

      setPendingSubmit(false)
      toast.error(checkout.error)
    } catch {
      setPendingSubmit(false)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }, [form, mode, openSignIn])

  useEffect(() => {
    if (searchParams.get("checkout") === "cancelled") {
      toast.error("Payment cancelled. Your booking is saved — complete checkout when ready.")
      setStep(4)
    }
  }, [searchParams])

  useEffect(() => {
    const stored = readStoredBookingDraft(initialMode)
    setMode(stored.mode)
    setStep(stored.step)
    setForm(stored.form)
    setDraftHydrated(true)
  }, [initialMode])

  useEffect(() => {
    if (pendingSubmit && isSignedIn) {
      void submitBooking()
    }
  }, [pendingSubmit, isSignedIn, submitBooking])

  useEffect(() => {
    if (pendingStep !== null && isSignedIn) {
      setStep(pendingStep)
      setPendingStep(null)
    }
  }, [pendingStep, isSignedIn])

  useEffect(() => {
    if (!draftHydrated || done) return
    sessionStorage.setItem(
      BOOKING_DRAFT_KEY,
      JSON.stringify({ mode, step, form } satisfies BookingDraft)
    )
  }, [draftHydrated, mode, step, form, done])

  useEffect(() => {
    if (!isSignedIn || !user) return
    const phone = user.primaryPhoneNumber?.phoneNumber
    if (!phone) return
    setForm((prev) => (prev.phone.trim() ? prev : { ...prev, phone }))
  }, [isSignedIn, user])

  const canContinue = useMemo(() => {
    if (step === 0) return totals.count > 0
    if (step === 1)
      return (
        form.university.trim().length > 0 &&
        form.address.trim().length > 0 &&
        form.phone.trim().length > 0
      )
    if (step === 2) return form.scheduledDate.length > 0 && form.timeWindow.length > 0
    return true
  }, [step, totals.count, form])

  const handleNext = () => {
    if (step < 4) {
      if (!canContinue) {
        toast.error("Please complete the required fields.")
        return
      }
      const nextStep = step + 1
      if (nextStep === 3 && !isSignedIn) {
        setPendingStep(3)
        openSignIn({
          forceRedirectUrl: "/book",
          fallbackRedirectUrl: "/book",
        })
        toast.info("Sign in to review and confirm your booking")
        return
      }
      setStep(nextStep)
      return
    }
    void submitBooking()
  }

  const handleBack = () => setStep((s) => Math.max(0, s - 1))

  const selectionSummary = Object.entries(form.selection)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const entry = BOOKING_CATALOG.find((x) => x.id === id)
      return entry ? `${qty} ${entry.name.toLowerCase()}` : null
    })
    .filter(Boolean)
    .join(" · ")

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-6">
            <Logo size="lg" />
            <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-primary">
              Exit
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-xl px-6 py-12">
          <Card className="gap-0 border-0 py-0 text-center shadow-brand">
            <CardContent className="p-10">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent shadow-brand">
                <Check className="h-10 w-10 text-accent-foreground" strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                {M.confTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                We&apos;ve saved your booking. {M.confVerb}{" "}
                <strong className="text-foreground">{form.address}</strong> on{" "}
                {formatDisplayDate(form.scheduledDate)}.
              </p>
              <Card className="mx-auto mt-6 max-w-md gap-0 border-0 py-0 text-left shadow-[inset_0_0_0_1px_var(--color-border)]">
                <CardContent className="space-y-3.5 p-5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-soft">
                      <CalendarDays className="h-5 w-5 text-primary" />
                    </span>
                    <div>
                      <p className="font-bold text-foreground">
                        {formatDisplayDate(form.scheduledDate)}
                      </p>
                      <p className="text-sm text-muted-foreground">{form.timeWindow}</p>
                    </div>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-soft">
                      <Box className="h-5 w-5 text-primary" />
                    </span>
                    <div>
                      <p className="font-bold text-foreground">
                        {totals.boxCount} boxes · {totals.itemCount} items · ${totals.total}/mo
                      </p>
                      <p className="text-sm text-muted-foreground">Free pickup & delivery</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button
                  render={<Link href="/dashboard" />}
                >
                  Go to My Storage
                  <ArrowRight className="h-4 w-4" />
                </Button>
                {bookingId ? (
                  <p className="w-full text-xs text-muted-foreground">Booking #{bookingId.slice(0, 8)}</p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-6">
          <Logo size="lg" />
          <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-primary">
            Exit
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-6 py-8 pb-20">
        {step === 0 ? <ModeToggle mode={mode} onChange={setMode} /> : null}
        <div className="mb-8">
          <StepIndicator steps={steps} current={step + 1} />
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
          <Card className="gap-0 border-0 py-0 shadow-brand">
            <CardContent className="p-6 sm:p-8">
              {step === 0 ? (
                <div>
                  <StepHead title={M.s1Title} sub={M.s1Sub} />
                  <FieldLabel>Boxes</FieldLabel>
                  <div className="mb-7 space-y-3">
                    {BOOKING_BOXES.map((box) => {
                      const n = form.selection[box.id] ?? 0
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
                              {box.name}{" "}
                              <span className="font-semibold text-primary">· ${box.price}/mo</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {box.dims} — {box.blurb}
                            </p>
                          </div>
                          <Counter value={n} onChange={(v) => updateSelection(box.id, v)} />
                        </div>
                      )
                    })}
                  </div>
                  <FieldLabel>Common items</FieldLabel>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {BOOKING_ITEMS.map((item) => {
                      const n = form.selection[item.id] ?? 0
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
                              <ItemIcon name={item.icon} size={20} className="text-primary" />
                            </span>
                            <div>
                              <p className="font-bold text-foreground">{item.name}</p>
                              <p className="text-sm font-semibold text-primary">${item.price}/mo</p>
                              {"tag" in item && item.tag ? (
                                <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                              ) : null}
                            </div>
                          </div>
                          <Counter value={n} onChange={(v) => updateSelection(item.id, v)} />
                        </div>
                      )
                    })}
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                    {M.s1Note}
                  </p>
                </div>
              ) : null}

              {step === 1 ? (
                <div>
                  <StepHead title={M.s2Title} sub={M.s2Sub} />
                  <div className="space-y-4">
                    <div>
                      <FieldLabel>University / campus</FieldLabel>
                      <select
                        className={FIELD_CLASS}
                        value={form.university}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, university: e.target.value }))
                        }
                      >
                        {siteContent.universities.map(([name]) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Residence type</FieldLabel>
                      <select
                        className={FIELD_CLASS}
                        value={form.residence}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, residence: e.target.value }))
                        }
                      >
                        {RESIDENCES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>{M.addrLabel}</FieldLabel>
                      <Input
                        className={FIELD_CLASS}
                        value={form.address}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, address: e.target.value }))
                        }
                        placeholder="e.g. 89 Chestnut St, Room 412"
                      />
                    </div>
                    <div>
                      <FieldLabel>Phone number</FieldLabel>
                      <Input
                        className={FIELD_CLASS}
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        placeholder="(416) 555-0148"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div>
                  <StepHead title={M.s3Title} sub={M.s3Sub} />
                  <ScheduleCalendar
                    value={form.scheduledDate}
                    onChange={(iso) =>
                      setForm((prev) => ({ ...prev, scheduledDate: iso }))
                    }
                  />
                  <div className="mt-5">
                    <FieldLabel>{M.schedLabel}</FieldLabel>
                    <div className="flex flex-wrap gap-2.5">
                      {TIME_WINDOWS.map((window) => {
                        const label = `${window.label} (${window.hours})`
                        const on = form.timeWindow === label
                        return (
                          <button
                            key={window.id}
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({ ...prev, timeWindow: label }))
                            }
                            className={cn(
                              "min-w-[7rem] flex-1 rounded-2xl px-5 py-3 text-left transition-shadow",
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
                  {M.showPlanned ? (
                    <div className="mt-5">
                      <FieldLabel>Planned delivery (optional)</FieldLabel>
                      <Input
                        className={FIELD_CLASS}
                        type="date"
                        value={form.deliveryDate}
                        min={form.scheduledDate || new Date().toISOString().slice(0, 10)}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, deliveryDate: e.target.value }))
                        }
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}

              {step === 3 ? (
                <div>
                  <StepHead title="Review your booking" sub={M.reviewSub} />
                  <Card className="gap-0 overflow-hidden border-0 py-0 shadow-brand">
                    <CardContent className="space-y-5 p-6">
                      <ReviewRow
                        icon={Box}
                        label={M.storeLabel}
                        value={`${totals.boxCount} boxes · ${totals.itemCount} items`}
                        sub={selectionSummary}
                      />
                      <ReviewRow
                        icon={GraduationCap}
                        label={M.whereLabel}
                        value={form.university}
                        sub={form.address}
                      />
                      <ReviewRow
                        icon={CalendarDays}
                        label={M.whenLabel}
                        value={`${formatDisplayDate(form.scheduledDate)} · ${form.timeWindow}`}
                      />
                      {M.showPlanned && form.deliveryDate ? (
                        <ReviewRow
                          icon={Truck}
                          label="Planned delivery"
                          value={formatDisplayDate(form.deliveryDate)}
                          sub="Reschedule any time from your dashboard"
                        />
                      ) : null}
                    </CardContent>
                    <div className="flex items-center justify-between bg-muted px-6 py-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                          Monthly total
                        </p>
                        <p className="text-2xl font-extrabold text-foreground">
                          ${totals.total}
                          <span className="text-sm font-normal text-muted-foreground">/mo</span>
                        </p>
                      </div>
                      <Badge variant="secondary" className="font-bold">
                        $0 hidden fees
                      </Badge>
                    </div>
                  </Card>
                </div>
              ) : null}

              {step === 4 ? (
                <div>
                  <StepHead
                    title="Secure checkout"
                    sub="You're billed monthly for the boxes you store. Cancel anytime — no penalties."
                  />
                  <div className="space-y-4">
                    <div className="rounded-3xl bg-muted px-5 py-4">
                      <p className="text-sm text-muted-foreground">Monthly total</p>
                      <p className="text-3xl font-extrabold text-foreground">
                        ${totals.total}
                        <span className="text-base font-medium text-muted-foreground">/mo</span>
                      </p>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                        Billed today, then monthly on the 1st
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                        Pay with card, Apple Pay, or Google Pay via Stripe
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                        Your booking details are saved before checkout
                      </li>
                    </ul>
                  </div>
                </div>
              ) : null}

              <div className="mt-7 flex items-center justify-between border-t border-border pt-6">
                {step > 0 ? (
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <span />
                )}
                {step < 4 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canContinue}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={handleNext}
                    disabled={submitting}
                  >
                    <Check className="h-4 w-4" />
                    {submitting ? "Redirecting…" : "Continue to secure checkout"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <OrderSummary mode={mode} selection={form.selection} />
        </div>
      </main>
    </div>
  )
}

function ReviewRow({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Box
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
