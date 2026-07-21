import {
  Clock,
  GraduationCap,
  Inbox,
  MapPin,
  Package,
  DollarSign,
  type LucideIcon,
} from "lucide-react"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { IconTile, SectionHeader } from "@/components/section-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { siteContent } from "@/lib/site-content"

const reasonIcons: Record<string, LucideIcon> = {
  package: Package,
  "dollar-sign": DollarSign,
  "graduation-cap": GraduationCap,
}

const channelIcons: Record<string, LucideIcon> = {
  inbox: Inbox,
  clock: Clock,
  "map-pin": MapPin,
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-primary py-20">
        <div className="relative mx-auto max-w-[1180px] px-6 text-center lg:px-7">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-accent">
            Contact
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            We&apos;re here to help
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Pickups, billing, campus partnerships — send us a note and we&apos;ll get back fast.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-7">
          <div>
            <SectionHeader
              eyebrow="Send a message"
              title="Tell us what you need"
              description="We reply within a few hours during support hours — faster during move-out season."
            />

            <form className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input placeholder="First name" className="h-12 rounded-full px-5" />
                <Input placeholder="Email" type="email" className="h-12 rounded-full px-5" />
              </div>
              <Input placeholder="Subject" className="h-12 rounded-full px-5" />
              <textarea
                placeholder="How can we help?"
                className="min-h-[140px] w-full rounded-3xl border border-input bg-card px-5 py-4 text-base outline-none ring-primary focus:ring-2"
              />
              <Button size="lg">Send message</Button>
            </form>
          </div>

          <div className="space-y-6">
            <Card className="gap-0 rounded-3xl border-0 py-0 shadow-brand">
              <CardContent className="p-0">
                {siteContent.contactChannels.map((channel, i) => {
                  const Icon = channelIcons[channel.icon] ?? Inbox
                  return (
                    <div
                      key={channel.label}
                      className={`flex items-start gap-3.5 px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}
                    >
                      <IconTile variant="soft" className="h-10 w-10 shrink-0 rounded-2xl">
                        <Icon className="h-4 w-4" />
                      </IconTile>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          {channel.label}
                        </p>
                        <p className="font-bold text-foreground">{channel.value}</p>
                        <p className="text-sm text-muted-foreground">{channel.note}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <div className="grid gap-3">
              {siteContent.contactReasons.map((reason) => {
                const Icon = reasonIcons[reason.icon] ?? Package
                return (
                  <Card key={reason.title} className="gap-0 rounded-3xl border-0 py-0 shadow-brand">
                    <CardContent className="flex gap-3.5 p-5">
                      <IconTile variant="soft" className="h-10 w-10 shrink-0 rounded-2xl">
                        <Icon className="h-4 w-4" />
                      </IconTile>
                      <div>
                        <h3 className="font-bold text-foreground">{reason.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{reason.body}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
