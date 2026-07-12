import { siteContent } from "@/lib/site-content"

export type BookingMode = "pickup" | "delivery"

export type CatalogEntry = {
  id: string
  name: string
  price: number
  kind: "box" | "item"
  dims?: string
  blurb?: string
  icon?: string
  note?: string
  tag?: boolean
}

/** Boxes shown in booking — medium & large only (matches prototype). */
export const BOOKING_BOXES = siteContent.boxes.filter((b) => b.id !== "small")

export const BOOKING_ITEMS = siteContent.items

export const BOOKING_CATALOG: CatalogEntry[] = [
  ...BOOKING_BOXES.map((b) => ({ ...b, kind: "box" as const })),
  ...BOOKING_ITEMS.map((i) => ({ ...i, kind: "item" as const })),
]

export const RESIDENCES = [
  "On-campus residence",
  "Off-campus apartment",
  "Shared house",
  "Other",
] as const

export const TIME_WINDOWS = [
  { id: "morning", label: "Morning", hours: "8–11 AM" },
  { id: "afternoon", label: "Afternoon", hours: "12–4 PM" },
  { id: "evening", label: "Evening", hours: "5–8 PM" },
] as const

export type SelectionMap = Record<string, number>

export function getCatalogEntry(id: string): CatalogEntry | undefined {
  return BOOKING_CATALOG.find((x) => x.id === id)
}

export function priceOf(id: string): number {
  return getCatalogEntry(id)?.price ?? 0
}

export function computeSelectionTotals(selection: SelectionMap) {
  const entries = Object.entries(selection).filter(([, qty]) => qty > 0)
  const total = entries.reduce((sum, [id, qty]) => sum + priceOf(id) * qty, 0)
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0)
  const boxCount = entries.reduce((sum, [id, qty]) => {
    const entry = getCatalogEntry(id)
    return entry?.kind === "box" ? sum + qty : sum
  }, 0)
  const itemCount = count - boxCount
  return { total, count, boxCount, itemCount }
}

export function selectionToLineItems(selection: SelectionMap) {
  return Object.entries(selection)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const entry = getCatalogEntry(id)
      if (!entry) return null
      return {
        catalog_id: id,
        name: entry.name,
        kind: entry.kind,
        qty,
        unit_price_cents: entry.price * 100,
      }
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
}

export const BOOKING_MODES = {
  pickup: {
    steps: ["Items", "Pickup", "Schedule", "Review"],
    s1Title: "What are you storing?",
    s1Sub:
      "Add boxes and any bigger items. We'll do a final count at pickup — you only pay for what you store.",
    s1Note:
      "Storing something else — surfboard, instrument, monitor? Add a note at pickup and we'll price it on the spot.",
    s2Title: "Where should we pick up?",
    s2Sub:
      "We'll come straight to your door on pickup day — no hauling across campus.",
    addrLabel: "Room / unit & address",
    s3Title: "Pick a pickup date & time",
    s3Sub:
      "Choose a day and a one-hour-ish window. You can reschedule any time before pickup.",
    schedLabel: "Time window",
    reviewSub: "Quick once-over before we confirm your pickup.",
    storeLabel: "Storing",
    whereLabel: "Pickup from",
    whenLabel: "Pickup",
    showPlanned: true,
    summaryTitle: "Your pickup",
    payCta: "Pay & book pickup",
    confTitle: "You're all booked!",
    confVerb: "Our team will be at",
  },
  delivery: {
    steps: ["Items", "Deliver to", "Move-in day", "Review"],
    s1Title: "What should we deliver?",
    s1Sub:
      "Your stored boxes plus anything shipped ahead — we'll bring it to your new room on move-in day.",
    s1Note:
      "Shipping something ahead — surfboard, instrument, monitor? Add a note and we'll handle it on move-in day.",
    s2Title: "Where's your new place?",
    s2Sub: "We'll deliver straight to your dorm or apartment on move-in day.",
    addrLabel: "New room / unit & address",
    s3Title: "Pick your move-in day",
    s3Sub:
      "Choose the day you're arriving and an arrival window. Reschedule any time before then.",
    schedLabel: "Arrival window",
    reviewSub: "Quick once-over before we confirm your move-in delivery.",
    storeLabel: "Delivering",
    whereLabel: "Deliver to",
    whenLabel: "Move-in day",
    showPlanned: false,
    summaryTitle: "Your move-in",
    payCta: "Pay & book delivery",
    confTitle: "Move-in booked!",
    confVerb: "We'll deliver everything to",
  },
} as const
