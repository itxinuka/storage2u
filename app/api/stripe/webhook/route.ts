import { NextResponse } from "next/server"
import Stripe from "stripe"

import { finalizeBookingPayment } from "@/lib/stripe-booking"
import { getStripe, getSubscriptionIdFromSession } from "@/lib/stripe"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 }
    )
  }

  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId =
          session.metadata?.booking_id ?? session.client_reference_id ?? null
        const subscriptionId = getSubscriptionIdFromSession(session)
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null

        if (bookingId && subscriptionId && customerId) {
          await finalizeBookingPayment({
            bookingId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
          })
        }
        break
      }
      case "customer.subscription.deleted":
      case "invoice.payment_failed":
        break
      default:
        break
    }
  } catch (err) {
    console.error("[stripe/webhook]", event.type, err)
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
