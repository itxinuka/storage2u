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
import { bookingItemsToStripeLineItems, appendProtectionLineItem } from "@/lib/stripe-prices"
import {
  addToExistingSubscription,
  createSubscriptionCheckout,
  getOrCreateCustomer,
  getStripe,
} from "@/lib/stripe"
import { humanizeBookingError } from "@/lib/booking-action-errors"
import { monthlyTotalWithProtection } from "@/lib/protection-plan"
import { validateBookingSchedule, type BookingBlock } from "@/lib/booking-availability"
import { getBookingBlocks } from "@/lib/ops/availability-data"
import { ensureBookingUnits } from "@/lib/ops/booking-units"
import { createServiceRoleClient } from "@/lib/supabase/service"

type BookingItemKind = Database["public"]["Enums"]["booking_item_kind"]
type BookingModeDb = Database["public"]["Enums"]["booking_mode"]

export type CreateBookingInput = {
  mode: BookingMode
  selection: Record<string, number>
  university: string
  residence: string
  address: string
  fullName: string
  phone: string
  scheduledDate: string
  timeWindow: string
  deliveryDate?: string | null
  notes?: string | null
  protectionPlan?: boolean
}

export type CreateBookingResult =
  | { success: true; bookingId: string }
  | { success: false; error: string; code?: "auth" | "validation" }

export type CheckoutSessionResult =
  | { url: string }
  | { success: false; error: string; code?: "auth" | "validation" | "stripe" }

function toDbMode(mode: BookingMode): BookingModeDb {
  return mode
}

async function getOrigin(): Promise<string> {
  const headerList = await headers()
  const origin = headerList.get("origin")
  if (origin) return origin

  const host = headerList.get("host")
  const proto = headerList.get("x-forwarded-proto") ?? "https"
  if (host) return `${proto}://${host}`

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
  }

  return "http://localhost:3000"
}

/** Trusted server actions use service role after Clerk auth() gates access. */
function createBookingDb() {
  try {
    return createServiceRoleClient()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(message)
  }
}

type BookingIdentity = {
  userId: string
  email: string | null
  fullName: string | null
}

/** Prefer session claims so checkout doesn't depend on a Clerk Users API round-trip. */
async function resolveBookingIdentity(): Promise<BookingIdentity | null> {
  const { userId, sessionClaims } = await auth()
  if (!userId) return null

  const claims = sessionClaims as {
    email?: string
    first_name?: string
    last_name?: string
  } | null

  let email = claims?.email ?? null
  let fullName =
    [claims?.first_name, claims?.last_name].filter(Boolean).join(" ") || null

  if (!email) {
    try {
      const user = await currentUser()
      email =
        user?.primaryEmailAddress?.emailAddress ??
        user?.emailAddresses[0]?.emailAddress ??
        null
      fullName =
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") || fullName
    } catch {
      // currentUser lookup is best-effort; fall back to session claim values
    }
  }

  return { userId, email, fullName }
}

export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  try {
  const identity = await resolveBookingIdentity()
  if (!identity) {
    return { success: false, error: "Please sign in to complete your booking.", code: "auth" }
  }

  const { userId, email, fullName: clerkFullName } = identity
  const lineItems = selectionToLineItems(input.selection)
  const { total, count } = computeSelectionTotals(input.selection)
  const protectionPlan = Boolean(input.protectionPlan)
  const monthlyTotal = monthlyTotalWithProtection(total, protectionPlan)

  if (count === 0) {
    return { success: false, error: "Add at least one box or item.", code: "validation" }
  }

  const resolvedName = input.fullName.trim() || clerkFullName
  if (!resolvedName) {
    return { success: false, error: "Full name is required.", code: "validation" }
  }

  if (!input.university.trim() || !input.address.trim() || !input.phone.trim()) {
    return { success: false, error: "University, address, and phone are required.", code: "validation" }
  }

  if (!input.scheduledDate || !input.timeWindow) {
    return { success: false, error: "Please pick a date and time window.", code: "validation" }
  }

  let bookingBlocks: BookingBlock[] = []
  try {
    bookingBlocks = await getBookingBlocks(input.scheduledDate)
  } catch {
    bookingBlocks = []
  }

  const scheduleError = validateBookingSchedule(
    input.scheduledDate,
    input.timeWindow,
    bookingBlocks
  )
  if (scheduleError) {
    return { success: false, error: scheduleError, code: "validation" }
  }

  const supabase = createBookingDb()

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        clerk_user_id: userId,
        email,
        full_name: resolvedName,
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
      error: humanizeBookingError(
        profileError?.message,
        "Could not create your profile."
      ),
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
      monthly_total_cents: monthlyTotal * 100,
      protection_plan: protectionPlan,
      notes: input.notes?.trim() || null,
      status: "pending_payment",
    })
    .select("id")
    .single()

  if (bookingError || !booking) {
    return {
      success: false,
      error: humanizeBookingError(
        bookingError?.message,
        "Could not save your booking."
      ),
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

  const { data: insertedItems, error: itemsError } = await supabase
    .from("booking_items")
    .insert(rows)
    .select("id, name, qty")

  if (itemsError || !insertedItems) {
    await supabase.from("bookings").delete().eq("id", booking.id)
    return {
      success: false,
      error: humanizeBookingError(
        itemsError?.message,
        "Could not save your items."
      ),
    }
  }

  const unitsResult = await ensureBookingUnits(
    supabase,
    booking.id,
    insertedItems
  )
  if (unitsResult.error) {
    await supabase.from("bookings").delete().eq("id", booking.id)
    return {
      success: false,
      error: humanizeBookingError(
        unitsResult.error,
        "Could not create item labels."
      ),
    }
  }

  revalidatePath("/dashboard")
  return { success: true, bookingId: booking.id }
  } catch (err) {
    return {
      success: false,
      error: humanizeBookingError(
        err instanceof Error ? err.message : undefined,
        "Something went wrong saving your booking."
      ),
    }
  }
}

export type ConfirmSubscriptionBookingResult =
  | { success: true; bookingId: string }
  | { success: false; error: string; code?: "auth" | "validation" | "stripe" }

export async function confirmSubscriptionBooking(
  bookingId: string
): Promise<ConfirmSubscriptionBookingResult> {
  try {
    const identity = await resolveBookingIdentity()
    if (!identity) {
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

    const { userId } = identity
    const supabase = createBookingDb()

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, stripe_customer_id")
      .eq("clerk_user_id", userId)
      .maybeSingle()

    if (!profile?.stripe_customer_id) {
      return { success: false, error: "We couldn't find your billing account.", code: "validation" }
    }

    const { data: booking } = await supabase
      .from("bookings")
      .select("id, profile_id, status, protection_plan, booking_items(catalog_id, qty)")
      .eq("id", bookingId)
      .maybeSingle()

    if (!booking || booking.profile_id !== profile.id) {
      return { success: false, error: "We couldn't find that booking.", code: "validation" }
    }

    if (booking.status === "scheduled") {
      return { success: true, bookingId }
    }

    if (booking.status !== "pending_payment") {
      return { success: false, error: "This booking can't be paid.", code: "validation" }
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: "active",
      limit: 1,
    })
    if (subscriptions.data.length === 0) {
      return {
        success: false,
        error: "No active subscription found. Please restart checkout.",
        code: "validation",
      }
    }

    let stripeLineItems
    try {
      stripeLineItems = await appendProtectionLineItem(
        await bookingItemsToStripeLineItems(
          (booking.booking_items ?? []).map((item) => ({
            catalog_id: item.catalog_id,
            qty: item.qty,
          }))
        ),
        booking.protection_plan
      )
    } catch (err) {
      return {
        success: false,
        error: humanizeBookingError(
          err instanceof Error ? err.message : undefined,
          "Invalid booking items."
        ),
        code: "validation",
      }
    }

    const result = await addToExistingSubscription(
      profile.stripe_customer_id,
      stripeLineItems
    )
    if (!result) {
      return {
        success: false,
        error: "Could not update your subscription. Please try again.",
        code: "stripe",
      }
    }

    const finalized = await finalizeBookingPayment({
      bookingId,
      stripeCustomerId: profile.stripe_customer_id,
      stripeSubscriptionId: result.subscriptionId,
    })

    if (!finalized) {
      return {
        success: false,
        error:
          "Your subscription was updated, but we couldn't confirm your booking. Please contact hello@storage2u.ca.",
        code: "stripe",
      }
    }

    revalidatePath("/dashboard")
    return { success: true, bookingId }
  } catch (err) {
    return {
      success: false,
      error: humanizeBookingError(
        err instanceof Error ? err.message : undefined,
        "Could not confirm your booking. Please try again."
      ),
      code: "stripe",
    }
  }
}

export async function createCheckoutSession(
  bookingId: string
): Promise<CheckoutSessionResult> {
  try {
  const identity = await resolveBookingIdentity()
  if (!identity) {
    return { success: false, error: "Please sign in to continue.", code: "auth" }
  }

  const { userId, email, fullName: clerkFullName } = identity

  const stripe = getStripe()
  if (!stripe) {
    return {
      success: false,
      error: "Payments are not configured yet. Please try again later.",
      code: "stripe",
    }
  }

  const supabase = createBookingDb()

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, stripe_customer_id, email, full_name")
    .eq("clerk_user_id", userId)
    .maybeSingle()

  if (!profile) {
    return { success: false, error: "We couldn't find your account.", code: "validation" }
  }

  const billingEmail = email ?? profile.email
  if (!billingEmail) {
    return { success: false, error: "No email on file for billing.", code: "validation" }
  }

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, profile_id, status, protection_plan, booking_items(catalog_id, qty)")
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
    stripeLineItems = await appendProtectionLineItem(
      await bookingItemsToStripeLineItems(
        (booking.booking_items ?? []).map((item) => ({
          catalog_id: item.catalog_id,
          qty: item.qty,
        }))
      ),
      booking.protection_plan
    )
  } catch (err) {
    return {
      success: false,
      error: humanizeBookingError(
        err instanceof Error ? err.message : undefined,
        "Invalid booking items."
      ),
      code: "validation",
    }
  }

  const customerId = await getOrCreateCustomer({
    email: billingEmail,
    name: profile.full_name?.trim() || clerkFullName,
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
  } else if (profile.stripe_customer_id !== customerId) {
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", profile.id)
  }

  let hasActiveSubscription = false
  try {
    hasActiveSubscription =
      (
        await stripe.subscriptions.list({
          customer: customerId,
          status: "active",
          limit: 1,
        })
      ).data.length > 0
  } catch {
    return {
      success: false,
      error: "Could not verify your billing account. Please try again.",
      code: "stripe",
    }
  }

  const origin = await getOrigin()

  if (hasActiveSubscription) {
    return { url: `${origin}/book/confirm-payment?booking_id=${bookingId}` }
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
  } catch (err) {
    return {
      success: false,
      error: humanizeBookingError(
        err instanceof Error ? err.message : undefined,
        "Could not start checkout. Please try again."
      ),
      code: "stripe",
    }
  }
}
