/** One-time move-in service pricing (CAD). */

import type { MoveInServiceProvince } from "@/lib/move-in-campuses"

export const BASE_FEE = 99
export const FREE_ZONE_KM = 25
export const PER_KM_RATE = 1.5
export const MAX_AUTO_KM = 150
export const INCLUDED_ITEMS = 10
export const EXTRA_ITEM_FEE = 4

export type MoveInOverCapReason = "out_of_province" | "distance"

export type MoveInPriceResult =
  | {
      overCap: false
      baseFee: number
      itemCharge: number
      extraItemCount: number
      distanceCharge: number
      total: number
      billableKm: number
    }
  | { overCap: true; overCapReason: MoveInOverCapReason }

/**
 * Normalize free-text Canadian province input to a service-area code.
 * Returns null when the province is unrecognized or outside NL/NS.
 */
export function normalizeProvinceCode(
  input: string
): MoveInServiceProvince | null {
  const raw = input
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")

  if (!raw) return null

  if (
    raw === "nl" ||
    raw === "nfld" ||
    raw === "nfl" ||
    raw === "newfoundland" ||
    raw === "newfoundland and labrador" ||
    raw === "newfoundland & labrador"
  ) {
    return "NL"
  }

  if (raw === "ns" || raw === "nova scotia") {
    return "NS"
  }

  return null
}

export function provincesMatch(
  homeProvince: string,
  campusProvince: MoveInServiceProvince
): boolean {
  return normalizeProvinceCode(homeProvince) === campusProvince
}

/**
 * Compute one-time move-in total from driving distance (km) and item count.
 * Out-of-province homes and distances beyond MAX_AUTO_KM require a custom quote.
 * Rounds up to the nearest dollar.
 */
export function computeMoveInPrice(
  distanceKm: number,
  totalItemCount: number,
  homeProvince: string,
  campusProvince: MoveInServiceProvince
): MoveInPriceResult {
  if (!provincesMatch(homeProvince, campusProvince)) {
    return { overCap: true, overCapReason: "out_of_province" }
  }

  if (distanceKm > MAX_AUTO_KM) {
    return { overCap: true, overCapReason: "distance" }
  }

  const baseFee = BASE_FEE
  const extraItemCount = Math.max(0, totalItemCount - INCLUDED_ITEMS)
  const itemCharge = extraItemCount * EXTRA_ITEM_FEE
  const billableKm = Math.max(0, distanceKm - FREE_ZONE_KM)
  const distanceCharge = billableKm * PER_KM_RATE
  const total = Math.ceil(baseFee + itemCharge + distanceCharge)

  return {
    overCap: false,
    baseFee,
    itemCharge,
    extraItemCount,
    distanceCharge,
    total,
    billableKm,
  }
}
