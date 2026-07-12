-- Booking mode enum
CREATE TYPE public.booking_mode AS ENUM ('pickup', 'delivery');

-- Booking item kind enum
CREATE TYPE public.booking_item_kind AS ENUM ('box', 'item');

-- Extend bookings table
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS mode public.booking_mode NOT NULL DEFAULT 'pickup',
  ADD COLUMN IF NOT EXISTS university text,
  ADD COLUMN IF NOT EXISTS residence text,
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS time_window text,
  ADD COLUMN IF NOT EXISTS delivery_date date,
  ADD COLUMN IF NOT EXISTS monthly_total_cents integer NOT NULL DEFAULT 0;

-- Booking line items
CREATE TABLE IF NOT EXISTS public.booking_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  catalog_id text NOT NULL,
  name text NOT NULL,
  kind public.booking_item_kind NOT NULL,
  qty integer NOT NULL CHECK (qty > 0),
  unit_price_cents integer NOT NULL CHECK (unit_price_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS booking_items_booking_id_idx ON public.booking_items(booking_id);

ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own booking items"
  ON public.booking_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.profiles p ON p.id = b.profile_id
      WHERE b.id = booking_items.booking_id
        AND p.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );
