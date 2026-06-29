import { auth, currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { redirect } from "next/navigation"

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/customers", label: "Customers" },
] as const

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { userId } = await auth()
  const user = await currentUser()
  const role = user?.publicMetadata?.role

  if (!userId || role !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="border-b border-sidebar-border px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-sidebar-foreground/60">
            Storage2U
          </p>
          <h1 className="text-lg font-semibold text-sidebar-foreground">
            Admin
          </h1>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 pl-64">{children}</main>
    </div>
  )
}
