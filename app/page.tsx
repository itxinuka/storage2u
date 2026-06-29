import { Compare } from "@/components/compare"
import { CtaBand } from "@/components/cta-band"
import { Faq } from "@/components/faq"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { MoveIn } from "@/components/move-in"
import { Navbar } from "@/components/navbar"
import { Testimonials } from "@/components/testimonials"
import { TrustStrip } from "@/components/trust-strip"
import { Universities } from "@/components/universities"
import { Why } from "@/components/why"

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Why />
      <Compare />
      <MoveIn />
      <Universities />
      <Testimonials />
      <Faq />
      <CtaBand />
      <Footer />
    </main>
  )
}
