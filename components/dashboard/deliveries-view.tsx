"use client"



import Link from "next/link"

import { CalendarDays, Clock, MapPin, Package, Truck } from "lucide-react"



import { DeliveryStatusBadge } from "@/components/dashboard/delivery-status-badge"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import { Card } from "@/components/ui/card"

import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress"

import type { DeliveryDisplay } from "@/lib/dashboard-data"

import { cn } from "@/lib/utils"



type DeliveriesViewProps = {

  upcoming: DeliveryDisplay[]

  history: DeliveryDisplay[]

}



function DetailRow({

  icon: Icon,

  label,

  value,

}: {

  icon: typeof CalendarDays

  label: string

  value: string

}) {

  return (

    <div className="flex items-start gap-2.5">

      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

      <div>

        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">

          {label}

        </p>

        <p className="text-sm font-semibold text-foreground">{value}</p>

      </div>

    </div>

  )

}



function DeliveryCard({ delivery }: { delivery: DeliveryDisplay }) {

  const isPickup = delivery.kind === "pickup"

  const isActive =

    delivery.status === "in_transit" ||

    delivery.status === "pending" ||

    (isPickup && delivery.status === "scheduled")

  const showProgress = delivery.status === "in_transit"



  return (

    <Card className="gap-0 overflow-hidden rounded-3xl border-0 py-0 shadow-brand">

      <div

        className={cn(

          "px-5 pb-4 pt-5",

          showProgress ? "bg-lime-soft/50" : "bg-purple-soft/70"

        )}

      >

        <div className="mb-3 flex flex-wrap items-center gap-2">

          <DeliveryStatusBadge status={delivery.status} />

          <Badge variant="outline" className="rounded-full border-transparent bg-muted font-bold">

            {isPickup ? "Pickup" : "Return delivery"}

          </Badge>

          <Badge variant="outline" className="rounded-full border-transparent bg-muted font-bold">

            {delivery.boxesLabel}

          </Badge>

        </div>

        <h3 className="text-base font-extrabold text-foreground">{delivery.university}</h3>

      </div>



      <div className="space-y-3.5 px-5 py-4">

        <DetailRow

          icon={CalendarDays}

          label={isPickup ? "Pickup date" : "Requested date"}

          value={delivery.requestedDateLabel}

        />

        {delivery.timeWindow ? (

          <DetailRow icon={Clock} label="Time window" value={delivery.timeWindow} />

        ) : null}

        <DetailRow

          icon={MapPin}

          label={isPickup ? "Pickup address" : "Delivery address"}

          value={delivery.address}

        />

        {showProgress ? (

          <div>

            <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-muted-foreground">

              <span>Delivery progress</span>

              <span>On the way</span>

            </div>

            <Progress value={72}>

              <ProgressTrack className="h-3 bg-muted">

                <ProgressIndicator className="bg-accent" />

              </ProgressTrack>

            </Progress>

          </div>

        ) : null}

      </div>



      {isActive && !isPickup ? (

        <div className="border-t border-border bg-muted/50 p-4">

          <Button variant="outline" className="w-full" disabled>

            <Truck className="h-4 w-4" />

            Track delivery

          </Button>

        </div>

      ) : null}

    </Card>

  )

}



function HistoryRow({ delivery }: { delivery: DeliveryDisplay }) {

  return (

    <div className="grid gap-3 border-b border-border px-5 py-4 last:border-b-0 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center sm:gap-4">

      <div>

        <p className="text-sm font-bold text-foreground">{delivery.university}</p>

        <p className="text-xs text-muted-foreground">{delivery.address}</p>

      </div>

      <p className="text-sm text-foreground">{delivery.requestedDateLabel}</p>

      <p className="text-sm text-muted-foreground">{delivery.boxesLabel}</p>

      <div className="flex items-center justify-start sm:justify-end">

        <DeliveryStatusBadge status={delivery.status} />

      </div>

    </div>

  )

}



function EmptyUpcoming() {

  return (

    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-brand">

      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-soft">

        <Truck className="h-5 w-5 text-primary" />

      </div>

      <p className="font-semibold text-foreground">No upcoming deliveries</p>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">

        Request a return delivery from your active storage, or book a pickup to get started.

      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">

        <Button render={<Link href="/dashboard" />} variant="secondary">

          <Package className="h-4 w-4" />

          My Storage

        </Button>

        <Button render={<Link href="/book" />}>

          <Truck className="h-4 w-4" />

          Book a pickup

        </Button>

      </div>

    </div>

  )

}



export function DeliveriesView({ upcoming, history }: DeliveriesViewProps) {

  return (

    <>

      <header className="mb-7">

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Deliveries</h1>

        <p className="mt-1.5 text-[15px] text-muted-foreground">

          Track upcoming pickups and return deliveries to your door.

        </p>

      </header>



      <section className="mb-11">

        <div className="mb-4 flex items-center justify-between gap-3">

          <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">

            Upcoming

          </h2>

          <span className="text-sm font-semibold text-muted-foreground">

            {upcoming.length} scheduled

          </span>

        </div>



        {upcoming.length === 0 ? (

          <EmptyUpcoming />

        ) : (

          <div className="grid gap-4 md:grid-cols-2">

            {upcoming.map((delivery) => (

              <DeliveryCard key={`${delivery.kind}-${delivery.id}`} delivery={delivery} />

            ))}

          </div>

        )}

      </section>



      <section>

        <div className="mb-4 flex items-center justify-between gap-3">

          <h2 className="text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">

            Delivery history

          </h2>

          <span className="text-sm font-semibold text-muted-foreground">

            {history.length} past

          </span>

        </div>



        {history.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">

            Completed deliveries will show up here.

          </div>

        ) : (

          <Card className="gap-0 overflow-hidden rounded-3xl border-0 py-0 shadow-brand">

            <div className="hidden border-b border-border bg-muted/40 px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:grid sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:gap-4">

              <span>Booking</span>

              <span>Date</span>

              <span>Items</span>

              <span className="text-right">Status</span>

            </div>

            {history.map((delivery) => (

              <HistoryRow key={delivery.id} delivery={delivery} />

            ))}

          </Card>

        )}

      </section>

    </>

  )

}

