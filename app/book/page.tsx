import { Suspense } from "react"

import { BookingWizard } from "@/components/booking/booking-wizard"
import type { BookingMode } from "@/lib/booking-catalog"

type BookPageProps = {
  searchParams: Promise<{ mode?: string }>
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = await searchParams
  const initialMode: BookingMode =
    params.mode === "delivery" ? "delivery" : "pickup"

  return (
    <Suspense fallback={null}>
      <BookingWizard initialMode={initialMode} />
    </Suspense>
  )
}
