import { Check, Zap } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: 49,
    period: "per semester",
    description: "Perfect for students with just a few boxes to store over break.",
    features: [
      "Up to 5 boxes or bags",
      "1 free pickup included",
      "1 free delivery included",
      "90-day storage period",
      "Item photo catalogue",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Standard",
    price: 89,
    period: "per semester",
    description: "Our most popular plan — plenty of space for a full dorm room.",
    features: [
      "Up to 15 boxes or bags",
      "1 free pickup included",
      "1 free delivery included",
      "180-day storage period",
      "Item photo catalogue",
      "Priority scheduling",
      "Chat & email support",
    ],
    cta: "Book Now",
    popular: true,
  },
  {
    name: "Pro",
    price: 149,
    period: "per semester",
    description: "For students with lots of stuff or longer storage periods.",
    features: [
      "Unlimited boxes or bags",
      "2 free pickups included",
      "2 free deliveries included",
      "365-day storage period",
      "Item photo catalogue",
      "Priority scheduling",
      "Dedicated account manager",
      "Free packing supplies",
    ],
    cta: "Book Now",
    popular: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
            Transparent Pricing
          </p>
          <h2 className="text-balance font-sans text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Simple, honest pricing
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
            No hidden fees, no surprise charges. Pick the plan that fits your semester
            and book your pickup in minutes.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 shadow-sm ${
                plan.popular
                  ? "border-primary bg-primary text-primary-foreground shadow-lg"
                  : "border-border bg-card text-foreground"
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground shadow">
                    <Zap className="h-3 w-3" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan name & price */}
              <div className="mb-6">
                <h3
                  className={`font-sans text-sm font-semibold uppercase tracking-widest ${
                    plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span
                    className={`font-sans text-5xl font-bold ${
                      plan.popular ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={`text-sm ${
                      plan.popular ? "text-primary-foreground/60" : "text-muted-foreground"
                    }`}
                  >
                    /{plan.period}
                  </span>
                </div>
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    plan.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="mb-8 flex flex-col gap-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        plan.popular ? "bg-accent" : "bg-primary"
                      }`}
                    >
                      <Check
                        className={`h-3 w-3 ${
                          plan.popular ? "text-accent-foreground" : "text-primary-foreground"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm ${
                        plan.popular ? "text-primary-foreground/80" : "text-foreground"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="/book"
                className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  plan.popular
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/80"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Extra info */}
        <p className="mt-10 text-center text-sm text-muted-foreground">
          All plans include damage protection up to $500. Need a custom quote?{" "}
          <a href="mailto:hello@storage2u.com" className="font-semibold text-accent underline underline-offset-4 hover:text-accent/80 transition-colors">
            Contact us
          </a>
        </p>
      </div>
    </section>
  )
}
