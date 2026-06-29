import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col gap-4 border-r border-border bg-card px-3.5 py-5 lg:flex">
        <Skeleton className="h-7 w-28" />
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-full" />
        ))}
      </aside>

      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-[1080px] px-4 py-6 pb-28 lg:px-8 lg:py-8 lg:pb-12">
          <div className="mb-7 space-y-2">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-4 w-72" />
          </div>

          <div className="mb-9 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="rounded-3xl p-5">
                <div className="flex items-start gap-3.5">
                  <Skeleton className="h-11 w-11 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Skeleton className="mb-4 h-3 w-28" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="gap-0 rounded-3xl py-0">
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="space-y-3 p-5 pt-0">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="border-t border-border p-4">
                  <Skeleton className="h-9 w-full rounded-full" />
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
