export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      booking_items: {
        Row: {
          booking_id: string
          catalog_id: string
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["booking_item_kind"]
          name: string
          qty: number
          unit_price_cents: number
        }
        Insert: {
          booking_id: string
          catalog_id: string
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["booking_item_kind"]
          name: string
          qty: number
          unit_price_cents: number
        }
        Update: {
          booking_id?: string
          catalog_id?: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["booking_item_kind"]
          name?: string
          qty?: number
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          contact_phone: string | null
          created_at: string
          delivery_date: string | null
          id: string
          mode: Database["public"]["Enums"]["booking_mode"]
          monthly_total_cents: number
          notes: string | null
          pickup_address: string
          pickup_date: string | null
          profile_id: string
          residence: string | null
          status: Database["public"]["Enums"]["booking_status"]
          stripe_payment_id: string | null
          time_window: string | null
          university: string | null
        }
        Insert: {
          contact_phone?: string | null
          created_at?: string
          delivery_date?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["booking_mode"]
          monthly_total_cents?: number
          notes?: string | null
          pickup_address: string
          pickup_date?: string | null
          profile_id: string
          residence?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_id?: string | null
          time_window?: string | null
          university?: string | null
        }
        Update: {
          contact_phone?: string | null
          created_at?: string
          delivery_date?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["booking_mode"]
          monthly_total_cents?: number
          notes?: string | null
          pickup_address?: string
          pickup_date?: string | null
          profile_id?: string
          residence?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_id?: string | null
          time_window?: string | null
          university?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_requests: {
        Row: {
          booking_id: string
          created_at: string
          delivery_address: string
          id: string
          profile_id: string
          requested_date: string | null
          status: Database["public"]["Enums"]["delivery_request_status"]
        }
        Insert: {
          booking_id: string
          created_at?: string
          delivery_address: string
          id?: string
          profile_id: string
          requested_date?: string | null
          status?: Database["public"]["Enums"]["delivery_request_status"]
        }
        Update: {
          booking_id?: string
          created_at?: string
          delivery_address?: string
          id?: string
          profile_id?: string
          requested_date?: string | null
          status?: Database["public"]["Enums"]["delivery_request_status"]
        }
        Relationships: [
          {
            foreignKeyName: "delivery_requests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_requests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dispatch_assignments: {
        Row: {
          booking_id: string
          created_at: string
          delivery_request_id: string | null
          dispatch_status: Database["public"]["Enums"]["dispatch_status"]
          id: string
          scheduled_time: string | null
          shift_assignment_id: string | null
          stop_kind: Database["public"]["Enums"]["stop_kind"]
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          delivery_request_id?: string | null
          dispatch_status?: Database["public"]["Enums"]["dispatch_status"]
          id?: string
          scheduled_time?: string | null
          shift_assignment_id?: string | null
          stop_kind: Database["public"]["Enums"]["stop_kind"]
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          delivery_request_id?: string | null
          dispatch_status?: Database["public"]["Enums"]["dispatch_status"]
          id?: string
          scheduled_time?: string | null
          shift_assignment_id?: string | null
          stop_kind?: Database["public"]["Enums"]["stop_kind"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_assignments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_assignments_delivery_request_id_fkey"
            columns: ["delivery_request_id"]
            isOneToOne: false
            referencedRelation: "delivery_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_assignments_shift_assignment_id_fkey"
            columns: ["shift_assignment_id"]
            isOneToOne: false
            referencedRelation: "shift_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          clerk_user_id: string
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          university: string | null
        }
        Insert: {
          clerk_user_id: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          university?: string | null
        }
        Update: {
          clerk_user_id?: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          university?: string | null
        }
        Relationships: []
      }
      shift_assignments: {
        Row: {
          created_at: string
          id: string
          shift_id: string
          staff_id: string | null
          status: Database["public"]["Enums"]["shift_assignment_status"]
          stops_done: number
          stops_total: number
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          shift_id: string
          staff_id?: string | null
          status?: Database["public"]["Enums"]["shift_assignment_status"]
          stops_done?: number
          stops_total?: number
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          shift_id?: string
          staff_id?: string | null
          status?: Database["public"]["Enums"]["shift_assignment_status"]
          stops_done?: number
          stops_total?: number
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shift_assignments_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_assignments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          created_at: string
          hub: string
          id: string
          shift_date: string
        }
        Insert: {
          created_at?: string
          hub: string
          id?: string
          shift_date: string
        }
        Update: {
          created_at?: string
          hub?: string
          id?: string
          shift_date?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          active: boolean
          clerk_user_id: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["staff_role"]
        }
        Insert: {
          active?: boolean
          clerk_user_id?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
        }
        Update: {
          active?: boolean
          clerk_user_id?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["staff_role"]
        }
        Relationships: []
      }
      storage_holdings: {
        Row: {
          bay_code: string
          booking_id: string | null
          box_count: number
          created_at: string
          id: string
          item_count: number
          profile_id: string
          stored_since: string
          warehouse_id: string
        }
        Insert: {
          bay_code: string
          booking_id?: string | null
          box_count?: number
          created_at?: string
          id?: string
          item_count?: number
          profile_id: string
          stored_since?: string
          warehouse_id: string
        }
        Update: {
          bay_code?: string
          booking_id?: string | null
          box_count?: number
          created_at?: string
          id?: string
          item_count?: number
          profile_id?: string
          stored_since?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "storage_holdings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_holdings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_holdings_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouse_campuses: {
        Row: {
          campus_name: string
          created_at: string
          id: string
          warehouse_id: string
        }
        Insert: {
          campus_name: string
          created_at?: string
          id?: string
          warehouse_id: string
        }
        Update: {
          campus_name?: string
          created_at?: string
          id?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_campuses_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          box_count: number
          capacity_pct: number
          city: string
          created_at: string
          id: string
          name: string
          units_occupied: number
        }
        Insert: {
          box_count?: number
          capacity_pct?: number
          city?: string
          created_at?: string
          id?: string
          name: string
          units_occupied?: number
        }
        Update: {
          box_count?: number
          capacity_pct?: number
          city?: string
          created_at?: string
          id?: string
          name?: string
          units_occupied?: number
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          active: boolean
          created_at: string
          id: string
          label: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          label: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          label?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_item_kind: "box" | "item"
      booking_mode: "pickup" | "delivery"
      booking_status:
        | "scheduled"
        | "picked_up"
        | "in_storage"
        | "delivered"
        | "cancelled"
      delivery_request_status:
        | "pending"
        | "scheduled"
        | "in_transit"
        | "delivered"
        | "cancelled"
      dispatch_status: "scheduled" | "out" | "done"
      shift_assignment_status: "available" | "loading" | "on_route"
      staff_role: "driver" | "mover" | "dispatcher"
      stop_kind: "pickup" | "delivery"
    }
  }
}

export type Booking = Database["public"]["Tables"]["bookings"]["Row"]
export type BookingItem = Database["public"]["Tables"]["booking_items"]["Row"]
export type BookingWithItems = Booking & { booking_items: BookingItem[] }
