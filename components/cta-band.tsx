import Link from "next/link"
import { ArrowRight, CircleCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { protectionCopy } from "@/lib/protection-plan"

const perks = ["Free pickup & delivery", protectionCopy.ctaPerk, "Cancel anytime"]

export function CtaBand() {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-7">
        <div className="relative overflow-hidden rounded-[32px] bg-primary px-8 py-16 text-center shadow-brand-lg md:px-16">
          <div className="pointer-events-none absolute inset-0 opacity-45">
            <span className="absolute -right-20 -top-24 h-[360px] w-[360px] rounded-full border border-white/15" />
            <span className="absolute -bottom-36 -left-24 h-[320px] w-[320px] rounded-full border border-white/12" />
          </div>

          <div className="relative">
            <h2 className="mx-auto max-w-xl text-balance text-3xl font-extrabold tracking-tight text-white md:text-[42px] md:leading-[1.08]">
              Ready to clear out your room?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
              Book a pickup in two minutes. We&apos;ll grab your boxes, store them safely,
              and bring them back whenever you need them.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                render={<Link href="/book" />}
              >
                Book a Pickup
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-white/90 hover:bg-white/10 hover:text-white"
                render={<Link href="/dashboard" />}
              >
                See my storage
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-5">
              {perks.map((perk) => (
                <span
                  key={perk}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/85"
                >
                  <CircleCheck className="h-4 w-4 text-accent" />
                  {perk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
