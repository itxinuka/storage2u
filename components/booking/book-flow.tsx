"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { BookingWizard } from "@/components/booking/booking-wizard"
import { MoveInWizard } from "@/components/booking/move-in-wizard"
import {
  ModeToggle,
  type BookFlowMode,
} from "@/components/booking/mode-toggle"
import type { BookingBlock } from "@/lib/booking-availability"

const BOOK_FLOW_MODE_KEY = "s2u-book-flow-mode"

type BookFlowProps = {
  initialMode?: BookFlowMode
  bookingBlocks?: BookingBlock[]
}

function BookFlowInner({ initialMode = "pickup", bookingBlocks = [] }: BookFlowProps) {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<BookFlowMode>(initialMode)

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = sessionStorage.getItem(BOOK_FLOW_MODE_KEY)
    if (stored === "delivery" || stored === "pickup") {
      setMode(stored)
    } else {
      setMode(initialMode)
    }
  }, [initialMode])

  useEffect(() => {
    sessionStorage.setItem(BOOK_FLOW_MODE_KEY, mode)
  }, [mode])

  useEffect(() => {
    if (searchParams.get("checkout") === "cancelled" && mode === "delivery") {
      toast.error("Payment cancelled. Your quote is saved — complete checkout when ready.")
    }
  }, [searchParams, mode])

  const handleModeChange = useCallback((next: BookFlowMode) => {
    setMode(next)
  }, [])

  const modeToggle = useMemo(
    () => <ModeToggle mode={mode} onChange={handleModeChange} />,
    [mode, handleModeChange]
  )

  if (mode === "delivery") {
    return <MoveInWizard modeToggle={modeToggle} />
  }

  return (
    <BookingWizard bookingBlocks={bookingBlocks} modeToggle={modeToggle} />
  )
}

export function BookFlow(props: BookFlowProps) {
  return (
    <Suspense fallback={null}>
      <BookFlowInner {...props} />
    </Suspense>
  )
}
