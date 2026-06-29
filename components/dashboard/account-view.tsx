"use client"

import { useUser } from "@clerk/nextjs"
import {
  Bell,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { AccountAddress, ProfileRow } from "@/lib/dashboard-data"

type AccountViewProps = {
  profile: ProfileRow | null
  defaultAddress: AccountAddress | null
  bookingCount: number
}

function InfoRow({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof User
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="flex items-start gap-3.5 border-b border-border py-4 last:border-b-0">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-soft text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
        {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
      </div>
    </div>
  )
}

function formatMemberSince(createdAt: string | null | undefined): string {
  if (!createdAt) return "—"
  return new Date(createdAt).toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  })
}

export function AccountView({ profile, defaultAddress, bookingCount }: AccountViewProps) {
  const { user } = useUser()

  const fullName =
    profile?.full_name ??
    user?.fullName ??
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ??
    "Student"
  const email =
    profile?.email ??
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    "—"
  const phone = profile?.phone ?? defaultAddress?.phone ?? "Not on file"
  const university =
    profile?.university ?? defaultAddress?.university ?? "Not set — book a pickup to add yours"
  const memberSince = formatMemberSince(profile?.created_at)

  const addressLine = defaultAddress?.address ?? "No address on file yet"
  const residence = defaultAddress?.residence

  return (
    <>
      <header className="mb-7">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Account</h1>
        <p className="mt-1.5 text-[15px] text-muted-foreground">
          Your contact details and campus info for pickups and deliveries.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="gap-0 rounded-3xl border-0 py-0 shadow-brand">
          <CardContent className="p-0 px-5">
            <InfoRow icon={User} label="Full name" value={fullName} />
            <InfoRow icon={Mail} label="Email" value={email} />
            <InfoRow icon={Phone} label="Phone" value={phone} />
            <InfoRow icon={GraduationCap} label="University" value={university} />
            <InfoRow
              icon={MapPin}
              label="Default delivery address"
              value={addressLine}
              sub={residence ? `Residence: ${residence}` : undefined}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="gap-0 rounded-3xl border-0 bg-primary py-0 text-primary-foreground shadow-brand">
            <CardContent className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-primary-foreground/70">
                Your account
              </p>
              <p className="mt-2 text-2xl font-extrabold">{bookingCount}</p>
              <p className="text-sm text-primary-foreground/75">
                {bookingCount === 1 ? "booking" : "bookings"} with Storage2U
              </p>
              <p className="mt-3 text-xs text-primary-foreground/70">
                Member since {memberSince}
              </p>
            </CardContent>
          </Card>

          <Card className="gap-0 rounded-3xl border-0 py-0 shadow-brand">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <p className="text-sm font-bold text-foreground">Notifications</p>
                </div>
                <Badge variant="outline" className="rounded-full border-transparent bg-muted font-bold">
                  Coming soon
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Delivery updates and pickup reminders are sent by text and email for now.
                In-app notification preferences will be available here soon.
              </p>
            </CardContent>
          </Card>

          <Card className="gap-0 rounded-3xl border-0 py-0 shadow-brand">
            <CardContent className="p-5">
              <p className="text-sm font-bold text-foreground">Need to update your info?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Contact{" "}
                <a href="mailto:hello@storage2u.ca" className="font-semibold text-primary">
                  hello@storage2u.ca
                </a>{" "}
                or book a new pickup — your latest booking details become your default address.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
