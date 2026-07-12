import type { Metadata } from "next"
import Link from "next/link"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import {
  PLUS_FEE_MONTHLY,
  PLUS_LIMIT,
  STANDARD_LIMIT,
  formatProtectionLimit,
} from "@/lib/protection-plan"

export const metadata: Metadata = {
  title: "Terms of Service — Storage2U",
  description:
    "Storage2U terms of service, including our Protection Plan, billing, and liability limits for student storage.",
}

const LAST_UPDATED = "July 12, 2026"
const CONTACT_EMAIL = "hello@storage2u.ca"
const WEBSITE_URL = "https://www.storage2u.ca"

function Section({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

function Subheading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 text-lg font-bold text-foreground">{children}</h3>
  )
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-primary py-20">
        <div className="relative mx-auto max-w-[1180px] px-6 text-center lg:px-7">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-accent">
            Legal
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Terms of Service
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Your agreement with Storage2U for pickup, storage, and delivery
            services.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-[760px] space-y-12 px-6 lg:px-7">
          <p className="text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your use of
              services provided by Storage2U Technologies Inc.
              (&quot;Storage2U&quot;, &quot;we&quot;, &quot;our&quot;, or
              &quot;us&quot;) through{" "}
              <Link
                href={WEBSITE_URL}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {WEBSITE_URL}
              </Link>{" "}
              and related pickup, storage, and delivery services for university
              students in Canada.
            </p>
            <p>
              By booking storage with Storage2U, you agree to these Terms. If
              you do not agree, do not use our services.
            </p>
          </div>

          <Section title="Services">
            <p>
              Storage2U provides door-to-door pickup, secure climate-controlled
              storage, and delivery of student belongings (typically boxes, bags,
              and common dorm items). Service areas, appointment windows, and
              item types are described on our website and during booking.
            </p>
            <p>
              We may refuse or return items that are prohibited, improperly
              packed, overweight, or unsuitable for transport or storage.
            </p>
          </Section>

          <Section title="Booking, billing &amp; cancellation">
            <p>
              Storage is billed monthly per box or item at the rates shown when
              you book. Pickup and delivery on campus are included at no extra
              charge unless otherwise stated.
            </p>
            <p>
              Subscriptions are month-to-month. You may request delivery of your
              items at any time. Charges continue until items are returned and
              your storage subscription for those items ends.
            </p>
            <p>
              You authorize us to charge your payment method on file for storage
              fees, optional add-ons, and applicable taxes. Failed payments may
              result in suspension of delivery until your account is current.
            </p>
          </Section>

          <Section id="protection-plan" title="Protection Plan">
            <p>
              Storage2U offers a contractual Protection Plan. This is{" "}
              <strong className="font-semibold text-foreground">
                not insurance
              </strong>
              . It is a limited agreement by Storage2U to pay you up to a
              specified dollar amount for qualifying loss or damage to your
              stored property while in our care.
            </p>

            <Subheading>Standard Protection (included)</Subheading>
            <p>
              Every booking includes Standard Protection at no extra charge,
              covering up to {formatProtectionLimit(STANDARD_LIMIT)} per
              customer (per booking) for qualifying loss or damage.
            </p>

            <Subheading>Optional Protection Plan</Subheading>
            <p>
              You may add the Protection Plan during booking for{" "}
              {formatProtectionLimit(PLUS_FEE_MONTHLY)} per month. This raises
              your coverage limit to {formatProtectionLimit(PLUS_LIMIT)} per
              customer for that booking. The fee is billed monthly with your
              storage subscription from pickup until delivery and is
              non-refundable.
            </p>

            <Subheading>What is covered</Subheading>
            <p>
              Subject to these Terms, we may reimburse you for the reasonable,
              proven replacement value of an item that is lost or damaged while
              being transported or stored by Storage2U, up to your applicable
              limit (Standard or Protection Plan).
            </p>

            <Subheading>Exclusions</Subheading>
            <p>The Protection Plan does not cover:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Cash, securities, negotiable instruments, or documents of value
              </li>
              <li>Jewelry, watches, precious metals, or precious stones</li>
              <li>Antiques, fine art, collectibles, or items of sentimental value</li>
              <li>
                Fragile items including televisions, monitors, computers, glass,
                and similar electronics unless we agree in writing
              </li>
              <li>Prohibited or hazardous items (see below)</li>
              <li>Cosmetic wear, scuffs, or normal wear and tear</li>
              <li>
                Damage from improper packing, overpacked boxes, or low-quality
                containers
              </li>
              <li>Loss or damage not caused while items were in our care</li>
              <li>
                Consequential, incidental, special, or punitive damages
              </li>
            </ul>

            <Subheading>Your responsibilities</Subheading>
            <p>
              You are responsible for packing items securely, labelling boxes,
              and not storing prohibited items. Do not store items worth more
              than your selected protection limit unless you add the Protection
              Plan and accept that reimbursement is still capped at that limit.
            </p>

            <Subheading>Filing a claim</Subheading>
            <p>
              To file a claim, email{" "}
              <Link
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </Link>{" "}
              within <strong className="font-semibold text-foreground">7 days</strong>{" "}
              of delivery or notice of loss or damage. Include your booking
              reference, a description of the item, proof of value (receipts,
              photos, or similar), and evidence that damage occurred while the
              item was in Storage2U&apos;s care. We will pay the lesser of
              proven replacement value and your plan limit. Approval is at our
              reasonable discretion.
            </p>
          </Section>

          <Section title="Prohibited items">
            <p>You may not store:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Food, perishables, or unsealed liquids</li>
              <li>Flammable, explosive, or hazardous materials</li>
              <li>Illegal drugs, stolen goods, or weapons</li>
              <li>Living things</li>
              <li>Cash, jewelry, or high-value collectibles</li>
            </ul>
            <p>
              We may refuse pickup or remove prohibited items. You are
              responsible for any costs arising from prohibited contents.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              Except as described in the Protection Plan section above, our
              total liability for any claim arising from our services is limited
              to the protection limit that applies to your booking (
              {formatProtectionLimit(STANDARD_LIMIT)} Standard, or{" "}
              {formatProtectionLimit(PLUS_LIMIT)} if you purchased the
              Protection Plan).
            </p>
            <p>
              Storage2U is not liable for indirect, consequential, or punitive
              damages. Nothing in these Terms limits rights that cannot be
              limited under applicable law.
            </p>
          </Section>

          <Section title="Scheduling &amp; access">
            <p>
              You or an authorized person must be available during your scheduled
              pickup or delivery window. Missed appointments may incur
              rescheduling fees as communicated at booking.
            </p>
            <p>
              Our storage facilities are not open to the public. Inventory
              photos and records may be kept for operational and claims
              purposes.
            </p>
          </Section>

          <Section title="Changes to these Terms">
            <p>
              We may update these Terms from time to time. Changes take effect
              when posted on this page with an updated date. Continued use of
              our services after changes constitutes acceptance.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about these Terms or the Protection Plan? Contact us at{" "}
              <Link
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </Link>
              .
            </p>
          </Section>
        </div>
      </section>

      <Footer />
    </main>
  )
}
