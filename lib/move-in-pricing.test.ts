import { describe, expect, it } from "vitest"

import { computeMoveInPrice } from "@/lib/move-in-pricing"

describe("computeMoveInPrice", () => {
  it("includes up to 10 items in the base fee (10 items / 20 km → $99)", () => {
    const result = computeMoveInPrice(20, 10)
    expect(result).toEqual({
      overCap: false,
      baseFee: 99,
      itemCharge: 0,
      extraItemCount: 0,
      distanceCharge: 0,
      total: 99,
      billableKm: 0,
    })
  })

  it("charges $4 for each item beyond 10 (14 items / 20 km → $115)", () => {
    const result = computeMoveInPrice(20, 14)
    expect(result).toEqual({
      overCap: false,
      baseFee: 99,
      itemCharge: 16,
      extraItemCount: 4,
      distanceCharge: 0,
      total: 115,
      billableKm: 0,
    })
  })

  it("combines item and distance charges (14 items / 60 km → $168)", () => {
    const result = computeMoveInPrice(60, 14)
    expect(result).toEqual({
      overCap: false,
      baseFee: 99,
      itemCharge: 16,
      extraItemCount: 4,
      distanceCharge: 52.5,
      total: 168,
      billableKm: 35,
    })
  })

  it("returns overCap beyond max auto distance (151 km)", () => {
    expect(computeMoveInPrice(151, 10)).toEqual({ overCap: true })
  })
})
