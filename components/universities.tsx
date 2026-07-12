import Image from "next/image"

import { SectionHeader } from "@/components/section-header"
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
            description="Storage2U runs at Memorial, StFX, Dalhousie, and CNA across Atlantic Canada."
          />
          <Badge className="w-fit rounded-full bg-purple-soft px-4 py-1.5 text-primary">
            4 Atlantic campuses
          </Badge>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {siteContent.universities.map((uni) => (
            <div
              key={uni.name}
              className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-brand"
            >
              <div className="flex h-[88px] items-center justify-center bg-white px-4">
                <Image
                  src={uni.logo}
                  alt={`${uni.short} logo`}
                  width={480}
                  height={160}
                  className="h-12 w-auto max-w-full object-contain"
                />
              </div>
              <div className="border-t border-border px-4 py-3">
                <p className="text-sm font-bold text-foreground">{uni.short}</p>
                <p className="text-xs text-muted-foreground">{uni.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
