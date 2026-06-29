import {
  CircleCheck,
  DollarSign,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react"

import { IconTile, SectionHeader } from "@/components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { siteContent } from "@/lib/site-content"

const icons: Record<string, LucideIcon> = {
  truck: Truck,
  "shield-check": ShieldCheck,
  "dollar-sign": DollarSign,
  "circle-check": CircleCheck,
}

export function Why() {
  return (
    <section id="help" className="bg-muted py-20 md:py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-7">
        <SectionHeader
          center
          eyebrow="Why Storage2U"
          title="Built for student life"
          description="No vans to rent, no contracts to sign, no locker you outgrow or half-fill. Just the boxes you have, stored for as long as you need."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteContent.why.map((item) => {
            const Icon = icons[item.icon] ?? CircleCheck
            return (
              <Card key={item.title} className="gap-0 rounded-3xl border-0 py-0 shadow-brand">
                <CardContent className="flex flex-col gap-3.5 p-6">
                  <IconTile variant="soft" className="h-[52px] w-[52px]">
                    <Icon className="h-5 w-5" />
                  </IconTile>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
