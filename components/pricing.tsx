import Link from "next/link"
import { Check } from "lucide-react"

import { ItemIcon } from "@/components/booking/item-icon"
import { SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { protectionCopy } from "@/lib/protection-plan"
import { siteContent } from "@/lib/site-content"

export function Pricing() {
  return (
    <section id="pricing" className="bg-background py-20 md:py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-7">
        <SectionHeader
          center
          eyebrow="Transparent pricing"
          title="Pay per item, billed monthly"
          description="Free pickup and delivery on campus. Only pay for what you actually store — no deposits, no setup fees."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteContent.items.map((item) => (
            <Card
              key={item.id}
              className="gap-0 overflow-hidden rounded-3xl border-0 py-0 shadow-brand"
            >
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-soft">
                    <ItemIcon name={item.icon} size={20} className="text-primary" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground">{item.name}</p>
                    {"dims" in item && item.dims ? (
                      <p className="text-xs text-muted-foreground">{item.dims}</p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground">
                    ${item.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>

                <ul className="space-y-2">
                  {["Free campus pickup", "Free delivery back"].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-soft text-primary">
                        <Check className="h-3 w-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="border-0 bg-transparent p-6 pt-0">
                <Button className="w-full" render={<Link href="/book" />}>
                  Book a pickup
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          {protectionCopy.pricingFootnote} Questions?{" "}
          <Link href="/contact" className="font-semibold text-primary underline underline-offset-4">
            Contact us
          </Link>
        </p>
      </div>
    </section>
  )
}
