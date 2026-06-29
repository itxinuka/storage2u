import { ArrowRight, Star } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Subtle geometric decoration */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <div className="absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full border border-primary-foreground" />
        <div className="absolute -right-16 -top-16 h-[400px] w-[400px] rounded-full border border-primary-foreground" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full border border-primary-foreground translate-x-[-50%] translate-y-[50%]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 md:py-36 lg:py-44">
        <div className="flex flex-col items-start gap-8 lg:max-w-2xl">
          {/* Social proof badge */}
          <div className="flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-xs font-medium text-primary-foreground/80">
              Trusted by 5,000+ students across 20+ universities
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-balance font-sans text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Storage made simple —{" "}
              <span className="text-accent">we pick up,</span>{" "}
              you relax.
            </h1>
            <p className="text-pretty text-base leading-relaxed text-primary-foreground/70 md:text-lg max-w-lg">
              Storage2U handles all the heavy lifting. Schedule a pickup, we store your stuff safely,
              and deliver it back whenever you need it. Perfect for end-of-semester moves.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href="/book"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Book a Pickup
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center rounded-lg px-4 py-3 text-base font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              See how it works
            </a>
          </div>

          {/* Trust stats */}
          <div className="flex flex-wrap items-center gap-8 border-t border-primary-foreground/20 pt-8">
            {[
              { value: "20+", label: "Universities" },
              { value: "5K+", label: "Happy students" },
              { value: "$0", label: "Hidden fees" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="text-2xl font-bold text-primary-foreground">{stat.value}</span>
                <span className="text-xs text-primary-foreground/60">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
