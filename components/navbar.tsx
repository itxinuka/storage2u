"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import {
  Show,
  SignInButton,
  UserButton,
} from "@clerk/nextjs"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { siteContent } from "@/lib/site-content"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between gap-6 px-6 lg:px-7">
        <Logo size="lg" />

        <nav className="hidden items-center gap-8 md:flex">
          {siteContent.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-semibold text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>
          <Button size="sm" variant="secondary" render={<Link href="/book" />}>
            Book a Pickup
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl text-foreground md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-card md:hidden">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-1 px-6 py-4">
            {siteContent.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="border-b border-border py-3 text-base font-semibold text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button variant="ghost" className="w-full">
                    Sign in
                  </Button>
                </SignInButton>
              </Show>
              <Button variant="secondary" className="w-full" render={<Link href="/book" />}>
                Book a Pickup
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
