import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { shadcn } from "@clerk/ui/themes"
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google"

import { PostHogHeadScript } from "@/components/posthog-head-script"
import { TawkToScript } from "@/components/tawk-to-script"
import { Toaster } from "@/components/ui/sonner"

import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Storage2U — Student Storage Pickup & Delivery",
  description:
    "Storage2U picks up your dorm room boxes, stores them safely, and delivers them back when you need them. Serving Memorial, StFX, Dalhousie, and CNA.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ClerkProvider appearance={{ theme: shadcn }}>
          {children}
          <Toaster />
        </ClerkProvider>
        <PostHogHeadScript />
        <TawkToScript />
      </body>
    </html>
  )
}
