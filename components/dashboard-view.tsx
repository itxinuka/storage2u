"use client"



import Link from "next/link"

import { useUser } from "@clerk/nextjs"

import { Box, DollarSign, Plus, Truck } from "lucide-react"



import { ActiveStorage } from "@/components/dashboard/active-storage"

import type { ActiveBooking } from "@/components/dashboard/active-storage"

import { DashboardStatCard } from "@/components/dashboard/dashboard-shell"

import { PastBookings } from "@/components/dashboard/past-bookings"

import type { PastBooking } from "@/components/dashboard/past-bookings"

import { Button } from "@/components/ui/button"

import { computeDashboardStats } from "@/lib/booking-display"

import { siteContent } from "@/lib/site-content"



type DashboardViewProps = {

  activeBookings: ActiveBooking[]

  pastBookings: PastBooking[]

  university?: string | null

  monthlyTotalCents?: number | null

  nextDeliveryDate?: string | null

  nextDeliveryBoxes?: number | null

}



export function DashboardView({

  activeBookings,

  pastBookings,

  university,

  monthlyTotalCents,

  nextDeliveryDate,

  nextDeliveryBoxes,

}: DashboardViewProps) {

  const { user } = useUser()

  const firstName = user?.firstName ?? "there"

  const stats = computeDashboardStats(activeBookings, pastBookings, {

    monthlyTotalCentsOverride: monthlyTotalCents,

    nextDeliveryDate,

    nextDeliveryBoxes,

  })



  return (

    <>

      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">

            Hi, {firstName}

          </h1>

          <p className="mt-1.5 text-[15px] text-muted-foreground">

            {siteContent.dashboard.greeting}

          </p>

          {university ? (

            <p className="mt-1 text-sm font-semibold text-primary">{university}</p>

          ) : null}

        </div>

        <Button

          variant="secondary"

          className="hidden shrink-0 sm:inline-flex"

          render={<Link href="/book" />}

        >

          <Plus className="h-4 w-4" />

          Book a pickup

        </Button>

      </header>



      {stats.hasOutForDelivery ? (

        <div className="mb-6 flex items-start gap-3.5 rounded-3xl bg-accent px-5 py-4 shadow-brand">

          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-foreground/10">

            <Truck className="h-5 w-5 text-accent-foreground" />

          </span>

          <div>

            <p className="font-bold text-accent-foreground">A delivery is on its way</p>

            <p className="text-sm text-accent-foreground/80">

              We&apos;ll text you when your boxes are close.{" "}

              <Link href="/dashboard/deliveries" className="font-semibold underline">

                Track it

              </Link>

            </p>

          </div>

        </div>

      ) : null}



      <div className="mb-9 grid gap-4 md:grid-cols-3">

        <DashboardStatCard

          icon={Box}

          label="Boxes stored"

          value={stats.boxesStored}

          sub={stats.boxesSub}

          tone="purple"

        />

        <DashboardStatCard

          icon={DollarSign}

          label="Monthly total"

          value={stats.monthlyTotal}

          sub={stats.monthlySub}

          tone="lime"

        />

        <DashboardStatCard

          icon={Truck}

          label="Next delivery"

          value={stats.nextDelivery}

          sub={stats.nextDeliverySub}

          tone="soft"

        />

      </div>



      <div className="space-y-11">

        <ActiveStorage bookings={activeBookings} />

        <PastBookings bookings={pastBookings} />

      </div>

    </>

  )

}

