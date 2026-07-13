"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { headers } from "next/headers"

import {
  computeSelectionTotals,
  formatSelectionCounts,
  type SelectionMap,
} from "@/lib/booking-catalog"
import type { Json } from "@/lib/database.types"
import { sendMoveInQuoteRequestEmail } from "@/lib/email"
import {
  getCampusById,
  getUniversityById,
} from "@/lib/move-in-campuses"
import { computeMoveInPrice } from "@/lib/move-in-pricing"
import {
  formatHomeAddress,
  quoteDrivingDistanceKm,
  type HomeAddress,
} from "@/lib/mapbox"
import { createOneTimeCheckout, getOrCreateCustomer, retrieveCheckoutSession } from "@/lib/stripe"
import { finalizeMoveInPayment } from "@/lib/stripe-move-in-booking"
import { createServiceRoleClient } from "@/lib/supabase/service"

export type MoveInQuoteInput = {
  universityId: string
  campusId: string
  homeAddress: HomeAddress
  moveInDate: string
  selection: SelectionMap
  contactName?: string
  contactEmail?: string
  contactPhone?: string
}

export type MoveInQuoteResult =
  | {
      success: true
      overCap: false
      bookingId: string
      distanceKm: number
      baseFee: number
      itemCharge: number
      extraItemCount: number
      itemCount: number
      distanceCharge: number
      total: number
      billableKm: number
    }
  | { success: true; overCap: true; distanceKm: number }
  | { success: false; error: string; code?: "validation" | "address" }

export type MoveInQuoteRequestInput = MoveInQuoteInput & {
  name: string
  email: string
  phone: string
  distanceKm?: number | null
}

export type MoveInCheckoutResult =
  | { url: string }
  | { success: false; error: string; code?: "auth" | "validation" | "stripe" | "address" }

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

function validateHomeAddress(address: HomeAddress): string | null {
  if (!address.street.trim()) return "Street address is required."
  if (!address.city.trim()) return "City is required."
  if (!address.province.trim()) return "Province is required."
  if (!address.postalCode.trim()) return "Postal code is required."
  return null
}

function selectionToJson(selection: SelectionMap): Json {
  return selection as Json
}

type RevalidateQuoteResult =
  | { error: string }
  | { addressError: string }
  | {
      campus: NonNullable<ReturnType<typeof getCampusById>>
      university: NonNullable<ReturnType<typeof getUniversityById>>
      distanceKm: number
      itemCount: number
      price: ReturnType<typeof computeMoveInPrice>
    }

async function revalidateMoveInQuote(
  input: MoveInQuoteInput
): Promise<RevalidateQuoteResult> {
  const campus = getCampusById(input.campusId)
  const university = getUniversityById(input.universityId)

  if (!campus || !university || campus.universityId !== input.universityId) {
    return { error: "Invalid university or campus." }
  }

  const addressError = validateHomeAddress(input.homeAddress)
  if (addressError) {
    return { error: addressError }
  }

  if (!input.moveInDate) {
    return { error: "Move-in date is required." }
  }

  const { count } = computeSelectionTotals(input.selection)
  if (count === 0) {
    return { error: "Add at least one item." }
  }

  const distanceResult = await quoteDrivingDistanceKm(input.homeAddress, campus)
  if (!distanceResult.success) {
    return {
      addressError:
        "We couldn't verify that address. Please check it and try again.",
    }
  }

  const price = computeMoveInPrice(distanceResult.distanceKm, count)
  return {
    campus,
    university,
    distanceKm: distanceResult.distanceKm,
    itemCount: count,
    price,
  }
}

export async function calculateMoveInQuote(
  input: MoveInQuoteInput
): Promise<MoveInQuoteResult> {
  const validated = await revalidateMoveInQuote(input)
  if ("error" in validated) {
    return { success: false, error: validated.error, code: "validation" }
  }
  if ("addressError" in validated) {
    return { success: false, error: validated.addressError, code: "address" }
  }

  const { campus, university, distanceKm, itemCount, price } = validated

  if (price.overCap) {
    return { success: true, overCap: true, distanceKm }
  }

  const supabase = createServiceRoleClient()

  const { data: booking, error } = await supabase
    .from("move_in_bookings")
    .insert({
      university_id: university.id,
      campus_id: campus.id,
      home_address: input.homeAddress as Json,
      distance_km: Math.round(distanceKm * 100) / 100,
      base_fee_cents: price.baseFee * 100,
      item_count: itemCount,
      item_charge: price.itemCharge,
      distance_charge_cents: Math.round(price.distanceCharge * 100),
      total_cents: price.total * 100,
      move_in_date: input.moveInDate,
      items: selectionToJson(input.selection),
      contact_name: input.contactName?.trim() || null,
      contact_email: input.contactEmail?.trim() || null,
      contact_phone: input.contactPhone?.trim() || null,
      status: "pending_payment",
    })
    .select("id")
    .single()

  if (error || !booking) {
    console.error("[move-in] quote insert failed:", error?.message)
    return {
      success: false,
      error: "Could not save your quote. Please try again.",
    }
  }

  return {
    success: true,
    overCap: false,
    bookingId: booking.id,
    distanceKm,
    baseFee: price.baseFee,
    itemCharge: price.itemCharge,
    extraItemCount: price.extraItemCount,
    itemCount,
    distanceCharge: price.distanceCharge,
    total: price.total,
    billableKm: price.billableKm,
  }
}

export async function submitMoveInQuoteRequest(
  input: MoveInQuoteRequestInput
): Promise<{ success: true } | { success: false; error: string }> {
  const campus = getCampusById(input.campusId)
  const university = getUniversityById(input.universityId)

  if (!campus || !university || campus.universityId !== input.universityId) {
    return { success: false, error: "Invalid university or campus." }
  }

  const addressError = validateHomeAddress(input.homeAddress)
  if (addressError) {
    return { success: false, error: addressError }
  }

  if (!input.name.trim() || !input.email.trim() || !input.phone.trim()) {
    return { success: false, error: "Name, email, and phone are required." }
  }

  const { count } = computeSelectionTotals(input.selection)
  if (count === 0) {
    return { success: false, error: "Add at least one item." }
  }

  let distanceKm = input.distanceKm ?? null
  if (distanceKm == null) {
    const distanceResult = await quoteDrivingDistanceKm(input.homeAddress, campus)
    if (distanceResult.success) {
      distanceKm = distanceResult.distanceKm
    }
  }

  const supabase = createServiceRoleClient()
  const { error } = await supabase.from("move_in_quote_requests").insert({
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    university_id: university.id,
    campus_id: campus.id,
    home_address: input.homeAddress as Json,
    distance_km: distanceKm != null ? Math.round(distanceKm * 100) / 100 : null,
    move_in_date: input.moveInDate,
    items: selectionToJson(input.selection),
  })

  if (error) {
    console.error("[move-in] quote request insert failed:", error.message)
    return { success: false, error: "Could not submit your request. Please try again." }
  }

  await sendMoveInQuoteRequestEmail({
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    universityName: university.name,
    campusName: campus.name,
    homeAddress: formatHomeAddress(input.homeAddress),
    moveInDate: input.moveInDate,
    itemsSummary: formatSelectionCounts(input.selection),
    distanceKm,
  })

  return { success: true }
}

export async function createMoveInCheckout(
  bookingId: string
): Promise<MoveInCheckoutResult> {
  const { userId } = await auth()
  if (!userId) {
    return {
      success: false,
      error: "Please sign in to complete checkout.",
      code: "auth",
    }
  }

  const supabase = createServiceRoleClient()

  const { data: booking, error: fetchError } = await supabase
    .from("move_in_bookings")
    .select("*")
    .eq("id", bookingId)
    .maybeSingle()

  if (fetchError || !booking) {
    return { success: false, error: "Booking not found.", code: "validation" }
  }

  if (booking.status !== "pending_payment") {
    return { success: false, error: "This booking is no longer payable.", code: "validation" }
  }

  const campus = getCampusById(booking.campus_id)
  if (!campus) {
    return { success: false, error: "Invalid campus on booking.", code: "validation" }
  }

  const homeAddress = booking.home_address as HomeAddress
  const selection = booking.items as SelectionMap

  const validated = await revalidateMoveInQuote({
    universityId: booking.university_id,
    campusId: booking.campus_id,
    homeAddress,
    moveInDate: booking.move_in_date,
    selection,
  })

  if ("error" in validated) {
    return { success: false, error: validated.error, code: "validation" }
  }
  if ("addressError" in validated) {
    return { success: false, error: validated.addressError, code: "address" }
  }

  const { price, itemCount } = validated
  if (price.overCap) {
    return {
      success: false,
      error: "This address requires a custom quote and cannot be checked out online.",
      code: "validation",
    }
  }

  const expectedTotalCents = price.total * 100
  if (
    booking.total_cents !== expectedTotalCents ||
    booking.item_count !== itemCount ||
    Number(booking.item_charge) !== price.itemCharge
  ) {
    await supabase
      .from("move_in_bookings")
      .update({
        distance_km: Math.round(validated.distanceKm * 100) / 100,
        base_fee_cents: price.baseFee * 100,
        item_count: itemCount,
        item_charge: price.itemCharge,
        distance_charge_cents: Math.round(price.distanceCharge * 100),
        total_cents: expectedTotalCents,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)
  }

  const user = await currentUser()
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses[0]?.emailAddress ??
    booking.contact_email

  if (!email) {
    return { success: false, error: "Email is required for checkout.", code: "validation" }
  }

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    booking.contact_name ||
    null

  const { data: profile } = await supabase
    .from("profiles")
    .upsert(
      {
        clerk_user_id: userId,
        email,
        full_name: fullName,
        phone: booking.contact_phone,
      },
      { onConflict: "clerk_user_id" }
    )
    .select("id, stripe_customer_id")
    .single()

  if (!profile) {
    return { success: false, error: "Could not create your profile.", code: "validation" }
  }

  await supabase
    .from("move_in_bookings")
    .update({
      profile_id: profile.id,
      contact_name: fullName,
      contact_email: email,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId)

  const customerId = await getOrCreateCustomer({
    email,
    name: fullName,
    clerkUserId: userId,
    existingStripeCustomerId: profile.stripe_customer_id,
  })

  const origin = await getOrigin()
  const checkoutUrl = await createOneTimeCheckout({
    customerId,
    customerEmail: customerId ? null : email,
    amountCents: expectedTotalCents,
    productName: "University move-in service",
    moveInBookingId: bookingId,
    successUrl: `${origin}/book/move-in/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${origin}/book?mode=delivery&checkout=cancelled`,
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

export async function verifyMoveInCheckoutSession(sessionId: string) {
  const session = await retrieveCheckoutSession(sessionId)
  if (!session || session.payment_status !== "paid") {
    return { success: false as const, error: "Payment was not completed." }
  }

  if (session.metadata?.type !== "move_in") {
    return { success: false as const, error: "Invalid checkout session." }
  }

  const bookingId =
    session.metadata.move_in_booking_id ?? session.client_reference_id ?? null

  if (!bookingId) {
    return { success: false as const, error: "Booking not found for this payment." }
  }

  const { userId } = await auth()
  let profileId: string | null = null

  if (userId) {
    const supabase = createServiceRoleClient()
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("clerk_user_id", userId)
      .maybeSingle()
    profileId = profile?.id ?? null
  }

  const finalized = await finalizeMoveInPayment({
    moveInBookingId: bookingId,
    stripeSessionId: session.id,
    profileId,
  })

  if (!finalized) {
    return { success: false as const, error: "Could not confirm your booking." }
  }

  return { success: true as const, bookingId }
}
