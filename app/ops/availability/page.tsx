import { AvailabilityView } from "@/components/ops/availability-view"
import { PageHead } from "@/components/ops/page-head"
import { getAvailabilityPageData } from "@/lib/ops/availability-data"

export default async function OpsAvailabilityPage() {
  let data
  let loadError: string | null = null

  try {
    data = await getAvailabilityPageData()
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Failed to load availability"
  }

  if (loadError || !data) {
    return (
      <PageHead title="Availability" sub="Availability could not be loaded">
        <p className="text-sm text-muted-foreground">{loadError}</p>
      </PageHead>
    )
  }

  return <AvailabilityView {...data} />
}
