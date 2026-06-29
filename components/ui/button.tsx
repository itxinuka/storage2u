import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const pillMotion = [
  "rounded-[var(--radius-pill)]",
  "font-bold tracking-[-0.01em] leading-none whitespace-nowrap gap-2",
  "transition-[background_140ms_ease,transform_120ms_var(--ease-squish),box-shadow_140ms_ease]",
  "active:not-aria-[haspopup]:translate-y-0.5",
].join(" ")

const utilityMotion =
  "rounded-md text-sm font-semibold gap-1.5 whitespace-nowrap transition-all active:not-aria-[haspopup]:translate-y-px"

const brandPrimary = [
  pillMotion,
  "bg-[var(--brand-primary)] text-[var(--on-primary)] shadow-[var(--shadow-sm)]",
  "hover:bg-[var(--brand-primary-hover)] aria-expanded:bg-[var(--brand-primary-hover)]",
].join(" ")

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding",
    "outline-none select-none",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: brandPrimary,
        primary: brandPrimary,
        secondary: [
          pillMotion,
          "bg-[var(--brand-accent)] text-[var(--on-accent)] shadow-[var(--shadow-sm)]",
          "hover:bg-[var(--brand-accent-hover)]",
          "aria-expanded:bg-[var(--brand-accent)] aria-expanded:text-[var(--on-accent)]",
        ].join(" "),
        outline: [
          pillMotion,
          "border-transparent bg-transparent text-[var(--brand-primary)]",
          "shadow-[inset_0_0_0_2px_var(--brand-primary)] hover:bg-[var(--purple-50)]",
          "aria-expanded:bg-[var(--purple-50)]",
        ].join(" "),
        ghost: [
          pillMotion,
          "bg-transparent text-[var(--text-body)] shadow-none",
          "hover:bg-[var(--surface-muted)] aria-expanded:bg-[var(--surface-muted)]",
        ].join(" "),
        destructive: [
          utilityMotion,
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
          "focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
          "dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        ].join(" "),
        link: [
          utilityMotion,
          "bg-transparent text-primary underline-offset-4 hover:underline",
        ].join(" "),
      },
      size: {
        default:
          "h-12 px-[26px] text-[15px] has-data-[icon=inline-end]:pr-[22px] has-data-[icon=inline-start]:pl-[22px]",
        xs: "h-10 px-[18px] text-sm has-data-[icon=inline-end]:pr-[14px] has-data-[icon=inline-start]:pl-[14px] [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-10 px-[18px] text-sm has-data-[icon=inline-end]:pr-[14px] has-data-[icon=inline-start]:pl-[14px] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-14 px-[34px] text-[17px] has-data-[icon=inline-end]:pr-[30px] has-data-[icon=inline-start]:pl-[30px]",
        icon: "size-12 [&_svg:not([class*='size-'])]:size-4",
        "icon-xs": "size-10 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-10 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-14 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    compoundVariants: [
      {
        variant: ["destructive", "link"],
        size: "default",
        class:
          "h-8 gap-1.5 px-2.5 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
      {
        variant: ["destructive", "link"],
        size: "xs",
        class:
          "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
      },
      {
        variant: ["destructive", "link"],
        size: "sm",
        class:
          "h-7 gap-1 px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
      },
      {
        variant: ["destructive", "link"],
        size: "lg",
        class:
          "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
      {
        variant: ["destructive", "link"],
        size: "icon",
        class: "size-8",
      },
      {
        variant: ["destructive", "link"],
        size: "icon-xs",
        class: "size-6 [&_svg:not([class*='size-'])]:size-3",
      },
      {
        variant: ["destructive", "link"],
        size: "icon-sm",
        class: "size-7",
      },
      {
        variant: ["destructive", "link"],
        size: "icon-lg",
        class: "size-9",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  nativeButton,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      render={render}
      nativeButton={nativeButton ?? (render ? false : true)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
