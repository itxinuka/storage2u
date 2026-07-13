import { describe, expect, it } from "vitest"

import type { MoveInBooking } from "@/lib/database.types"
import { splitMoveInForDisplay } from "@/lib/move-in-display"

function makeBooking(
  overrides: Partial<MoveInBooking> & Pick<MoveInBooking, "id" | "status" | "move_in_date">
): MoveInBooking {
  return {
    base_fee_cents: 9900,
    campus_id: "dalhousie_studley",
    contact_email: "student@example.com",
    contact_name: "Test Student",
    contact_phone: null,
    created_at: "2026-07-13T00:00:00.000Z",
    distance_charge_cents: 0,
    distance_km: 20,
    home_address: {
      street: "123 Main St",
      city: "Halifax",
      province: "NS",
      postalCode: "B3H 1A1",
    },
    item_charge: 0,
    item_count: 5,
    items: { large_box: 5 },
    profile_id: "profile-1",
    stripe_session_id: null,
    total_cents: 9900,
    university_id: "dalhousie",
    updated_at: "2026-07-13T00:00:00.000Z",
    ...overrides,
  }
}

describe("splitMoveInForDisplay", () => {
  it("puts confirmed upcoming move-ins in active", () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 14)
    const moveInDate = futureDate.toISOString().slice(0, 10)

    const { activeMoveIns, pastMoveIns } = splitMoveInForDisplay([
      makeBooking({
        id: "active-1",
        status: "confirmed",
        move_in_date: moveInDate,
      }),
    ])

    expect(activeMoveIns).toHaveLength(1)
    expect(activeMoveIns[0]?.id).toBe("active-1")
    expect(activeMoveIns[0]?.title).toBe("Dalhousie University")
    expect(pastMoveIns).toHaveLength(0)
  })

  it("puts cancelled and past confirmed move-ins in past", () => {
    const { activeMoveIns, pastMoveIns } = splitMoveInForDisplay([
      makeBooking({
        id: "cancelled-1",
        status: "cancelled",
        move_in_date: "2026-08-01",
      }),
      makeBooking({
        id: "past-1",
        status: "confirmed",
        move_in_date: "2020-01-01",
      }),
    ])

    expect(activeMoveIns).toHaveLength(0)
    expect(pastMoveIns.map((o) => o.id)).toEqual(["cancelled-1", "past-1"])
  })

  it("keeps pending_payment in active", () => {
    const { activeMoveIns, pastMoveIns } = splitMoveInForDisplay([
      makeBooking({
        id: "pending-1",
        status: "pending_payment",
        move_in_date: "2020-01-01",
      }),
    ])

    expect(activeMoveIns).toHaveLength(1)
    expect(activeMoveIns[0]?.status).toBe("pending_payment")
    expect(pastMoveIns).toHaveLength(0)
  })
})
