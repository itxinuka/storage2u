import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageHeadProps = {
  title: string
  sub?: string
  children?: ReactNode
  className?: string
}

export function PageHead({ title, sub, children, className }: PageHeadProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-start justify-between gap-4",
        className
      )}
    >
      <div>
        <h1 className="text-[30px] font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        {sub ? (
          <p className="mt-1.5 text-[15px] text-muted-foreground">{sub}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}
