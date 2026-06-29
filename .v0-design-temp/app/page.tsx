import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Universities } from "@/components/universities"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Universities />
      <Pricing />
      <Footer />
    </main>
  )
}
