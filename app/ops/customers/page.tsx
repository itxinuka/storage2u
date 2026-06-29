import { CustomersView } from "@/components/ops/customers-view"
import { PageHead } from "@/components/ops/page-head"
import { getCustomersPageData } from "@/lib/ops/customers-data"

export default async function OpsCustomersPage() {
  let data
  let loadError: string | null = null

  try {
    data = await getCustomersPageData()
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Failed to load customers"
  }

  if (loadError || !data) {
    return (
      <PageHead title="Customers" sub="Customers could not be loaded">
        <p className="text-sm text-muted-foreground">{loadError}</p>
      </PageHead>
    )
  }

  return <CustomersView {...data} />
}
