import { cn } from "@/lib/utils"

type SectionHeaderProps = {
  eyebrow: string
  title: string
  description?: string
  center?: boolean
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  center = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-xl",
        center && "mx-auto text-center",
        className
      )}
    >
      <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-primary">
        {eyebrow}
      </p>
      <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground md:text-4xl md:leading-[1.08]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-[17px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function IconTile({
  children,
  variant = "primary",
  className,
}: {
  children: React.ReactNode
  variant?: "primary" | "soft" | "lime"
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-2xl",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "soft" && "bg-purple-soft text-primary",
        variant === "lime" && "bg-accent text-accent-foreground",
        className
      )}
    >
      {children}
    </span>
  )
}
