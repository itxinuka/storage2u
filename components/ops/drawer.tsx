"use client"

import { X } from "lucide-react"
import { useEffect, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type DrawerProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  footer?: ReactNode
  children?: ReactNode
  width?: number
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  footer,
  children,
  width = 480,
}: DrawerProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[200] bg-[rgba(24,20,69,0.42)] transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        style={{ width: `min(${width}px, 94vw)` }}
        className={cn(
          "fixed top-0 right-0 bottom-0 z-[201] flex flex-col bg-background shadow-[-18px_0_50px_rgba(24,20,69,0.22)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.2,0.64,1)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border bg-card px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">
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
            className="inline-flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-muted text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{open ? children : null}</div>
        {footer ? (
          <div className="border-t border-border bg-card px-6 py-4">
            {footer}
          </div>
        ) : null}
      </aside>
    </>
  )
}
