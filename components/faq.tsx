import { SectionHeader } from "@/components/section-header"
import { Card, CardContent } from "@/components/ui/card"
import { siteContent } from "@/lib/site-content"

export function Faq() {
  return (
    <section className="bg-muted py-20 md:py-24 lg:py-[100px]">
      <div className="mx-auto max-w-[1180px] px-6 lg:px-7">
        <SectionHeader
          center
          eyebrow="Help centre"
          title="Questions, answered"
        />

        <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-3.5">
          {siteContent.faqs.map(([question, answer]) => (
            <Card key={question} className="gap-0 rounded-3xl border-0 py-0 shadow-brand">
              <CardContent className="p-6">
                <h4 className="font-bold text-foreground">{question}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
