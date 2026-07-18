import { notFound } from "next/navigation"

import { PrintLabelsView } from "@/components/ops/print-labels-view"
import { getOrderLabelsPageData } from "@/lib/ops/order-labels-data"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function OrderLabelsPage({ params }: PageProps) {
  const { id } = await params
  let data
  try {
    data = await getOrderLabelsPageData(id)
  } catch {
    notFound()
  }

  if (!data) {
    notFound()
  }

  return (
    <PrintLabelsView
      displayId={data.displayId}
      customer={data.customer}
      units={data.units}
    />
  )
}
