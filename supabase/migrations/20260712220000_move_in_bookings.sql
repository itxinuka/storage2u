-- Move-in one-time service bookings and over-cap quote requests

CREATE TYPE move_in_booking_status AS ENUM (
  'pending_payment',
  'confirmed',
  'cancelled'
);

CREATE TABLE public.move_in_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  university_id text NOT NULL,
  campus_id text NOT NULL,
  home_address jsonb NOT NULL,
  distance_km numeric(8, 2) NOT NULL,
  base_fee_cents integer NOT NULL,
  distance_charge_cents integer NOT NULL,
  total_cents integer NOT NULL,
  move_in_date date NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  contact_name text,
  contact_email text,
  contact_phone text,
  stripe_session_id text,
  status move_in_booking_status NOT NULL DEFAULT 'pending_payment',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX move_in_bookings_profile_id_idx ON public.move_in_bookings (profile_id);
CREATE INDEX move_in_bookings_status_idx ON public.move_in_bookings (status);
CREATE INDEX move_in_bookings_move_in_date_idx ON public.move_in_bookings (move_in_date);

CREATE TABLE public.move_in_quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  university_id text NOT NULL,
  campus_id text NOT NULL,
  home_address jsonb NOT NULL,
  distance_km numeric(8, 2),
  move_in_date date NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX move_in_quote_requests_created_at_idx ON public.move_in_quote_requests (created_at DESC);

ALTER TABLE public.move_in_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.move_in_quote_requests ENABLE ROW LEVEL SECURITY;

-- Users can read their own move-in bookings
CREATE POLICY "move_in_bookings_select_own"
  ON public.move_in_bookings
  FOR SELECT
  TO authenticated
  USING (profile_id = public.get_profile_id_for_clerk_user());

-- Users can insert their own move-in bookings (profile set at checkout or quote time)
CREATE POLICY "move_in_bookings_insert_own"
  ON public.move_in_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    profile_id IS NULL
    OR profile_id = public.get_profile_id_for_clerk_user()
  );

CREATE POLICY "move_in_bookings_update_own"
  ON public.move_in_bookings
  FOR UPDATE
  TO authenticated
  USING (profile_id = public.get_profile_id_for_clerk_user())
  WITH CHECK (profile_id = public.get_profile_id_for_clerk_user());

-- Quote requests: anyone authenticated can submit (no profile link required)
CREATE POLICY "move_in_quote_requests_insert_authenticated"
  ON public.move_in_quote_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admin/ops access via service role only (no user SELECT on quote requests)
