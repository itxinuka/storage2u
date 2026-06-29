import { CalendarCheck, PackageCheck, Truck } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: CalendarCheck,
    title: "Schedule Your Pickup",
    description:
      "Choose a pickup date and time that works for you. We come directly to your dorm or apartment — no need to haul anything across campus.",
  },
  {
    number: "02",
    icon: PackageCheck,
    title: "We Store It Safely",
    description:
      "Your items are transported to our secure, climate-controlled warehouse. Everything is catalogued and photographed so you always know what's inside.",
  },
  {
    number: "03",
    icon: Truck,
    title: "We Deliver It Back",
    description:
      "When you're ready for your stuff — at the start of a new semester or anytime — just request a delivery and we'll bring everything back to your door.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-16 max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            Simple Process
          </p>
          <h2 className="text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How Storage2U works
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Three easy steps and your storage worries are gone. We handle everything
            so you can focus on what actually matters.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="relative flex flex-col gap-5 rounded-2xl border border-border bg-card p-8 shadow-sm"
              >
                {/* Connector line (desktop) */}
                {idx < steps.length - 1 && (
                  <div className="absolute right-0 top-12 hidden h-px w-8 translate-x-8 bg-border md:block" />
                )}

                {/* Step number */}
                <div className="flex items-center gap-3">
                  <span className="font-sans text-4xl font-bold text-border">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-sans text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
