import Link from "next/link"
import { ArrowRight, Check, Minus, X } from "lucide-react"

import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { siteContent } from "@/lib/site-content"
import { cn } from "@/lib/utils"

function CompareMark({ yes }: { yes: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full",
        yes ? "bg-primary text-white" : "bg-muted ring-1 ring-border"
      )}
    >
      {yes ? (
        <Check className="h-3 w-3" strokeWidth={3} />
      ) : (
        <X className="h-3 w-3 text-muted-foreground" strokeWidth={3} />
      )}
    </span>
  )
}

function CompareValue({
  kind,
  value,
}: {
  kind: "us" | "them"
  value: string | boolean
}) {
  const isBool = typeof value === "boolean"

  return (
    <div className="flex items-start gap-2.5 text-sm leading-snug">
      {kind === "us" ? (
        <CompareMark yes={isBool ? value : true} />
      ) : isBool ? (
        <CompareMark yes={value} />
      ) : (
        <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border">
          <Minus className="h-3 w-3 text-muted-foreground" strokeWidth={3} />
        </span>
      )}
      <span className={kind === "them" ? "text-muted-foreground" : "font-semibold text-foreground"}>
        {isBool ? (value ? "Included" : "Not included") : value}
      </span>
    </div>
  )
}

function CompareCell({
  kind,
  value,
}: {
  kind: "us" | "them"
  value: string | boolean
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 border-t border-border px-6 py-5 text-sm leading-snug",
        kind === "us" && "bg-purple-soft/60 font-semibold text-foreground"
      )}
    >
      <CompareValue kind={kind} value={value} />
    </div>
  )
}

function CompareMobileCards() {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-[32px] bg-card shadow-brand-lg md:hidden">
      {siteContent.compare.map(([feature, vals]) => (
        <div key={feature} className="px-4 py-4">
          <p className="mb-3 text-sm font-bold text-foreground">{feature}</p>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-purple-soft/60 p-3.5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-primary">
                Storage2U
              </p>
              <CompareValue kind="us" value={vals.us} />
            </div>
            <div className="rounded-2xl bg-muted p-3.5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Self-storage
              </p>
              <CompareValue kind="them" value={vals.them} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CompareDesktopTable() {
  return (
    <div className="hidden overflow-hidden rounded-[32px] bg-card shadow-brand-lg md:block">
      <div className="grid grid-cols-[1.3fr_1fr_1fr]">
        <div />
        <div className="bg-primary px-6 py-7">
          <p className="text-lg font-extrabold text-white">Storage2U</p>
          <p className="mt-1 text-sm font-semibold text-white/75">On-demand · per box</p>
        </div>
        <div className="bg-muted px-6 py-7">
          <p className="text-lg font-extrabold text-foreground">Self-storage unit</p>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">DIY · fixed locker</p>
        </div>

        {siteContent.compare.map(([feature, vals]) => (
          <div key={feature} className="contents">
            <div className="border-t border-border px-6 py-5 text-sm font-semibold text-foreground">
              {feature}
            </div>
            <CompareCell kind="us" value={vals.us} />
            <CompareCell kind="them" value={vals.them} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function Compare() {
  return (
    <section id="compare" className="bg-background py-20 md:py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-7">
        <SectionHeader
          center
          eyebrow="Why not self-storage?"
          title="Storage2U vs. renting a unit"
          description="Traditional self-storage means a van, a contract, and a half-empty locker across town. We come to you and you pay for the boxes you actually have."
        />

        <div className="mt-12">
          <CompareMobileCards />
          <CompareDesktopTable />
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" render={<Link href="/book" />}>
            Book a Pickup
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
