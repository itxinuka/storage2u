import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingForm } from "@/components/booking/booking-form"
import { Package } from "lucide-react"

export const metadata = {
  title: "Book a Pickup — Storage2U",
  description: "Schedule your storage pickup in minutes. We collect, store, and return your items.",
}

export default function BookPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col items-center bg-background px-6 py-16 md:py-24">
        {/* Page header */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Book your storage pickup
          </h1>
          <p className="text-pretty text-base leading-relaxed text-muted-foreground max-w-md">
            It only takes a few minutes. Tell us where you are, what you need stored, and when to come.
          </p>
        </div>

        {/* Form card */}
        <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
          <BookingForm />
        </div>
      </main>

      <Footer />
    </div>
  )
}
