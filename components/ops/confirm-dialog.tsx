"use client"

import { Trash2 } from "lucide-react"
import type { ReactNode } from "react"

import { Modal } from "@/components/ops/modal"
import { Button } from "@/components/ui/button"

type ConfirmDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: ReactNode
  confirmLabel?: string
  pending?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Delete",
  pending = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width={420}
      footer={
        <div className="flex gap-2.5">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={pending}
          >
            Cancel
          </Button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-pill)] border-0 bg-[var(--danger-fg)] px-[26px] text-[15px] font-bold text-white shadow-[var(--shadow-sm)] transition-[background_140ms_ease,transform_120ms_var(--ease-squish)] hover:brightness-95 active:translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            {confirmLabel}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-[var(--danger-bg)] text-[var(--danger-fg)]">
          <Trash2 className="size-7" />
        </span>
        {description ? (
          <p className="text-[14.5px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        <p className="text-[13px] font-semibold text-[var(--danger-fg)]">
          This action can&apos;t be undone.
        </p>
      </div>
    </Modal>
  )
}
