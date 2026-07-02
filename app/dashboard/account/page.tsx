import { auth } from "@clerk/nextjs/server"

import { AccountView } from "@/components/dashboard/account-view"
import { getAccountPageData, getProfileForUser } from "@/lib/dashboard-data.server"

export default async function AccountPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const profile = await getProfileForUser(userId)
  const { defaultAddress, bookingCount } = profile
    ? await getAccountPageData(profile.id)
    : { defaultAddress: null, bookingCount: 0 }

  return (
    <AccountView
      profile={profile}
      defaultAddress={defaultAddress}
      bookingCount={bookingCount}
    />
  )
}
