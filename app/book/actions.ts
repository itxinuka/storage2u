"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import type { BookingMode } from "@/lib/booking-catalog"
import {
  computeSelectionTotals,
  selectionToLineItems,
} from "@/lib/booking-catalog"
import type { Database } from "@/lib/database.types"
import { finalizeBookingPayment } from "@/lib/stripe-booking"
import { bookingItemsToStripeLineItems } from "@/lib/stripe-prices"
import {
  addToExistingSubscription,
  createSubscriptionCheckout,
  getOrCreateCustomer,
  getStripe,
  getSubscriptionIdFromSession,
  retrieveCheckoutSession,
} from "@/lib/stripe"
import { createClient } from "@/lib/server"

type BookingItemKind = Database["public"]["Enums"]["booking_item_kind"]
type BookingModeDb = Database["public"]["Enums"]["booking_mode"]

export type CreateBookingInput = {
  mode: BookingMode
  selection: Record<string, number>
  university: string
  residence: string
  address: string
  phone: string
  scheduledDate: string
  timeWindow: string
  deliveryDate?: string | null
  notes?: string | null
}

export type CreateBookingResult =
  | { success: true; bookingId: string }
  | { success: false; error: string; code?: "auth" | "validation" }

export type CheckoutSessionResult =
  | { url: string }
  | { success: false; error: string; code?: "auth" | "validation" | "stripe" }

export type VerifyCheckoutResult =
  | { success: true; bookingId: string }
  | { success: false; error: string }

function toDbMode(mode: BookingMode): BookingModeDb {
  return mode
}

async function getOrigin(): Promise<string> {
  const headerList = await headers()
  const host = headerList.get("host")
  const proto = headerList.get("x-forwarded-proto") ?? "https"
  return headerList.get("origin") ?? (host ? `${proto}://${host}` : "")
}

export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, error: "Please sign in to complete your booking.", code: "auth" }
  }

  const user = await currentUser()
  const lineItems = selectionToLineItems(input.selection)
  const { total, count } = computeSelectionTotals(input.selection)

  if (count === 0) {
    return { success: false, error: "Add at least one box or item.", code: "validation" }
  }

  if (!input.university.trim() || !input.address.trim() || !input.phone.trim()) {
    return { success: false, error: "University, address, and phone are required.", code: "validation" }
  }

  if (!input.scheduledDate || !input.timeWindow) {
    return { success: false, error: "Please pick a date and time window.", code: "validation" }
  }

  const supabase = await createClient()

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || null
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    null

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        clerk_user_id: userId,
        email,
        full_name: fullName,
        phone: input.phone.trim(),
        university: input.university.trim(),
      },
      { onConflict: "clerk_user_id" }
    )
    .select("id")
    .single()

  if (profileError || !profile) {
    return {
      success: false,
      error: profileError?.message ?? "Could not create your profile.",
    }
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      profile_id: profile.id,
      mode: toDbMode(input.mode),
      pickup_address: input.address.trim(),
      pickup_date: input.scheduledDate,
      delivery_date: input.deliveryDate ?? null,
      university: input.university.trim(),
      residence: input.residence.trim() || null,
      contact_phone: input.phone.trim(),
      time_window: input.timeWindow,
      monthly_total_cents: total * 100,
      notes: input.notes?.trim() || null,
      status: "pending_payment",
    })
    .select("id")
    .single()

  if (bookingError || !booking) {
    return {
      success: false,
      error: bookingError?.message ?? "Could not save your booking.",
    }
  }

  const rows = lineItems.map((item) => ({
    booking_id: booking.id,
    catalog_id: item.catalog_id,
    name: item.name,
    kind: item.kind as BookingItemKind,
    qty: item.qty,
    unit_price_cents: item.unit_price_cents,
  }))

  const { error: itemsError } = await supabase.from("booking_items").insert(rows)

  if (itemsError) {
    await supabase.from("bookings").delete().eq("id", booking.id)
    return { success: false, error: itemsError.message }
  }

  revalidatePath("/dashboard")
  return { success: true, bookingId: booking.id }
}

export async function createCheckoutSession(
  bookingId: string
): Promise<CheckoutSessionResult> {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, error: "Please sign in to continue.", code: "auth" }
  }

  const stripe = getStripe()
  if (!stripe) {
    return {
      success: false,
      error: "Payments are not configured yet. Please try again later.",
      code: "stripe",
    }
  }

  const user = await currentUser()
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    null

  if (!email) {
    return { success: false, error: "No email on file for billing.", code: "validation" }
  }

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, stripe_customer_id")
    .eq("clerk_user_id", userId)
    .maybeSingle()

  if (!profile) {
    return { success: false, error: "We couldn't find your account.", code: "validation" }
  }

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, profile_id, status, booking_items(catalog_id, qty)")
    .eq("id", bookingId)
    .maybeSingle()

  if (!booking || booking.profile_id !== profile.id) {
    return { success: false, error: "We couldn't find that booking.", code: "validation" }
  }

  if (booking.status === "scheduled") {
    const origin = await getOrigin()
    return { url: `${origin}/book/complete?booking_id=${bookingId}` }
  }

  if (booking.status !== "pending_payment") {
    return { success: false, error: "This booking can't be paid.", code: "validation" }
  }

  let stripeLineItems
  try {
    stripeLineItems = bookingItemsToStripeLineItems(
      (booking.booking_items ?? []).map((item) => ({
        catalog_id: item.catalog_id,
        qty: item.qty,
      }))
    )
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Invalid booking items.",
      code: "validation",
    }
  }

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || null

  const customerId = await getOrCreateCustomer({
    email,
    name: fullName,
    clerkUserId: userId,
    existingStripeCustomerId: profile.stripe_customer_id,
  })

  if (!customerId) {
    return {
      success: false,
      error: "Could not set up billing. Please try again.",
      code: "stripe",
    }
  }

  if (!profile.stripe_customer_id) {
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", profile.id)
  }

  const hasActiveSubscription =
    (
      await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      })
    ).data.length > 0

  const origin = await getOrigin()

  if (hasActiveSubscription) {
    const result = await addToExistingSubscription(customerId, stripeLineItems)
    if (!result) {
      return {
        success: false,
        error: "Could not update your subscription. Please try again.",
        code: "stripe",
      }
    }

    await finalizeBookingPayment({
      bookingId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: result.subscriptionId,
    })

    revalidatePath("/dashboard")
    return { url: `${origin}/book/complete?booking_id=${bookingId}` }
  }

  const checkoutUrl = await createSubscriptionCheckout({
    customerId,
    lineItems: stripeLineItems,
    bookingId,
    successUrl: `${origin}/book/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/book?checkout=cancelled`,
  })

  if (!checkoutUrl) {
    return {
      success: false,
      error: "Could not start checkout. Please try again.",
      code: "stripe",
    }
  }

  return { url: checkoutUrl }
}

export async function verifyCheckoutSession(
  sessionId: string
): Promise<VerifyCheckoutResult> {
  const { userId } = await auth()
  if (!userId) {
    return { success: false, error: "Please sign in to view your booking." }
  }

  const session = await retrieveCheckoutSession(sessionId)
  if (!session) {
    return { success: false, error: "Could not verify payment." }
  }

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return { success: false, error: "Payment is not complete yet." }
  }

  const bookingId =
    session.metadata?.booking_id ?? session.client_reference_id ?? null
  const subscriptionId = getSubscriptionIdFromSession(session)
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null

  if (!bookingId || !subscriptionId || !customerId) {
    return { success: false, error: "Missing payment details." }
  }

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle()

  if (!profile) {
    return { success: false, error: "We couldn't find your account." }
  }

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, profile_id")
    .eq("id", bookingId)
    .maybeSingle()

  if (!booking || booking.profile_id !== profile.id) {
    return { success: false, error: "We couldn't find that booking." }
  }

  await finalizeBookingPayment({
    bookingId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
  })

  revalidatePath("/dashboard")
  return { success: true, bookingId }
}

export async function getBookingForConfirmation(bookingId: string) {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle()

  if (!profile) return null

  const { data: booking } = await supabase
    .from("bookings")
    .select("*, booking_items(*)")
    .eq("id", bookingId)
    .eq("profile_id", profile.id)
    .maybeSingle()

  return booking
}
