"use client"

import { X } from "lucide-react"
import { useEffect, type ReactNode } from "react"

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  footer?: ReactNode
  children?: ReactNode
  width?: number
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  footer,
  children,
  width = 460,
}: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[210] flex items-center justify-center bg-[rgba(24,20,69,0.42)] p-5"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ops-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{ width: `min(${width}px, 96vw)` }}
        className="flex max-h-[90vh] flex-col overflow-hidden rounded-3xl bg-card shadow-brand-lg"
      >
        <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-3.5">
          <div>
            <h2
              id="ops-modal-title"
              className="text-[19px] font-extrabold tracking-tight text-foreground"
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-[13.5px] text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-muted text-foreground"
          >
            <X className="size-[18px]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-1 pb-5">{children}</div>
        {footer ? (
          <div className="border-t border-border bg-muted px-6 py-3.5">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
