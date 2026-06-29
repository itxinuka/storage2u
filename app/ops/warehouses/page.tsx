import { WarehousesView } from "@/components/ops/warehouses-view"
import { PageHead } from "@/components/ops/page-head"
import { getWarehousesPageData } from "@/lib/ops/warehouses-data"

export default async function OpsWarehousesPage() {
  let data
  let loadError: string | null = null

  try {
    data = await getWarehousesPageData()
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Failed to load warehouses"
  }

  if (loadError || !data) {
    return (
      <PageHead title="Warehouses" sub="Warehouses could not be loaded">
        <p className="text-sm text-muted-foreground">{loadError}</p>
      </PageHead>
    )
  }

  return <WarehousesView {...data} />
}
