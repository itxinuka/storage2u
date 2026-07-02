import type { Metadata } from "next"
import Link from "next/link"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"

export const metadata: Metadata = {
  title: "Privacy Policy — Storage2U",
  description:
    "How Storage2U collects, uses, and protects your personal information when you use our student storage services.",
}

const LAST_UPDATED = "July 2, 2026"
const CONTACT_EMAIL = "hello@storage2u.ca"
const WEBSITE_URL = "https://www.storage2u.ca"

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="scroll-mt-24">
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

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-primary py-20">
        <div className="relative mx-auto max-w-[1180px] px-6 text-center lg:px-7">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-accent">
            Legal
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            How we collect, use, and protect your personal information.
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
              Storage2U Technologies Inc. (&quot;Storage2U&quot;, &quot;we&quot;,
              &quot;our&quot;, or &quot;us&quot;) operates the website{" "}
              <Link
                href={WEBSITE_URL}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {WEBSITE_URL}
              </Link>{" "}
              and provides moving, storage, and logistics services for
              university students across Canada.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, and
              protect personal information when users interact with our website
              or use our services.
            </p>
            <p>
              By using our website or services, you agree to the collection and
              use of information in accordance with this policy.
            </p>
          </div>

          <Section title="Information We Collect">
            <p>
              We may collect several types of information when you interact
              with our website or use our services.
            </p>

            <Subheading>Personal Information</Subheading>
            <p>
              When you request a quote, create an account, or schedule storage
              services, we may collect:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Pickup and delivery addresses</li>
              <li>University affiliation</li>
              <li>
                Details about items being stored (boxes, luggage, furniture, etc.)
              </li>
            </ul>

            <Subheading>Account Information</Subheading>
            <p>
              If you create an account on our platform, we may store account
              credentials and identifiers associated with your profile.
            </p>

            <Subheading>Technical Information</Subheading>
            <p>
              When visiting our website, certain information may be collected
              automatically, including:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device type</li>
              <li>Pages visited</li>
              <li>Date and time of access</li>
            </ul>
            <p>
              This information helps us understand how our website is used and
              improve our services.
            </p>
          </Section>

          <Section title="How We Use Your Information">
            <p>We use collected information for the following purposes:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Providing storage and moving services</li>
              <li>Scheduling pickups and deliveries</li>
              <li>
                Communicating with customers regarding bookings or updates
              </li>
              <li>Processing payments and service requests</li>
              <li>Improving our website and services</li>
              <li>Providing customer support</li>
              <li>Preventing fraud or misuse of services</li>
              <li>Complying with legal requirements</li>
            </ul>
            <p>
              We only use personal information as necessary to operate and
              improve our services.
            </p>
          </Section>

          <Section title="Google User Data">
            <p>
              If users choose to sign in using Google authentication (Google
              OAuth), our application may access limited profile information
              from the user&apos;s Google account.
            </p>

            <Subheading>Data Accessed</Subheading>
            <p>Our application may access the following information from Google:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Name</li>
              <li>Email address</li>
              <li>Google account ID</li>
              <li>Profile image (if available)</li>
            </ul>

            <Subheading>Data Usage</Subheading>
            <p>Google user data is used solely for:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Authenticating users during login</li>
              <li>Creating and managing user accounts</li>
              <li>Enabling secure sign-in functionality</li>
            </ul>
            <p>Google user data is not used for advertising purposes.</p>

            <Subheading>Data Sharing</Subheading>
            <p>
              Storage2U does not sell or share Google user data with third
              parties, except where necessary to operate our services (for
              example, secure cloud hosting providers).
            </p>
            <p>
              Google user data is never sold or used for marketing purposes.
            </p>

            <Subheading>Data Storage &amp; Protection</Subheading>
            <p>
              Google user data is stored securely using industry-standard
              security practices including encrypted connections and restricted
              access controls.
            </p>

            <Subheading>Data Retention</Subheading>
            <p>
              Google user data is retained only as long as necessary to maintain
              user accounts and provide services.
            </p>

            <Subheading>Data Deletion</Subheading>
            <p>
              Users may request deletion of their data at any time by contacting
              us at{" "}
              <Link
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </Link>
              . Upon request, we will delete applicable user data from our
              systems within a reasonable timeframe.
            </p>
          </Section>

          <Section title="Data Sharing">
            <p>We do not sell personal information.</p>
            <p>
              We may share limited information with trusted third-party service
              providers that help operate our services, including:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Payment processors</li>
              <li>Cloud hosting providers</li>
              <li>Logistics or delivery partners</li>
            </ul>
            <p>
              These providers only receive information necessary to perform
              their services.
            </p>
          </Section>

          <Section title="Data Storage &amp; Security">
            <p>
              We implement reasonable safeguards to protect personal information
              from unauthorized access, misuse, or disclosure. These measures
              include:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Secure servers</li>
              <li>Encrypted website connections (HTTPS)</li>
              <li>Restricted internal access to sensitive data</li>
            </ul>
            <p>
              While we take steps to protect user data, no system can guarantee
              absolute security.
            </p>
          </Section>

          <Section title="Data Retention">
            <p>Personal information is retained only as long as necessary to:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Provide services to customers</li>
              <li>Maintain service records</li>
              <li>Comply with legal or regulatory obligations</li>
            </ul>
            <p>
              Data that is no longer required will be securely deleted or
              anonymized.
            </p>
          </Section>

          <Section title="User Rights">
            <p>Users may request to:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Access their personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of their personal data</li>
            </ul>
            <p>
              Requests can be made by contacting us using the email address
              below.
            </p>
          </Section>

          <Section title="Third-Party Links">
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices or policies of those
              external sites.
            </p>
          </Section>

          <Section title="Changes to This Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated &quot;Last
              updated&quot; date.
            </p>
          </Section>

          <Section title="Contact Us">
            <p>
              If you have questions regarding this Privacy Policy or how your
              information is handled, please contact us at:
            </p>
            <p>
              Email:{" "}
              <Link
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </Link>
            </p>
          </Section>
        </div>
      </section>

      <Footer />
    </main>
  )
}
