import Link from "next/link"
import {
  ArrowRight,
  CalendarCheck,
  CircleCheck,
  PackageCheck,
  Truck,
  type LucideIcon,
} from "lucide-react"

import { IconTile, SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { siteContent } from "@/lib/site-content"

const icons: Record<string, LucideIcon> = {
  "calendar-check": CalendarCheck,
  truck: Truck,
  "package-check": PackageCheck,
}

export function MoveIn() {
  return (
    <section className="bg-muted py-20 md:py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-7">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeader
              eyebrow="Moving in, too"
              title="Not just move-out — we handle move-in"
              description="Same service, other direction. Storing over the summer? We'll deliver everything to your new room on move-in day. New to campus? Ship your boxes ahead and we'll have them waiting."
            />

            <ul className="mt-6 space-y-4">
              {siteContent.moveIn.map((item) => {
                const Icon = icons[item.icon] ?? Truck
                return (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <IconTile variant="soft" className="h-10 w-10 rounded-2xl">
                      <Icon className="h-5 w-5" />
                    </IconTile>
                    <div>
                      <h4 className="font-bold text-foreground">{item.title}</h4>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="lg" render={<Link href="/book?mode=delivery" />}>
                Book a move-in delivery
                <ArrowRight className="h-4 w-4" />
              </Button>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CircleCheck className="h-4 w-4 text-primary" />
                Same easy booking flow
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="h-[420px] overflow-hidden rounded-[32px] bg-purple-soft shadow-brand-lg">
              <div className="flex h-full items-center justify-center">
                <p className="text-sm font-semibold text-muted-foreground">
                  Dorm move-in photo placeholder
                </p>
              </div>
            </div>
            <div className="absolute bottom-6 right-4 flex items-center gap-3 rounded-3xl bg-card px-4 py-3 shadow-brand-lg">
              <IconTile variant="lime" className="h-10 w-10 rounded-2xl">
                <Truck className="h-5 w-5" />
              </IconTile>
              <div>
                <div className="font-extrabold text-foreground">Move-in day</div>
                <div className="text-xs text-muted-foreground">delivered to your door</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
