import { Star } from "lucide-react"

import { SectionHeader } from "@/components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { siteContent } from "@/lib/site-content"
import { cn } from "@/lib/utils"

function Avatar({ name, tone }: { name: string; tone: "purple" | "lime" | "soft" }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
        tone === "purple" && "bg-primary text-primary-foreground",
        tone === "lime" && "bg-accent text-accent-foreground",
        tone === "soft" && "bg-purple-soft text-primary"
      )}
    >
      {initials}
    </span>
  )
}

export function Testimonials() {
  const tones = ["purple", "lime", "soft"] as const

  return (
    <section className="bg-background py-20 md:py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-7">
        <SectionHeader
          center
          eyebrow="Student stories"
          title="Moving out, minus the stress"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {siteContent.testimonials.map((t, i) => (
            <Card key={t.name} className="gap-0 rounded-3xl border-0 py-0 shadow-brand">
              <CardContent className="flex h-full flex-col gap-4 p-8">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="flex-1 text-[17px] font-semibold leading-snug text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} tone={tones[i % tones.length]} />
                  <div>
                    <div className="text-sm font-bold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.meta}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
