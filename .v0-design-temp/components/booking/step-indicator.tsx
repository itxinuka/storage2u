import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = { id: number; label: string }

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Booking progress" className="w-full">
      <ol className="flex items-center gap-0">
        {steps.map((step, index) => {
          const isDone = currentStep > step.id
          const isActive = currentStep === step.id
          const isLast = index === steps.length - 1

          return (
            <li key={step.id} className="flex flex-1 items-center">
              {/* Node */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                    isDone && "border-primary bg-primary text-primary-foreground",
                    isActive && "border-accent bg-accent text-accent-foreground",
                    !isDone && !isActive && "border-border bg-card text-muted-foreground"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isDone ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    isActive && "text-accent",
                    isDone && "text-primary",
                    !isDone && !isActive && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1 transition-colors mb-5",
                    isDone ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
