"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { deleteOrder } from "@/app/ops/actions"
import { ConfirmDialog } from "@/components/ops/confirm-dialog"
import { MessageButton } from "@/components/ops/message-button"
import { Button } from "@/components/ui/button"
import type { OpsOrder } from "@/lib/ops/orders-types"

type OrderDrawerFooterProps = {
  order: OpsOrder
  onClose?: () => void
  onDeleted?: (orderId: string) => void
  onDeleteFailed?: () => void
}

export function OrderDrawerFooter({
  order,
  onClose,
  onDeleted,
  onDeleteFailed,
}: OrderDrawerFooterProps) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    const previousId = order.id
    onDeleted?.(previousId)

    startTransition(async () => {
      const result = await deleteOrder(previousId)

      if (!result.success) {
        onDeleteFailed?.()
        toast.error(result.error ?? "Could not delete order")
        router.refresh()
        return
      }

      toast.success("Order deleted")
      setConfirmOpen(false)
      onClose?.()
      router.refresh()
    })
  }

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className="flex gap-2.5">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => toast.info("Edit order is coming soon")}
          >
            Edit order
          </Button>
          <MessageButton
            className="flex-1"
            email={order.customerEmail}
            phone={order.customerPhone}
            customerName={order.customer}
          />
        </div>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-pill)] border-0 bg-[var(--danger-bg)] text-[14px] font-bold text-[var(--danger-fg)] transition-colors hover:brightness-95"
        >
          <Trash2 className="size-4" />
          Delete order
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete this order?"
        description={
          <>
            Order <strong>#{order.displayId}</strong> for {order.customer} will be
            permanently removed, including any scheduled stop.
          </>
        }
        confirmLabel="Delete order"
        pending={pending}
      />
    </>
  )
}
