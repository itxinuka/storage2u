import {
  computeSelectionTotals,
  getCatalogEntry,
  priceOf,
  selectionToLineItems,
  type SelectionMap,
} from "@/lib/booking-catalog"
import type { OpsOrderLineItem } from "@/lib/ops/orders-types"

const OPS_ITEM_POOL = ["fridge", "bike", "backpack"] as const

/** Map ops box/item counts to catalog selection. */
export function countsToSelection(boxes: number, items: number): SelectionMap {
  const selection: SelectionMap = {}

  if (boxes > 0) selection.large_box = boxes

  const itemCounts: Record<string, number> = {}
  for (let i = 0; i < items; i += 1) {
    const id = OPS_ITEM_POOL[i % OPS_ITEM_POOL.length]
    itemCounts[id] = (itemCounts[id] ?? 0) + 1
  }
  for (const [id, qty] of Object.entries(itemCounts)) {
    selection[id] = qty
  }

  return selection
}

export function estimateMonthlyFromCounts(boxes: number, items: number) {
  const selection = countsToSelection(boxes, items)
  return computeSelectionTotals(selection)
}

export function buildLineItemsFromCounts(
  boxes: number,
  items: number
): OpsOrderLineItem[] {
  const selection = countsToSelection(boxes, items)
  return selectionToLineItems(selection).map((row, index) => ({
    id: `temp-${index}`,
    kind: row.kind,
    label: row.name,
    qty: row.qty,
    unitPriceCents: row.unit_price_cents,
    subtotalCents: row.qty * row.unit_price_cents,
  }))
}

export function formatOpsLineEstimate(boxes: number, items: number) {
  const selection = countsToSelection(boxes, items)
  const entries = Object.entries(selection).filter(([, qty]) => qty > 0)

  return entries.map(([id, qty]) => {
    const entry = getCatalogEntry(id)
    const unit = priceOf(id)
    return {
      label: entry?.name ?? id,
      qty,
      unit,
      subtotal: qty * unit,
    }
  })
}
