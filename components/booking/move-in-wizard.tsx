"use client"

import Link from "next/link"
import { useAuth, useClerk, useUser } from "@clerk/nextjs"
import {
  ArrowRight,
  Box,
  CalendarDays,
  Check,
  ChevronLeft,
  GraduationCap,
  MapPin,
  Sparkles,
  Truck,
  User,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { toast } from "sonner"

import {
  calculateMoveInQuote,
  createMoveInCheckout,
  submitMoveInQuoteRequest,
  type MoveInQuoteResult,
} from "@/app/book/move-in-actions"
import {
  FIELD_CLASS,
  FieldLabel,
  formatDisplayDate,
  formatMoney,
  ReviewRow,
  StepHead,
} from "@/components/booking/booking-form-parts"
import { ItemSelectionGrid } from "@/components/booking/item-selection-grid"
import { MoveInQuoteMap } from "@/components/booking/move-in-quote-map"
import { StepIndicator } from "@/components/booking/step-indicator"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  computeSelectionTotals,
  formatSelectionCounts,
  type SelectionMap,
} from "@/lib/booking-catalog"
import {
  getCampusesForUniversity,
  MOVE_IN_UNIVERSITIES,
} from "@/lib/move-in-campuses"
import {
  BASE_FEE,
  EXTRA_ITEM_FEE,
  FREE_ZONE_KM,
  INCLUDED_ITEMS,
  PER_KM_RATE,
} from "@/lib/move-in-pricing"
import type { HomeAddress } from "@/lib/mapbox"

const STEPS = ["Pickup", "Items", "Your quote", "Review"] as const

const MOVE_IN_DRAFT_KEY = "s2u-move-in-draft"

type MoveInFormState = {
  universityId: string
  campusId: string
  street: string
  city: string
  province: string
  postalCode: string
  moveInDate: string
  fullName: string
  phone: string
  email: string
  selection: SelectionMap
}

type MoveInWizardProps = {
  modeToggle: ReactNode
}

function defaultFormState(): MoveInFormState {
  const firstUniversity = MOVE_IN_UNIVERSITIES[0]
  const campuses = getCampusesForUniversity(firstUniversity?.id ?? "")
  return {
    universityId: firstUniversity?.id ?? "",
    campusId: campuses[0]?.id ?? "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
    moveInDate: "",
    fullName: "",
    phone: "",
    email: "",
    selection: {},
  }
}

function MoveInSummary({
  selection,
  quote,
  step,
}: {
  selection: SelectionMap
  quote: MoveInQuoteResult | null
  step: number
}) {
  const itemCount = computeSelectionTotals(selection).count
  const extraItemCount = Math.max(0, itemCount - INCLUDED_ITEMS)
  const countsLabel = formatSelectionCounts(selection)
  const hasQuote =
    quote?.success === true && quote.overCap === false && step >= 2

  return (
    <aside className="space-y-3 self-start lg:sticky lg:top-24">
      <Card className="gap-0 border-0 py-0 shadow-brand">
        <CardContent className="flex flex-col gap-3.5 p-6">
          <h3 className="text-lg font-extrabold text-foreground">Move-in summary</h3>
          <div className="space-y-2 text-sm text-muted-foreground">{countsLabel}</div>
          {step === 1 ? (
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>{itemCount} items selected</p>
              <p>Included in base fee: up to {INCLUDED_ITEMS} items</p>
              {extraItemCount > 0 ? (
                <p>
                  +${EXTRA_ITEM_FEE}/item after that ({extraItemCount} extra)
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="h-px bg-border" />
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">One-time total</span>
            <span className="text-2xl font-extrabold text-foreground">
              {hasQuote ? formatMoney(quote.total * 100) : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2.5 text-xs text-muted-foreground">
            <Truck className="h-4 w-4 shrink-0 text-primary" />
            {step < 2
              ? "Move-in quote calculated next step"
              : "Includes loading, transport & unloading"}
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}

function MobileMoveInBar({
  quote,
  selection,
  step,
}: {
  quote: MoveInQuoteResult | null
  selection: SelectionMap
  step: number
}) {
  const hasQuote =
    quote?.success === true && quote.overCap === false && step >= 2

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            One-time total
          </p>
          <p className="text-xl font-extrabold leading-tight text-foreground">
            {hasQuote ? formatMoney(quote.total * 100) : "—"}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatSelectionCounts(selection)}
        </p>
      </div>
    </div>
  )
}

export function MoveInWizard({ modeToggle }: MoveInWizardProps) {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { openSignIn } = useClerk()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<MoveInFormState>(defaultFormState)
  const [quote, setQuote] = useState<MoveInQuoteResult | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [quoting, setQuoting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [quoteRequestSent, setQuoteRequestSent] = useState(false)
  const [pendingCheckout, setPendingCheckout] = useState(false)

  const campuses = useMemo(
    () => getCampusesForUniversity(form.universityId),
    [form.universityId]
  )

  const totals = computeSelectionTotals(form.selection)

  const homeAddress: HomeAddress = useMemo(
    () => ({
      street: form.street,
      city: form.city,
      province: form.province,
      postalCode: form.postalCode,
    }),
    [form.street, form.city, form.province, form.postalCode]
  )

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = sessionStorage.getItem(MOVE_IN_DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw) as { step?: number; form?: Partial<MoveInFormState> }
      setStep(Math.min(Math.max(Number(draft.step) || 0, 0), 3))
      setForm((prev) => ({ ...prev, ...draft.form, selection: draft.form?.selection ?? prev.selection }))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem(MOVE_IN_DRAFT_KEY, JSON.stringify({ step, form }))
  }, [step, form])

  useEffect(() => {
    if (!isSignedIn || !user) return
    const phone = user.primaryPhoneNumber?.phoneNumber
    const name =
      user.fullName ?? [user.firstName, user.lastName].filter(Boolean).join(" ")
    const email =
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      ""
    setForm((prev) => ({
      ...prev,
      phone: prev.phone || phone || "",
      fullName: prev.fullName || name || "",
      email: prev.email || email,
    }))
  }, [isSignedIn, user])

  const canContinueStep0 =
    form.universityId &&
    form.campusId &&
    form.street.trim() &&
    form.city.trim() &&
    form.province.trim() &&
    form.postalCode.trim() &&
    form.moveInDate &&
    form.fullName.trim() &&
    form.phone.trim()

  const canContinueStep1 = totals.count > 0

  const fetchQuote = useCallback(async () => {
    setQuoting(true)
    setQuoteRequestSent(false)
    try {
      const result = await calculateMoveInQuote({
        universityId: form.universityId,
        campusId: form.campusId,
        homeAddress,
        moveInDate: form.moveInDate,
        selection: form.selection,
        contactName: form.fullName,
        contactEmail: form.email,
        contactPhone: form.phone,
      })
      setQuote(result)
      if (result.success && !result.overCap) {
        setBookingId(result.bookingId)
      } else {
        setBookingId(null)
      }
      return result
    } finally {
      setQuoting(false)
    }
  }, [form, homeAddress])

  useEffect(() => {
    if (step === 2 && !quote && !quoting) {
      void fetchQuote()
    }
  }, [step, quote, quoting, fetchQuote])

  const submitQuoteRequest = async () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Name, email, and phone are required.")
      return
    }

    setSubmitting(true)
    try {
      const distanceKm =
        quote?.success === true && quote.overCap ? quote.distanceKm : null
      const result = await submitMoveInQuoteRequest({
        universityId: form.universityId,
        campusId: form.campusId,
        homeAddress,
        moveInDate: form.moveInDate,
        selection: form.selection,
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        distanceKm,
      })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      setQuoteRequestSent(true)
      toast.success("Quote request sent! We'll be in touch soon.")
    } finally {
      setSubmitting(false)
    }
  }

  const startCheckout = useCallback(async () => {
    if (!bookingId) {
      toast.error("No payable quote found. Go back and recalculate your quote.")
      return
    }

    setSubmitting(true)
    try {
      const checkout = await createMoveInCheckout(bookingId)
      if ("url" in checkout && checkout.url) {
        setPendingCheckout(false)
        sessionStorage.removeItem(MOVE_IN_DRAFT_KEY)
        window.location.href = checkout.url
        return
      }
      setPendingCheckout(false)
      if ("code" in checkout && checkout.code === "auth") {
        openSignIn({
          forceRedirectUrl: "/book?mode=delivery",
          fallbackRedirectUrl: "/book?mode=delivery",
        })
        return
      }
      toast.error(
        ("error" in checkout && checkout.error) ||
          "Could not start checkout. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }, [bookingId, openSignIn])

  useEffect(() => {
    if (pendingCheckout && isSignedIn) {
      void startCheckout()
    }
  }, [pendingCheckout, isSignedIn, startCheckout])

  const handleNext = async () => {
    if (step === 0) {
      if (!canContinueStep0) {
        toast.error("Please complete all required fields.")
        return
      }
      setStep(1)
      return
    }

    if (step === 1) {
      if (!canContinueStep1) {
        toast.error("Add at least one item.")
        return
      }
      setQuote(null)
      setBookingId(null)
      setStep(2)
      return
    }

    if (step === 2) {
      if (!quote?.success) {
        toast.error("We couldn't verify that address.")
        return
      }
      if (quote.overCap) {
        return
      }
      if (!isSignedIn) {
        setPendingCheckout(false)
        openSignIn({
          forceRedirectUrl: "/book?mode=delivery",
          fallbackRedirectUrl: "/book?mode=delivery",
        })
        toast.info("Sign in to review and pay")
        return
      }
      setStep(3)
      return
    }

    if (!isSignedIn) {
      setPendingCheckout(true)
      openSignIn({
        forceRedirectUrl: "/book?mode=delivery",
        fallbackRedirectUrl: "/book?mode=delivery",
      })
      return
    }

    void startCheckout()
  }

  const university = MOVE_IN_UNIVERSITIES.find((u) => u.id === form.universityId)
  const campus = campuses.find((c) => c.id === form.campusId)
  const addressLine = `${form.street}, ${form.city}, ${form.province} ${form.postalCode}`

  const quoteBlocked =
    quote?.success === false && quote.code === "address"

  const canContinue =
    step === 0
      ? Boolean(canContinueStep0)
      : step === 1
        ? canContinueStep1
        : step === 2
          ? quote?.success === true &&
            !quote.overCap &&
            !quoteBlocked &&
            !quoting
          : Boolean(bookingId)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-6">
          <Logo size="lg" />
          <Link
            href="/"
            className="text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            Exit
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-6 py-8 pb-32 lg:pb-20">
        {step === 0 ? modeToggle : null}
        <div className="mb-8">
          <StepIndicator
            steps={STEPS.map((label, i) => ({ id: i + 1, label }))}
            current={step + 1}
          />
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
          <Card className="gap-0 border-0 py-0 shadow-brand">
            <CardContent className="p-6 sm:p-8">
              {step === 0 ? (
                <div>
                  <StepHead
                    title="Where are we picking up?"
                    sub="Tell us your home address and where you're moving to on campus."
                  />
                  <div className="space-y-4">
                    <div>
                      <FieldLabel>University</FieldLabel>
                      <select
                        className={FIELD_CLASS}
                        value={form.universityId}
                        onChange={(e) => {
                          const universityId = e.target.value
                          const nextCampuses = getCampusesForUniversity(universityId)
                          setForm((prev) => ({
                            ...prev,
                            universityId,
                            campusId: nextCampuses[0]?.id ?? "",
                          }))
                        }}
                      >
                        {MOVE_IN_UNIVERSITIES.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.short}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Campus / location</FieldLabel>
                      <select
                        className={FIELD_CLASS}
                        value={form.campusId}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, campusId: e.target.value }))
                        }
                      >
                        {campuses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <FieldLabel>Street address</FieldLabel>
                      <Input
                        className={FIELD_CLASS}
                        value={form.street}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, street: e.target.value }))
                        }
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <FieldLabel>City</FieldLabel>
                        <Input
                          className={FIELD_CLASS}
                          value={form.city}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, city: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <FieldLabel>Province</FieldLabel>
                        <Input
                          className={FIELD_CLASS}
                          value={form.province}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, province: e.target.value }))
                          }
                          placeholder="NL"
                        />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Postal code</FieldLabel>
                      <Input
                        className={FIELD_CLASS}
                        value={form.postalCode}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, postalCode: e.target.value }))
                        }
                        placeholder="A1A 1A1"
                      />
                    </div>
                    <div>
                      <FieldLabel>Move-in date</FieldLabel>
                      <Input
                        className={FIELD_CLASS}
                        type="date"
                        value={form.moveInDate}
                        min={new Date().toISOString().slice(0, 10)}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, moveInDate: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>Full name</FieldLabel>
                      <Input
                        className={FIELD_CLASS}
                        value={form.fullName}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, fullName: e.target.value }))
                        }
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <FieldLabel>Phone</FieldLabel>
                      <Input
                        className={FIELD_CLASS}
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        autoComplete="tel"
                      />
                    </div>
                    <div>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        className={FIELD_CLASS}
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        autoComplete="email"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <div>
                  <StepHead
                    title="What are we moving?"
                    sub="Select items to size your load. You're not billed per item — pricing is based on distance."
                  />
                  <ItemSelectionGrid
                    selection={form.selection}
                    hidePrices
                    onChange={(id, qty) =>
                      setForm((prev) => ({
                        ...prev,
                        selection: { ...prev.selection, [id]: qty },
                      }))
                    }
                    note="Storing something else? Add a note at pickup and we'll handle it on move-in day."
                  />
                </div>
              ) : null}

              {step === 2 ? (
                <div>
                  <StepHead
                    title="Your quote"
                    sub="Driving distance from your home to campus determines the one-time fee."
                  />
                  {quoting ? (
                    <p className="text-muted-foreground">Calculating your quote…</p>
                  ) : quote?.success === false && quote.code === "address" ? (
                    <Card className="gap-0 border-0 py-0 shadow-brand">
                      <CardContent className="p-6">
                        <p className="font-bold text-foreground">
                          We couldn&apos;t verify that address
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {quote.error} Go back and check your home address.
                        </p>
                      </CardContent>
                    </Card>
                  ) : quote?.success === true && quote.overCap ? (
                    <div className="space-y-4">
                      <MoveInQuoteMap
                        home={quote.home}
                        campus={quote.campus}
                        route={quote.route}
                      />
                      <Card className="gap-0 border-0 py-0 shadow-brand">
                        <CardContent className="p-6">
                          <p className="font-bold text-foreground">
                            Custom quote required
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Your home is about {quote.distanceKm.toFixed(0)} km from
                            campus — beyond our online booking limit. Request a custom
                            quote and we&apos;ll get back to you.
                          </p>
                        </CardContent>
                      </Card>
                      {quoteRequestSent ? (
                        <p className="text-sm font-semibold text-primary">
                          Request sent! We&apos;ll email you with a custom quote.
                        </p>
                      ) : (
                        <Button
                          onClick={() => void submitQuoteRequest()}
                          disabled={submitting}
                        >
                          Request a custom quote
                        </Button>
                      )}
                    </div>
                  ) : quote?.success === true && !quote.overCap ? (
                    <div className="space-y-4">
                      <MoveInQuoteMap
                        home={quote.home}
                        campus={quote.campus}
                        route={quote.route}
                      />
                      <Card className="gap-0 border-0 py-0 shadow-brand">
                        <CardContent className="space-y-4 p-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Base fee</span>
                            <span className="font-semibold">{formatMoney(BASE_FEE * 100)}</span>
                          </div>
                          {quote.extraItemCount > 0 ? (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Extra items ({quote.extraItemCount} × ${EXTRA_ITEM_FEE})
                              </span>
                              <span className="font-semibold">
                                {formatMoney(quote.itemCharge * 100)}
                              </span>
                            </div>
                          ) : null}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Distance charge ({quote.billableKm.toFixed(0)} km beyond{" "}
                              {FREE_ZONE_KM} km free zone × ${PER_KM_RATE.toFixed(2)})
                            </span>
                            <span className="font-semibold">
                              {formatMoney(Math.round(quote.distanceCharge * 100))}
                            </span>
                          </div>
                          <div className="h-px bg-border" />
                          <div className="flex justify-between">
                            <span className="font-bold">One-time total</span>
                            <span className="text-2xl font-extrabold">
                              {formatMoney(quote.total * 100)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {quote.distanceKm.toFixed(1)} km driving distance to campus
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  ) : quote?.success === false ? (
                    <p className="text-sm text-destructive">{quote.error}</p>
                  ) : null}
                </div>
              ) : null}

              {step === 3 ? (
                <div>
                  <StepHead
                    title="Review & pay"
                    sub="Confirm your move-in details before checkout."
                  />
                  <Card className="gap-0 overflow-hidden border-0 py-0 shadow-brand">
                    <CardContent className="space-y-5 p-6">
                      <ReviewRow
                        icon={Box}
                        label="Items"
                        value={formatSelectionCounts(form.selection)}
                      />
                      <ReviewRow
                        icon={User}
                        label="Contact"
                        value={form.fullName}
                        sub={`${form.phone}${form.email ? ` · ${form.email}` : ""}`}
                      />
                      <ReviewRow
                        icon={GraduationCap}
                        label="Campus"
                        value={university?.name ?? ""}
                        sub={campus?.name}
                      />
                      <ReviewRow
                        icon={MapPin}
                        label="Pickup address"
                        value={addressLine}
                      />
                      <ReviewRow
                        icon={CalendarDays}
                        label="Move-in date"
                        value={formatDisplayDate(form.moveInDate)}
                      />
                    </CardContent>
                    {quote?.success === true && !quote.overCap ? (
                      <div className="flex items-center justify-between bg-muted px-6 py-4">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                            One-time total
                          </p>
                          <p className="text-2xl font-extrabold text-foreground">
                            {formatMoney(quote.total * 100)}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </Card>
                </div>
              ) : null}

              <div className="mt-7 flex items-center justify-between border-t border-border pt-6">
                {step > 0 ? (
                  <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))}>
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <span />
                )}
                {step < 3 && !(step === 2 && quote?.success === true && quote.overCap) ? (
                  <Button onClick={() => void handleNext()} disabled={!canContinue || quoting}>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : step === 3 ? (
                  <Button
                    variant="secondary"
                    onClick={() => void handleNext()}
                    disabled={submitting || !bookingId}
                  >
                    <Check className="h-4 w-4" />
                    {submitting ? "Redirecting…" : "Pay now"}
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <MoveInSummary selection={form.selection} quote={quote} step={step} />
        </div>
      </main>

      <MobileMoveInBar quote={quote} selection={form.selection} step={step} />
    </div>
  )
}
