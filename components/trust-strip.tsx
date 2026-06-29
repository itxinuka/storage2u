import { siteContent } from "@/lib/site-content"

export function TrustStrip() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1180px] px-6 py-8 lg:px-7">
        <p className="mb-5 text-center text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          On campus at 20+ Canadian universities
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {siteContent.logoStrip.map(([, , short]) => (
            <div
              key={short}
              className="flex h-[60px] items-center justify-center rounded-2xl bg-card text-sm font-extrabold text-primary shadow-brand"
            >
              {short}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
