import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { OpsLayoutShell } from "@/components/ops/ops-shell"
import { isOpsStaff } from "@/lib/ops/auth"

export default async function OpsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !isOpsStaff(user?.publicMetadata?.role)) {
    redirect("/")
  }

  const hub = process.env.OPS_HUB_NAME ?? "Vancouver hub"

  return <OpsLayoutShell hub={hub}>{children}</OpsLayoutShell>
}
