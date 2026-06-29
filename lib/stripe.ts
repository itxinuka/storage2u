import "server-only"

import Stripe from "stripe"

let cached: Stripe | null = null

/** Returns a configured Stripe client, or null when STRIPE_SECRET_KEY is unset. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!cached) {
    cached = new Stripe(key)
  }
  return cached
}

async function findCustomerId(
  stripe: Stripe,
  email: string
): Promise<string | null> {
  const customers = await stripe.customers.list({ email, limit: 1 })
  return customers.data[0]?.id ?? null
}

/**
 * Sum of the active Stripe subscription line items (in cents) for the customer
 * matched by email. Returns null when Stripe is not configured, there is no
 * matching customer/subscription, or the lookup fails.
 */
export async function getActiveSubscriptionMonthlyCents(
  email: string | null
): Promise<number | null> {
  const stripe = getStripe()
  if (!stripe || !email) return null

  try {
    const customerId = await findCustomerId(stripe, email)
    if (!customerId) return null

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 100,
    })

    if (subscriptions.data.length === 0) return null

    let cents = 0
    for (const subscription of subscriptions.data) {
      for (const item of subscription.items.data) {
        cents += (item.price.unit_amount ?? 0) * (item.quantity ?? 1)
      }
    }
    return cents
  } catch {
    return null
  }
}

/**
 * Creates a Stripe billing portal session for the customer matched by email.
 * Returns null when Stripe is not configured or no customer exists.
 */
export async function createBillingPortalUrl(
  email: string | null,
  returnUrl: string
): Promise<string | null> {
  const stripe = getStripe()
  if (!stripe || !email) return null

  try {
    const customerId = await findCustomerId(stripe, email)
    if (!customerId) return null

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
    return session.url
  } catch {
    return null
  }
}
