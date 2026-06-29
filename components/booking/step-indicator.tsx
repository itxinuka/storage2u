import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

type Step = {
  id: number
  label: string
}

type StepIndicatorProps = {
  steps: Step[]
  current: number
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="m-0 flex list-none items-start p-0">
        {steps.map((step, index) => {
          const done = current > step.id
          const active = current === step.id
          const isLast = index === steps.length - 1

          return (
            <li
              key={step.id}
              className={cn("flex items-center", isLast ? "shrink-0" : "min-w-0 flex-1")}
            >
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex h-[38px] w-[38px] items-center justify-center rounded-full text-[15px] font-bold transition-all duration-180",
                    done &&
                      "bg-primary text-primary-foreground shadow-[inset_0_0_0_2px_var(--color-primary)]",
                    active &&
                      "bg-accent text-accent-foreground shadow-[inset_0_0_0_2px_var(--color-accent)]",
                    !done &&
                      !active &&
                      "bg-card text-muted-foreground shadow-[inset_0_0_0_2px_var(--color-border)]"
                  )}
                >
                  {done ? <Check className="h-4 w-4" strokeWidth={3} /> : step.id}
                </span>
                <span
                  className={cn(
                    "text-center text-[12.5px] font-semibold leading-tight",
                    active && "text-accent-foreground",
                    done && !active && "text-primary",
                    !done && !active && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {!isLast ? (
                <div
                  aria-hidden
                  className={cn(
                    "mb-[26px] h-[3px] flex-1 rounded-full transition-colors duration-180",
                    done ? "bg-primary" : "bg-border"
                  )}
                  style={{ marginInline: "8px" }}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
