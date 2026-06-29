import Link from "next/link"

import { Logo } from "@/components/logo"

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Compare", href: "/#compare" },
      { label: "Move-in service", href: "/book?mode=delivery" },
      { label: "Book a pickup", href: "/book" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", href: "/contact" },
      { label: "Track a delivery", href: "/dashboard" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-[1180px] px-6 py-14 lg:px-7">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo onColor size="lg" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/55">
              On-demand storage for Canadian students. We pick up, you relax.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h5 className="mb-4 text-xs font-bold uppercase tracking-[0.06em] text-background/50">
                {col.title}
              </h5>
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block py-1.5 text-sm text-background/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-11 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-background/45 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Storage2U Technologies Inc. Made in Canada.</p>
          <p>Privacy · Terms · Cookies</p>
        </div>
      </div>
    </footer>
  )
}
