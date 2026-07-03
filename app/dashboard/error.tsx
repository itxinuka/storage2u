"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-foreground">
        We couldn&apos;t load your dashboard
      </h1>
      <p className="mt-3 text-muted-foreground">
        Something went wrong on our side. Try again in a moment, or book a pickup
        from the home page.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="secondary" render={<Link href="/" />}>
          Go home
        </Button>
      </div>
    </div>
  )
}
