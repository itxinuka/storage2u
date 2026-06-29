import { MapPin } from "lucide-react"

import { IconTile, SectionHeader } from "@/components/section-header"
import { Badge } from "@/components/ui/badge"
import { siteContent } from "@/lib/site-content"

export function Universities() {
  return (
    <section id="universities" className="bg-muted py-20 md:py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-7">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Campus coverage"
            title="We serve your university"
            description="Storage2U runs at 20+ campuses across Canada — and we add more every semester."
          />
          <Badge className="w-fit rounded-full bg-purple-soft px-4 py-1.5 text-primary">
            20+ campuses & counting
          </Badge>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {siteContent.universities.map(([name, loc]) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-2xl bg-card px-4 py-4 shadow-brand"
            >
              <IconTile variant="soft" className="h-9 w-9 rounded-xl">
                <MapPin className="h-4 w-4" />
              </IconTile>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{name}</p>
                <p className="truncate text-xs text-muted-foreground">{loc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
