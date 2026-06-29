"use client"



import { DollarSign } from "lucide-react"

import { useTransition } from "react"

import { toast } from "sonner"



import { openBillingPortal } from "@/app/dashboard/actions"

import { Button } from "@/components/ui/button"

import { siteContent } from "@/lib/site-content"



export function BillingView() {

  const placeholder = siteContent.dashboard.placeholders.billing

  const [pending, startTransition] = useTransition()



  const handleBilling = () => {

    startTransition(async () => {

      const result = await openBillingPortal()

      if ("url" in result) {

        window.location.href = result.url

      } else {

        toast.error(result.error)

      }

    })

  }



  return (

    <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">

      <div className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[32px] bg-purple-soft">

        <DollarSign className="h-7 w-7 text-primary" />

      </div>

      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">

        {placeholder.title}

      </h1>

      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">

        {placeholder.body}

      </p>

      <Button

        variant="secondary"

        className="mt-6"

        disabled={pending}

        onClick={handleBilling}

      >

        <DollarSign className="h-4 w-4" />

        Manage billing

      </Button>

    </div>

  )

}

