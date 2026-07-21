import type { Database } from "@/lib/database.types"

export { OPEN_DELIVERY_STATUSES } from "@/lib/delivery-statuses"

type DeliveryRequestStatus = Database["public"]["Enums"]["delivery_request_status"]

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]

export type DeliveryDisplay = {
  id: string
  kind: "return" | "pickup"
  status: DeliveryRequestStatus | "scheduled"
  requestedDate: string | null
  requestedDateLabel: string
  address: string
  university: string
  boxesLabel: string
  timeWindow: string | null
  createdAt: string
  createdAtLabel: string
  bookingId: string
}

export type AccountAddress = {
  address: string
  residence: string | null
  university: string | null
  phone: string | null
}
