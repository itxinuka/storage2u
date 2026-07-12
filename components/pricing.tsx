import Link from "next/link"
import { Check, Zap } from "lucide-react"

import { SectionHeader } from "@/components/section-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { protectionCopy } from "@/lib/protection-plan"
import { siteContent } from "@/lib/site-content"
import { cn } from "@/lib/utils"

export function Pricing() {
  return (
    <section id="pricing" className="bg-background py-20 md:py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-7">
        <SectionHeader
          center
          eyebrow="Transparent pricing"
          title="Pay per box, billed monthly"
          description="Free pickup and delivery on campus. Only pay for what you actually store — no deposits, no setup fees."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {siteContent.boxes.map((box) => (
            <Card
              key={box.id}
              className={cn(
                "relative gap-0 overflow-hidden rounded-3xl border-0 py-0 shadow-brand",
                box.popular && "bg-primary text-primary-foreground shadow-brand-lg"
              )}
            >
              {box.popular ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 rounded-full bg-accent px-3 py-1 text-accent-foreground shadow">
                    <Zap className="h-3 w-3" />
                    Most popular
                  </Badge>
                </div>
              ) : null}

              <CardContent className="flex flex-col gap-5 p-8 pt-10">
                <div>
                  <p
                    className={cn(
                      "text-xs font-bold uppercase tracking-[0.08em]",
                      box.popular ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    {box.name}
                  </p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold tracking-tight">
                      ${box.price}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        box.popular ? "text-primary-foreground/65" : "text-muted-foreground"
                      )}
                    >
                      /box per month
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-sm",
                      box.popular ? "text-primary-foreground/75" : "text-muted-foreground"
                    )}
                  >
                    {box.dims}
                  </p>
                </div>

                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    box.popular ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                >
                  {box.blurb}
                </p>

                <ul className="space-y-2.5">
                  {["Free campus pickup", "Free delivery back", "Climate-controlled storage"].map(
                    (feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm">
                        <span
                          className={cn(
                            "inline-flex h-5 w-5 items-center justify-center rounded-full",
                            box.popular ? "bg-accent text-accent-foreground" : "bg-purple-soft text-primary"
                          )}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        {feature}
                      </li>
                    )
                  )}
                </ul>
              </CardContent>

              <CardFooter className="border-0 bg-transparent p-8 pt-0">
                <Button
                  className="w-full"
                  variant={box.popular ? "secondary" : "default"}
                  render={<Link href="/book" />}
                >
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
