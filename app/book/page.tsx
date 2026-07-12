import { Suspense } from "react"

import { BookingWizard } from "@/components/booking/booking-wizard"
import type { BookingMode } from "@/lib/booking-catalog"
import type { BookingBlock } from "@/lib/booking-availability"
import { getBookingBlocks } from "@/lib/ops/availability-data"

type BookPageProps = {
  searchParams: Promise<{ mode?: string }>
}

export default async function BookPage({ searchParams }: BookPageProps) {
  const params = await searchParams
  const initialMode: BookingMode =
    params.mode === "delivery" ? "delivery" : "pickup"

  const today = new Date()
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  let bookingBlocks: BookingBlock[] = []
  try {
    bookingBlocks = await getBookingBlocks(todayIso)
  } catch {
    bookingBlocks = []
  }

  return (
    <Suspense fallback={null}>
      <BookingWizard initialMode={initialMode} bookingBlocks={bookingBlocks} />
    </Suspense>
  )
}
