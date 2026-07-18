import { describe, expect, it } from "vitest"

import { buildUnitLabelCode, toOrderDisplayId } from "@/lib/ops/booking-units"

describe("booking unit label codes", () => {
  it("builds display id from booking uuid prefix", () => {
    expect(toOrderDisplayId("a1b2c3d4-eeee-ffff-aaaa-bbbbbbbbbbbb")).toBe(
      "A1B2C3D4"
    )
  })

  it("builds unit codes", () => {
    expect(buildUnitLabelCode("A1B2C3D4", 1)).toBe("S2U-A1B2C3D4-001")
    expect(buildUnitLabelCode("A1B2C3D4", 12)).toBe("S2U-A1B2C3D4-012")
  })
})
