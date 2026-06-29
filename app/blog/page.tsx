import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { SectionHeader } from "@/components/section-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { siteContent } from "@/lib/site-content"
import { cn } from "@/lib/utils"

const toneClasses = {
  purple: "bg-primary text-white",
  lime: "bg-accent text-accent-foreground",
  soft: "bg-purple-soft text-primary",
} as const

export default function BlogPage() {
  const featured =
    siteContent.blog.find((post) => "feature" in post && post.feature) ??
    siteContent.blog[0]
  const posts = siteContent.blog.filter(
    (post) => !("feature" in post && post.feature)
  )

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-primary py-20">
        <div className="relative mx-auto max-w-[1180px] px-6 text-center lg:px-7">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-accent">
            Blog
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Student storage tips &amp; move-out hacks
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Packing advice, campus life, and Storage2U news — written for students, not logistics nerds.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[1180px] px-6 lg:px-7">
          <Card className="mb-12 gap-0 overflow-hidden rounded-[32px] border-0 py-0 shadow-brand-lg md:grid md:grid-cols-2">
            <div
              className={cn(
                "flex min-h-[280px] items-center justify-center",
                toneClasses[featured.tone]
              )}
            >
              <BookOpen className="h-16 w-16 opacity-90" />
            </div>
            <CardContent className="flex flex-col justify-center gap-3 p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Badge className="rounded-full bg-purple-soft text-primary">{featured.cat}</Badge>
                <span>{featured.read}</span>
                <span>{featured.date}</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
                {featured.title}
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {featured.excerpt}
              </p>
              <Button variant="outline" className="mt-2 w-fit">
                Read article
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <SectionHeader eyebrow="Latest posts" title="Fresh from the dorm floor" />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="gap-0 rounded-3xl border-0 py-0 shadow-brand">
                <div
                  className={cn(
                    "flex h-40 items-center justify-center rounded-t-3xl",
                    toneClasses[post.tone]
                  )}
                >
                  <BookOpen className="h-10 w-10 opacity-90" />
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <span>{post.cat}</span>
                    <span>·</span>
                    <span>{post.read}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold leading-snug text-foreground">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <Link
                    href="#"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary"
                  >
                    Read more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12 gap-0 rounded-[32px] border-0 bg-primary py-0 text-primary-foreground shadow-brand-lg">
            <CardContent className="flex flex-col items-center gap-4 px-8 py-12 text-center">
              <h2 className="text-2xl font-extrabold">Ready to store smarter?</h2>
              <p className="max-w-md text-primary-foreground/80">
                Book a pickup and skip the end-of-term scramble.
              </p>
              <Button variant="secondary" render={<Link href="/book" />}>
                Book a Pickup
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  )
}
