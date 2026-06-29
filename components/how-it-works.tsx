import {
  CalendarCheck,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react"

import { IconTile, SectionHeader } from "@/components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { siteContent } from "@/lib/site-content"

const icons: Record<string, LucideIcon> = {
  "calendar-check": CalendarCheck,
  "shield-check": ShieldCheck,
  truck: Truck,
}

export function HowItWorks() {
  return (
    <section id="how" className="bg-background py-20 md:py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-7">
        <SectionHeader
          eyebrow="Simple process"
          title="Storage worries gone in three steps"
          description="We handle the heavy lifting — literally — so you can focus on exams, summer plans, and actually moving out."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {siteContent.steps.map((step) => {
            const Icon = icons[step.icon] ?? CalendarCheck
            return (
              <Card
                key={step.n}
                className="gap-0 rounded-3xl border-0 py-0 shadow-brand transition-transform hover:-translate-y-0.5 hover:shadow-brand-lg"
              >
                <CardContent className="flex flex-col gap-4 p-8">
                  <span className="text-[44px] font-extrabold leading-none text-purple-soft">
                    {step.n}
                  </span>
                  <IconTile className="h-[52px] w-[52px]">
                    <Icon className="h-6 w-6" />
                  </IconTile>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
