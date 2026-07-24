import { describe, expect, it } from "vitest"

import {
  computeMoveInPrice,
  normalizeProvinceCode,
  provincesMatch,
} from "@/lib/move-in-pricing"

describe("normalizeProvinceCode", () => {
  it("maps NL aliases", () => {
    expect(normalizeProvinceCode("NL")).toBe("NL")
    expect(normalizeProvinceCode("nl")).toBe("NL")
    expect(normalizeProvinceCode("Newfoundland")).toBe("NL")
    expect(normalizeProvinceCode("Newfoundland and Labrador")).toBe("NL")
    expect(normalizeProvinceCode("Newfoundland & Labrador")).toBe("NL")
  })

  it("maps NS aliases", () => {
    expect(normalizeProvinceCode("NS")).toBe("NS")
    expect(normalizeProvinceCode("Nova Scotia")).toBe("NS")
    expect(normalizeProvinceCode("nova scotia")).toBe("NS")
  })

  it("returns null for unknown provinces", () => {
    expect(normalizeProvinceCode("ON")).toBeNull()
    expect(normalizeProvinceCode("Ontario")).toBeNull()
    expect(normalizeProvinceCode("")).toBeNull()
  })
})

describe("provincesMatch", () => {
  it("matches Nova Scotia aliases to NS campus", () => {
    expect(provincesMatch("Nova Scotia", "NS")).toBe(true)
    expect(provincesMatch("NS", "NS")).toBe(true)
  })

  it("rejects out-of-province homes", () => {
    expect(provincesMatch("ON", "NS")).toBe(false)
    expect(provincesMatch("NL", "NS")).toBe(false)
  })
})

describe("computeMoveInPrice", () => {
  it("includes up to 10 items in the base fee (10 items / 20 km → $99)", () => {
    const result = computeMoveInPrice(20, 10, "NL", "NL")
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
    const result = computeMoveInPrice(20, 14, "NL", "NL")
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
    const result = computeMoveInPrice(60, 14, "NS", "NS")
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

  it("returns overCap distance beyond max auto distance (151 km)", () => {
    expect(computeMoveInPrice(151, 10, "NL", "NL")).toEqual({
      overCap: true,
      overCapReason: "distance",
    })
  })

  it("returns overCap out_of_province even when under 150 km", () => {
    expect(computeMoveInPrice(20, 10, "ON", "NL")).toEqual({
      overCap: true,
      overCapReason: "out_of_province",
    })
    expect(computeMoveInPrice(20, 10, "NL", "NS")).toEqual({
      overCap: true,
      overCapReason: "out_of_province",
    })
  })

  it("accepts province aliases for in-province pricing", () => {
    const result = computeMoveInPrice(20, 10, "Nova Scotia", "NS")
    expect(result.overCap).toBe(false)
  })

  it("prefers out_of_province over distance when both would apply", () => {
    expect(computeMoveInPrice(200, 10, "ON", "NS")).toEqual({
      overCap: true,
      overCapReason: "out_of_province",
    })
  })
})
