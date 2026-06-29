import { auth } from "@clerk/nextjs/server"

import { DeliveriesView } from "@/components/dashboard/deliveries-view"
import { getDeliveryPageData, getProfileForUser } from "@/lib/dashboard-data"

export default async function DeliveriesPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const profile = await getProfileForUser(userId)
  const { upcoming, history } = profile
    ? await getDeliveryPageData(profile.id)
    : { upcoming: [], history: [] }

  return <DeliveriesView upcoming={upcoming} history={history} />
}
