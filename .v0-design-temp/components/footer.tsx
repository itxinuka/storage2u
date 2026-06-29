import { Package } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Package className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="font-sans text-lg font-bold text-background tracking-tight">
              Storage<span className="text-accent">2U</span>
            </span>
          </a>

          {/* Links */}
          <nav className="flex flex-wrap gap-6">
            {["How It Works", "Universities", "Pricing", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-background/60 hover:text-background transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-background/40">
            &copy; {new Date().getFullYear()} Storage2U. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
