import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"

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
              Loved by students at Memorial, StFX, Dalhousie &amp; CNA
            </div>

            <h1 className="text-balance text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-[64px]">
              Storage made simple —{" "}
              <span className="text-accent">we pick up, you relax.</span>
            </h1>

            <p className="max-w-[600px] text-pretty text-lg leading-relaxed text-white/80">
              Tell us how many boxes you need. We deliver them on pickup day, store
              everything safely, and bring it back whenever you need it — for a flat
              monthly fee per box.
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

          <div className="relative w-full overflow-hidden rounded-4xl shadow-brand-lg shadow-primary/30">
            <div className="relative aspect-[3/1] min-h-[200px] w-full sm:min-h-[240px] lg:min-h-[280px]">
              <Image
                src="/marketing/hero-moveout-family.png"
                alt="Family and student with a Storage2U moving box on move-out day"
                fill
                priority
                unoptimized
                sizes="(max-width: 1180px) 100vw, 1180px"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
