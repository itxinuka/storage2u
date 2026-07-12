import { TIME_WINDOWS } from "@/lib/booking-catalog"

export type TimeWindowId = (typeof TIME_WINDOWS)[number]["id"]

export type BookingBlock = {
  id: string
  blockDate: string
  timeWindowId: TimeWindowId | null
  reason: string | null
  createdAt: string
}

export type BookingBlockRow = {
  id: string
  block_date: string
  time_window_id: string | null
  reason: string | null
  created_at: string
}

const TIME_WINDOW_IDS = new Set<string>(TIME_WINDOWS.map((w) => w.id))

export function isTimeWindowId(value: string): value is TimeWindowId {
  return TIME_WINDOW_IDS.has(value)
}

export function timeWindowLabel(id: TimeWindowId): string {
  const window = TIME_WINDOWS.find((w) => w.id === id)
  return window ? `${window.label} (${window.hours})` : id
}

export function parseTimeWindowId(label: string): TimeWindowId | null {
  const match = TIME_WINDOWS.find(
    (w) => label === `${w.label} (${w.hours})` || label.startsWith(`${w.label} (`)
  )
  return match?.id ?? null
}

export function mapBookingBlockRow(row: BookingBlockRow): BookingBlock {
  return {
    id: row.id,
    blockDate: row.block_date,
    timeWindowId:
      row.time_window_id && isTimeWindowId(row.time_window_id)
        ? row.time_window_id
        : null,
    reason: row.reason,
    createdAt: row.created_at,
  }
}

export function blockScopeLabel(block: BookingBlock): string {
  if (!block.timeWindowId) return "Entire day"
  const window = TIME_WINDOWS.find((w) => w.id === block.timeWindowId)
  return window ? `${window.label} (${window.hours})` : block.timeWindowId
}

export function isDateFullyBlocked(date: string, blocks: BookingBlock[]): boolean {
  return blocks.some((b) => b.blockDate === date && b.timeWindowId === null)
}

export function isTimeWindowBlocked(
  date: string,
  windowId: TimeWindowId,
  blocks: BookingBlock[]
): boolean {
  if (isDateFullyBlocked(date, blocks)) return true
  return blocks.some((b) => b.blockDate === date && b.timeWindowId === windowId)
}

export function isTimeWindowLabelBlocked(
  date: string,
  label: string,
  blocks: BookingBlock[]
): boolean {
  const windowId = parseTimeWindowId(label)
  if (!windowId) return false
  return isTimeWindowBlocked(date, windowId, blocks)
}

export function getAvailableTimeWindowIds(
  date: string,
  blocks: BookingBlock[]
): TimeWindowId[] {
  return TIME_WINDOWS.map((w) => w.id).filter(
    (id) => !isTimeWindowBlocked(date, id, blocks)
  )
}

export function validateBookingSchedule(
  scheduledDate: string,
  timeWindow: string,
  blocks: BookingBlock[]
): string | null {
  if (!scheduledDate) return "Please pick a date and time window."
  if (isDateFullyBlocked(scheduledDate, blocks)) {
    return "That date is unavailable. Please choose another day."
  }

  const windowId = parseTimeWindowId(timeWindow)
  if (!windowId) return "Please pick a valid time window."
  if (isTimeWindowBlocked(scheduledDate, windowId, blocks)) {
    return "That time window is unavailable on the selected date."
  }

  return null
}
