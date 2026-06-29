import Link from "next/link"
import {
  ArrowRight,
  PackageCheck,
  Star,
  Truck,
} from "lucide-react"

import { IconTile } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { siteContent } from "@/lib/site-content"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <span className="absolute -right-28 -top-28 h-[520px] w-[520px] rounded-full border-[1.5px] border-white/15" />
        <span className="absolute right-0 top-0 h-[340px] w-[340px] rounded-full border-[1.5px] border-white/15" />
        <span className="absolute -bottom-40 -left-24 h-[380px] w-[380px] rounded-full border-[1.5px] border-white/12" />
      </div>

      <div className="relative mx-auto max-w-[1180px] px-6 py-20 lg:px-7 lg:py-24">
        <div className="flex flex-col items-center gap-11">
          <div className="flex max-w-[760px] flex-col items-center gap-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white/90">
              <span className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </span>
              Loved by 5,000+ students across 20+ Canadian campuses
            </div>

            <h1 className="text-balance text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-[64px]">
              Storage made simple —{" "}
              <span className="text-accent">we pick up, you relax.</span>
            </h1>

            <p className="max-w-[600px] text-pretty text-lg leading-relaxed text-white/80">
              Tell us how many boxes you&apos;ve got. We pick them up from your dorm,
              store them safely, and bring them back whenever you need them — for a
              flat monthly fee per box.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
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
                render={<Link href="#how" />}
              >
                See how it works
              </Button>
            </div>

            <div className="flex w-full flex-wrap justify-center gap-10 border-t border-white/20 pt-7">
              {siteContent.brand.stats.map(([value, label]) => (
                <div key={label}>
                  <div className="text-3xl font-extrabold text-white">{value}</div>
                  <div className="mt-1 text-[13px] text-white/60">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full">
            <div className="h-[280px] overflow-hidden rounded-4xl bg-primary shadow-brand-lg shadow-primary/30 sm:h-[320px] lg:h-[360px]">
              <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,oklch(0.58_0.22_295),oklch(0.48_0.24_295))]">
                <p className="max-w-xs text-center text-sm font-semibold text-white/70">
                  Campus move-out photo placeholder
                </p>
              </div>
            </div>

            <div className="absolute bottom-5 left-4 flex items-center gap-3 rounded-3xl bg-card px-4 py-3.5 shadow-brand-lg sm:bottom-7 sm:left-8">
              <IconTile variant="lime" className="h-10 w-10 rounded-3xl">
                <PackageCheck className="h-5 w-5" />
              </IconTile>
              <div>
                <div className="text-base font-extrabold text-foreground">1,240+</div>
                <div className="text-xs text-muted-foreground">boxes stored this term</div>
              </div>
            </div>

            <div className="absolute right-4 top-5 flex items-center gap-2.5 rounded-3xl bg-card px-3.5 py-2.5 shadow-brand-lg sm:right-8">
              <IconTile className="h-9 w-9 rounded-3xl">
                <Truck className="h-4 w-4" />
              </IconTile>
              <span className="text-sm font-extrabold text-foreground">Free pickup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
