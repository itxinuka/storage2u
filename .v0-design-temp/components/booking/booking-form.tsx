"use client"

import { useState } from "react"
import { StepIndicator } from "./step-indicator"
import { StepUniversity } from "./step-university"
import { StepAddress } from "./step-address"
import { StepBoxCount } from "./step-box-count"
import { StepDate } from "./step-date"
import { StepSummary } from "./step-summary"

export type BookingData = {
  university: string
  address: string
  unit: string
  city: string
  state: string
  zip: string
  boxCount: number
  plan: "starter" | "standard" | "pro"
  pickupDate: Date | undefined
  deliveryDate: Date | undefined
}

const INITIAL: BookingData = {
  university: "",
  address: "",
  unit: "",
  city: "",
  state: "",
  zip: "",
  boxCount: 1,
  plan: "standard",
  pickupDate: undefined,
  deliveryDate: undefined,
}

const STEPS = [
  { id: 1, label: "University" },
  { id: 2, label: "Address" },
  { id: 3, label: "Boxes" },
  { id: 4, label: "Dates" },
  { id: 5, label: "Review" },
]

export function BookingForm() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<BookingData>(INITIAL)
  const [submitted, setSubmitted] = useState(false)

  const update = (fields: Partial<BookingData>) =>
    setData((prev) => ({ ...prev, ...fields }))

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length))
  const back = () => setStep((s) => Math.max(s - 1, 1))

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Booking confirmed!</h2>
          <p className="text-pretty text-base leading-relaxed text-muted-foreground max-w-sm">
            We&apos;ll email you a confirmation shortly. Our team will be at{" "}
            <strong className="text-foreground">{data.address}</strong> on your pickup date.
          </p>
        </div>
        <button
          onClick={() => { setStep(1); setData(INITIAL); setSubmitted(false) }}
          className="text-sm font-semibold text-accent underline underline-offset-4 hover:text-accent/80 transition-colors"
        >
          Book another pickup
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <StepIndicator steps={STEPS} currentStep={step} />

      <div className="mt-8">
        {step === 1 && (
          <StepUniversity data={data} update={update} onNext={next} />
        )}
        {step === 2 && (
          <StepAddress data={data} update={update} onNext={next} onBack={back} />
        )}
        {step === 3 && (
          <StepBoxCount data={data} update={update} onNext={next} onBack={back} />
        )}
        {step === 4 && (
          <StepDate data={data} update={update} onNext={next} onBack={back} />
        )}
        {step === 5 && (
          <StepSummary data={data} onBack={back} onSubmit={() => setSubmitted(true)} />
        )}
      </div>
    </div>
  )
}
