import { PageHead } from "@/components/ops/page-head"
import { ScheduleView } from "@/components/ops/schedule-view"
import { getSchedulePageData, parseScheduleDate } from "@/lib/ops/schedule-data"

export default async function OpsSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  const selectedDate = parseScheduleDate(date)

  let data
  let loadError: string | null = null

  try {
    data = await getSchedulePageData(selectedDate)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load schedule"
    loadError =
      message.includes("relation") || message.includes("does not exist")
        ? "Dispatch tables are not migrated yet. Apply supabase/migrations/20260628120000_dispatch_ops_tables.sql to your project."
        : message
  }

  if (loadError || !data) {
    return (
      <PageHead title="Operations" sub="Schedule could not be loaded">
        <p className="text-sm text-muted-foreground">{loadError}</p>
      </PageHead>
    )
  }

  return <ScheduleView {...data} />
}
