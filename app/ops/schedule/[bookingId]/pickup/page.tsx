import Link from "next/link"

import { startPickupSession } from "@/app/ops/pickup-actions"
import { PickupView } from "@/components/ops/pickup-view"
import { Button } from "@/components/ui/button"
import { getPickupPageData } from "@/lib/ops/pickup-data"

export default async function OpsPickupPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = await params

  const startResult = await startPickupSession(bookingId)
  if (!startResult.success) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-1 py-6">
        <h1 className="text-xl font-extrabold">Cannot start pickup</h1>
        <p className="text-sm text-muted-foreground">
          {startResult.error ?? "Unknown error"}
        </p>
        <Button variant="outline" render={<Link href="/ops/schedule" />}>
          Back to schedule
        </Button>
      </div>
    )
  }

  const data = await getPickupPageData(bookingId)
  if (!data) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-1 py-6">
        <h1 className="text-xl font-extrabold">Pickup session missing</h1>
        <p className="text-sm text-muted-foreground">
          The session could not be loaded. Try starting again from the schedule.
        </p>
        <Button variant="outline" render={<Link href="/ops/schedule" />}>
          Back to schedule
        </Button>
      </div>
    )
  }

  return <PickupView data={data} />
}
