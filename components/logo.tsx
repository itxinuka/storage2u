import Link from "next/link"

import { cn } from "@/lib/utils"

type LogoProps = {
  size?: "sm" | "md" | "lg"
  onColor?: boolean
  className?: string
}

const sizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
}

export function Logo({ size = "md", onColor = false, className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-baseline font-extrabold tracking-tight no-underline",
        sizes[size],
        onColor ? "text-white" : "text-foreground",
        className
      )}
    >
      Storage
      <span className={onColor ? "text-accent" : "text-primary"}>2U</span>
    </Link>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-primary text-xs font-extrabold text-primary-foreground",
        className
      )}
    >
      2U
    </span>
  )
}
