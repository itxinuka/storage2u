export type DispatchStopStatus = "scheduled" | "out" | "done"

export type ScheduleStopType = "pickup" | "delivery"

export type ShiftDriverStatus = "available" | "loading" | "on_route"

export type ScheduleStop = {
  id: string
  stopKey: string
  orderId: string
  time: string
  customer: string
  type: ScheduleStopType
  university: string
  address: string
  boxes: number
  driver: string | null
  driverAssignmentId: string | null
  dispatchAssignmentId: string | null
  status: DispatchStopStatus
}

export type ShiftDriver = {
  id: string
  staffId: string | null
  name: string
  van: string
  stops: number
  done: number
  status: ShiftDriverStatus
}

export type StaffRosterMember = {
  id: string
  name: string
  role: string
  phone: string | null
}

export type ScheduleStat = {
  key: string
  value: string
  sub: string
  icon: "calendar-check" | "truck" | "box" | "users"
}

export type UpcomingDay = {
  date: string
  dateLabel: string
  pickups: number
  deliveries: number
  boxes: number
}

export type SchedulePageData = {
  selectedDate: string
  dateLabel: string
  isPastDate: boolean
  isToday: boolean
  hub: string
  stats: ScheduleStat[]
  schedule: ScheduleStop[]
  drivers: ShiftDriver[]
  staffRoster: StaffRosterMember[]
  upcoming: UpcomingDay[]
}
