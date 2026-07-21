-- Field pickup scan sessions, unit scans, and per-unit pickup status.

CREATE TYPE public.pickup_session_status AS ENUM (
  'in_progress',
  'completed',
  'cancelled'
);

CREATE TYPE public.booking_unit_pickup_status AS ENUM (
  'expected',
  'scanned',
  'missing',
  'added'
);

CREATE TYPE public.pickup_scan_source AS ENUM (
  'scan',
  'manual_add'
);

ALTER TABLE public.booking_units
  ADD COLUMN IF NOT EXISTS pickup_status public.booking_unit_pickup_status
    NOT NULL DEFAULT 'expected';

CREATE TABLE IF NOT EXISTS public.pickup_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES public.staff(id) ON DELETE SET NULL,
  created_by_clerk_id text,
  status public.pickup_session_status NOT NULL DEFAULT 'in_progress',
  expected_count integer NOT NULL DEFAULT 0 CHECK (expected_count >= 0),
  scanned_count integer NOT NULL DEFAULT 0 CHECK (scanned_count >= 0),
  added_count integer NOT NULL DEFAULT 0 CHECK (added_count >= 0),
  missing_count integer NOT NULL DEFAULT 0 CHECK (missing_count >= 0),
  variance_notes text,
  shortfall_acknowledged boolean NOT NULL DEFAULT false,
  signer_name text,
  signature_data_url text,
  signed_at timestamptz,
  billing_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS pickup_sessions_one_in_progress_idx
  ON public.pickup_sessions (booking_id)
  WHERE status = 'in_progress';

CREATE INDEX IF NOT EXISTS pickup_sessions_booking_id_idx
  ON public.pickup_sessions (booking_id);

CREATE TABLE IF NOT EXISTS public.pickup_unit_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.pickup_sessions(id) ON DELETE CASCADE,
  booking_unit_id uuid NOT NULL REFERENCES public.booking_units(id) ON DELETE CASCADE,
  scanned_at timestamptz NOT NULL DEFAULT now(),
  source public.pickup_scan_source NOT NULL DEFAULT 'scan',
  CONSTRAINT pickup_unit_scans_session_unit_unique UNIQUE (session_id, booking_unit_id)
);

CREATE INDEX IF NOT EXISTS pickup_unit_scans_session_id_idx
  ON public.pickup_unit_scans (session_id);

ALTER TABLE public.pickup_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_unit_scans ENABLE ROW LEVEL SECURITY;

-- Ops tables are accessed via service role from server actions only.
