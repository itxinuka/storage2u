import Stripe from "stripe"
import { config } from "dotenv"
import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.join(__dirname, "..", ".env.local") })

const manifest = JSON.parse(
  readFileSync(path.join(__dirname, "stripe-brand-manifest.json"), "utf8")
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const prices = await stripe.prices.list({ active: true, limit: 1 })
const priceId = prices.data[0]?.id
if (!priceId) {
  console.error("No active price found for test checkout")
  process.exit(1)
}

const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  line_items: [{ price: priceId, quantity: 1 }],
  success_url: "https://storage2u.ca/book/complete?session_id={CHECKOUT_SESSION_ID}",
  cancel_url: "https://storage2u.ca/book?checkout=cancelled",
  branding_settings: {
    display_name: "Storage2U",
    logo: { type: "file", file: manifest.logoFileId },
    icon: { type: "file", file: manifest.iconFileId },
    background_color: manifest.colors.background,
    button_color: manifest.colors.primary,
    border_style: "rounded",
  },
  custom_text: {
    after_submit: {
      message: `Questions? Email [${manifest.publicDetails.supportEmail}](mailto:${manifest.publicDetails.supportEmail}). [Privacy policy](${manifest.publicDetails.privacyPolicy}) · [Terms of service](${manifest.publicDetails.termsOfService})`,
    },
  },
})

const retrieved = await stripe.checkout.sessions.retrieve(session.id)

console.log(
  JSON.stringify(
    {
      sessionId: session.id,
      url: session.url,
      branding: retrieved.branding_settings,
      customText: retrieved.custom_text,
    },
    null,
    2
  )
)
