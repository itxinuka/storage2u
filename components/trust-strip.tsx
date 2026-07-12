import Image from "next/image"

import { siteContent } from "@/lib/site-content"

export function TrustStrip() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1180px] px-6 py-8 lg:px-7">
        <p className="mb-5 text-center text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          On campus at Memorial, StFX, Dalhousie &amp; CNA
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {siteContent.logoStrip.map((school) => (
            <div
              key={school.id}
              className="flex h-[72px] items-center justify-center rounded-2xl bg-white px-3 shadow-brand sm:px-4"
            >
              <Image
                src={school.logo}
                alt={school.name}
                width={480}
                height={160}
                className="h-11 w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
