import "server-only"

import Stripe from "stripe"

import { STRIPE_CHECKOUT_BRANDING } from "@/lib/stripe-branding"
import type { StripeLineItem } from "@/lib/stripe-prices"

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

export async function findCustomerId(
  stripe: Stripe,
  email: string
): Promise<string | null> {
  const customers = await stripe.customers.list({ email, limit: 1 })
  return customers.data[0]?.id ?? null
}

export async function getActiveSubscription(
  stripe: Stripe,
  customerId: string
): Promise<Stripe.Subscription | null> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  })
  return subscriptions.data[0] ?? null
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

type GetOrCreateCustomerInput = {
  email: string
  name: string | null
  clerkUserId: string
  existingStripeCustomerId?: string | null
}

export async function getOrCreateCustomer(
  input: GetOrCreateCustomerInput
): Promise<string | null> {
  const stripe = getStripe()
  if (!stripe) return null

  if (input.existingStripeCustomerId) {
    try {
      const existing = await stripe.customers.retrieve(
        input.existingStripeCustomerId
      )
      if (!existing.deleted) {
        return existing.id
      }
    } catch {
      // Stale customer id — fall through to lookup/create.
    }
  }

  const existingId = await findCustomerId(stripe, input.email)
  if (existingId) return existingId

  const customer = await stripe.customers.create({
    email: input.email,
    name: input.name ?? undefined,
    metadata: { clerk_user_id: input.clerkUserId },
  })
  return customer.id
}

type CreateSubscriptionCheckoutInput = {
  customerId: string
  lineItems: StripeLineItem[]
  bookingId: string
  successUrl: string
  cancelUrl: string
}

export async function createSubscriptionCheckout(
  input: CreateSubscriptionCheckoutInput
): Promise<string | null> {
  const stripe = getStripe()
  if (!stripe || input.lineItems.length === 0) return null

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: input.customerId,
      line_items: input.lineItems.map((item) => ({
        price: item.price,
        quantity: item.quantity,
      })),
      allow_promotion_codes: true,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      client_reference_id: input.bookingId,
      metadata: {
        booking_id: input.bookingId,
      },
      branding_settings: {
        display_name: STRIPE_CHECKOUT_BRANDING.displayName,
        background_color: STRIPE_CHECKOUT_BRANDING.backgroundColor,
        button_color: STRIPE_CHECKOUT_BRANDING.buttonColor,
        border_style: STRIPE_CHECKOUT_BRANDING.borderStyle,
        logo: {
          type: "file",
          file: STRIPE_CHECKOUT_BRANDING.logoFileId,
        },
        icon: {
          type: "file",
          file: STRIPE_CHECKOUT_BRANDING.iconFileId,
        },
      },
    })

    return session.url
  } catch (err) {
    console.error(
      "[stripe] checkout.sessions.create failed:",
      err instanceof Error ? err.message : err
    )
    return null
  }
}

export async function addToExistingSubscription(
  customerId: string,
  lineItems: StripeLineItem[]
): Promise<{ subscriptionId: string } | null> {
  const stripe = getStripe()
  if (!stripe || lineItems.length === 0) return null

  const subscription = await getActiveSubscription(stripe, customerId)
  if (!subscription) return null

  const existingByPrice = new Map<string, Stripe.SubscriptionItem>()
  for (const item of subscription.items.data) {
    if (item.price.id) {
      existingByPrice.set(item.price.id, item)
    }
  }

  for (const lineItem of lineItems) {
    const existing = existingByPrice.get(lineItem.price)
    if (existing) {
      await stripe.subscriptionItems.update(existing.id, {
        quantity: (existing.quantity ?? 0) + lineItem.quantity,
        proration_behavior: "create_prorations",
      })
    } else {
      await stripe.subscriptionItems.create({
        subscription: subscription.id,
        price: lineItem.price,
        quantity: lineItem.quantity,
        proration_behavior: "create_prorations",
      })
    }
  }

  return { subscriptionId: subscription.id }
}

export async function retrieveCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe()
  if (!stripe) return null

  try {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "total_details"],
    })
  } catch {
    return null
  }
}

export function getCheckoutDiscountCents(
  session: Stripe.Checkout.Session
): number {
  return session.total_details?.amount_discount ?? 0
}

export function getSubscriptionIdFromSession(
  session: Stripe.Checkout.Session
): string | null {
  if (typeof session.subscription === "string") {
    return session.subscription
  }
  return session.subscription?.id ?? null
}

type CreateOneTimeCheckoutInput = {
  customerId?: string | null
  customerEmail?: string | null
  amountCents: number
  productName: string
  moveInBookingId: string
  successUrl: string
  cancelUrl: string
}

export async function createOneTimeCheckout(
  input: CreateOneTimeCheckoutInput
): Promise<string | null> {
  const stripe = getStripe()
  if (!stripe || input.amountCents <= 0) return null

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...(input.customerId
        ? { customer: input.customerId }
        : input.customerEmail
          ? { customer_email: input.customerEmail }
          : {}),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: input.amountCents,
            product_data: {
              name: input.productName,
            },
          },
        },
      ],
      allow_promotion_codes: true,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      client_reference_id: input.moveInBookingId,
      metadata: {
        type: "move_in",
        move_in_booking_id: input.moveInBookingId,
      },
      branding_settings: {
        display_name: STRIPE_CHECKOUT_BRANDING.displayName,
        background_color: STRIPE_CHECKOUT_BRANDING.backgroundColor,
        button_color: STRIPE_CHECKOUT_BRANDING.buttonColor,
        border_style: STRIPE_CHECKOUT_BRANDING.borderStyle,
        logo: {
          type: "file",
          file: STRIPE_CHECKOUT_BRANDING.logoFileId,
        },
        icon: {
          type: "file",
          file: STRIPE_CHECKOUT_BRANDING.iconFileId,
        },
      },
    })

    return session.url
  } catch (err) {
    console.error(
      "[stripe] one-time checkout failed:",
      err instanceof Error ? err.message : err
    )
    return null
  }
}
