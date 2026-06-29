"use client"

import { Inbox } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { contactHref } from "@/lib/ops/contact"

type MessageButtonProps = {
  email?: string | null
  phone?: string | null
  customerName?: string
  className?: string
}

export function MessageButton({
  email,
  phone,
  customerName,
  className,
}: MessageButtonProps) {
  const href = contactHref(email, phone)

  if (href) {
    return (
      <Button className={className} render={<a href={href} />}>
        <Inbox className="size-4" />
        Message
      </Button>
    )
  }

  return (
    <Button
      className={className}
      onClick={() =>
        toast.info(
          customerName
            ? `No email or phone on file for ${customerName}.`
            : "No contact info on file for this customer."
        )
      }
    >
      <Inbox className="size-4" />
      Message
    </Button>
  )
}
