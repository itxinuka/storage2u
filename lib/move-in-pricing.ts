/** One-time move-in service pricing (CAD). */

export const BASE_FEE = 99
export const FREE_ZONE_KM = 25
export const PER_KM_RATE = 1.5
export const MAX_AUTO_KM = 150
export const INCLUDED_ITEMS = 10
export const EXTRA_ITEM_FEE = 4

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
  | { overCap: true }

/**
 * Compute one-time move-in total from driving distance (km) and item count.
 * Rounds up to the nearest dollar.
 */
export function computeMoveInPrice(
  distanceKm: number,
  totalItemCount: number
): MoveInPriceResult {
  if (distanceKm > MAX_AUTO_KM) {
    return { overCap: true }
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
