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
      booking_units: {
        Row: {
          booking_id: string
          booking_item_id: string | null
          code: string
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["booking_unit_kind"]
          label_name: string
          pickup_status: Database["public"]["Enums"]["booking_unit_pickup_status"]
          unit_index: number
        }
        Insert: {
          booking_id: string
          booking_item_id?: string | null
          code: string
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["booking_unit_kind"]
          label_name: string
          pickup_status?: Database["public"]["Enums"]["booking_unit_pickup_status"]
          unit_index: number
        }
        Update: {
          booking_id?: string
          booking_item_id?: string | null
          code?: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["booking_unit_kind"]
          label_name?: string
          pickup_status?: Database["public"]["Enums"]["booking_unit_pickup_status"]
          unit_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_units_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_units_booking_item_id_fkey"
            columns: ["booking_item_id"]
            isOneToOne: false
            referencedRelation: "booking_items"
            referencedColumns: ["id"]
          },
        ]
      }
      pickup_sessions: {
        Row: {
          added_count: number
          billing_note: string | null
          booking_id: string
          completed_at: string | null
          created_at: string
          created_by_clerk_id: string | null
          expected_count: number
          id: string
          missing_count: number
          scanned_count: number
          shortfall_acknowledged: boolean
          signature_data_url: string | null
          signed_at: string | null
          signer_name: string | null
          staff_id: string | null
          status: Database["public"]["Enums"]["pickup_session_status"]
          variance_notes: string | null
        }
        Insert: {
          added_count?: number
          billing_note?: string | null
          booking_id: string
          completed_at?: string | null
          created_at?: string
          created_by_clerk_id?: string | null
          expected_count?: number
          id?: string
          missing_count?: number
          scanned_count?: number
          shortfall_acknowledged?: boolean
          signature_data_url?: string | null
          signed_at?: string | null
          signer_name?: string | null
          staff_id?: string | null
          status?: Database["public"]["Enums"]["pickup_session_status"]
          variance_notes?: string | null
        }
        Update: {
          added_count?: number
          billing_note?: string | null
          booking_id?: string
          completed_at?: string | null
          created_at?: string
          created_by_clerk_id?: string | null
          expected_count?: number
          id?: string
          missing_count?: number
          scanned_count?: number
          shortfall_acknowledged?: boolean
          signature_data_url?: string | null
          signed_at?: string | null
          signer_name?: string | null
          staff_id?: string | null
          status?: Database["public"]["Enums"]["pickup_session_status"]
          variance_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pickup_sessions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickup_sessions_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      pickup_unit_scans: {
        Row: {
          booking_unit_id: string
          id: string
          scanned_at: string
          session_id: string
          source: Database["public"]["Enums"]["pickup_scan_source"]
        }
        Insert: {
          booking_unit_id: string
          id?: string
          scanned_at?: string
          session_id: string
          source?: Database["public"]["Enums"]["pickup_scan_source"]
        }
        Update: {
          booking_unit_id?: string
          id?: string
          scanned_at?: string
          session_id?: string
          source?: Database["public"]["Enums"]["pickup_scan_source"]
        }
        Relationships: [
          {
            foreignKeyName: "pickup_unit_scans_booking_unit_id_fkey"
            columns: ["booking_unit_id"]
            isOneToOne: false
            referencedRelation: "booking_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickup_unit_scans_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "pickup_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_blocks: {
        Row: {
          block_date: string
          created_at: string
          created_by: string | null
          id: string
          reason: string | null
          time_window_id: string | null
        }
        Insert: {
          block_date: string
          created_at?: string
          created_by?: string | null
          id?: string
          reason?: string | null
          time_window_id?: string | null
        }
        Update: {
          block_date?: string
          created_at?: string
          created_by?: string | null
          id?: string
          reason?: string | null
          time_window_id?: string | null
        }
        Relationships: []
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
          protection_plan: boolean
          residence: string | null
          status: Database["public"]["Enums"]["booking_status"]
          stripe_payment_id: string | null
          stripe_subscription_id: string | null
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
          protection_plan?: boolean
          residence?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_id?: string | null
          stripe_subscription_id?: string | null
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
          protection_plan?: boolean
          residence?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_id?: string | null
          stripe_subscription_id?: string | null
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
      move_in_bookings: {
        Row: {
          base_fee_cents: number
          campus_id: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          distance_charge_cents: number
          distance_km: number
          home_address: Json
          id: string
          item_charge: number
          item_count: number
          items: Json
          move_in_date: string
          profile_id: string | null
          status: Database["public"]["Enums"]["move_in_booking_status"]
          stripe_session_id: string | null
          total_cents: number
          university_id: string
          updated_at: string
        }
        Insert: {
          base_fee_cents: number
          campus_id: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          distance_charge_cents: number
          distance_km: number
          home_address: Json
          id?: string
          item_charge?: number
          item_count?: number
          items?: Json
          move_in_date: string
          profile_id?: string | null
          status?: Database["public"]["Enums"]["move_in_booking_status"]
          stripe_session_id?: string | null
          total_cents: number
          university_id: string
          updated_at?: string
        }
        Update: {
          base_fee_cents?: number
          campus_id?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          distance_charge_cents?: number
          distance_km?: number
          home_address?: Json
          id?: string
          item_charge?: number
          item_count?: number
          items?: Json
          move_in_date?: string
          profile_id?: string | null
          status?: Database["public"]["Enums"]["move_in_booking_status"]
          stripe_session_id?: string | null
          total_cents?: number
          university_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "move_in_bookings_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      move_in_quote_requests: {
        Row: {
          campus_id: string
          created_at: string
          distance_km: number | null
          email: string
          home_address: Json
          id: string
          items: Json
          move_in_date: string
          name: string
          phone: string
          university_id: string
        }
        Insert: {
          campus_id: string
          created_at?: string
          distance_km?: number | null
          email: string
          home_address: Json
          id?: string
          items?: Json
          move_in_date: string
          name: string
          phone: string
          university_id: string
        }
        Update: {
          campus_id?: string
          created_at?: string
          distance_km?: number | null
          email?: string
          home_address?: Json
          id?: string
          items?: Json
          move_in_date?: string
          name?: string
          phone?: string
          university_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          clerk_user_id: string
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          stripe_customer_id: string | null
          university: string | null
        }
        Insert: {
          clerk_user_id: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          stripe_customer_id?: string | null
          university?: string | null
        }
        Update: {
          clerk_user_id?: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          stripe_customer_id?: string | null
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
      booking_unit_kind: "order" | "unit"
      booking_mode: "pickup" | "delivery"
      booking_status:
        | "pending_payment"
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
      move_in_booking_status: "pending_payment" | "confirmed" | "cancelled"
      dispatch_status: "scheduled" | "out" | "done"
      shift_assignment_status: "available" | "loading" | "on_route"
      staff_role: "driver" | "mover" | "dispatcher"
      stop_kind: "pickup" | "delivery"
      pickup_session_status: "in_progress" | "completed" | "cancelled"
      booking_unit_pickup_status: "expected" | "scanned" | "missing" | "added"
      pickup_scan_source: "scan" | "manual_add"
    }
  }
}

export type Booking = Database["public"]["Tables"]["bookings"]["Row"]
export type BookingItem = Database["public"]["Tables"]["booking_items"]["Row"]
export type BookingUnit = Database["public"]["Tables"]["booking_units"]["Row"]
export type BookingWithItems = Booking & { booking_items: BookingItem[] }
export type MoveInBooking = Database["public"]["Tables"]["move_in_bookings"]["Row"]
export type MoveInQuoteRequest =
  Database["public"]["Tables"]["move_in_quote_requests"]["Row"]
