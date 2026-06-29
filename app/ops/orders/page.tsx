import { PageHead } from "@/components/ops/page-head"
import { OrdersView } from "@/components/ops/orders-view"
import { getOrdersPageData } from "@/lib/ops/orders-data"

export default async function OpsOrdersPage() {
  let data
  let loadError: string | null = null

  try {
    data = await getOrdersPageData()
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Failed to load orders"
  }

  if (loadError || !data) {
    return (
      <PageHead title="Orders" sub="Orders could not be loaded">
        <p className="text-sm text-muted-foreground">{loadError}</p>
      </PageHead>
    )
  }

  return <OrdersView {...data} />
}
