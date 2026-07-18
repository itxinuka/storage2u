-- Per-physical-unit and order-level scannable labels for bookings.

CREATE TYPE public.booking_unit_kind AS ENUM ('order', 'unit');

CREATE TABLE IF NOT EXISTS public.booking_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  booking_item_id uuid REFERENCES public.booking_items(id) ON DELETE CASCADE,
  kind public.booking_unit_kind NOT NULL,
  label_name text NOT NULL,
  unit_index integer NOT NULL CHECK (unit_index > 0),
  code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT booking_units_code_unique UNIQUE (code),
  CONSTRAINT booking_units_order_item_null CHECK (
    (kind = 'order' AND booking_item_id IS NULL)
    OR (kind = 'unit' AND booking_item_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS booking_units_one_order_label_idx
  ON public.booking_units (booking_id)
  WHERE kind = 'order';

CREATE UNIQUE INDEX IF NOT EXISTS booking_units_item_unit_idx
  ON public.booking_units (booking_item_id, unit_index)
  WHERE kind = 'unit';

CREATE INDEX IF NOT EXISTS booking_units_booking_id_idx
  ON public.booking_units (booking_id);

ALTER TABLE public.booking_units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own booking units"
  ON public.booking_units
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.profiles p ON p.id = b.profile_id
      WHERE b.id = booking_units.booking_id
        AND p.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

CREATE POLICY "Users can insert own booking units"
  ON public.booking_units
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.profiles p ON p.id = b.profile_id
      WHERE b.id = booking_units.booking_id
        AND p.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );

-- Backfill labels for existing bookings that have no units yet.
WITH display AS (
  SELECT
    b.id AS booking_id,
    upper(substr(b.id::text, 1, 8)) AS display_id,
    b.created_at
  FROM public.bookings b
  WHERE NOT EXISTS (
    SELECT 1 FROM public.booking_units u
    WHERE u.booking_id = b.id AND u.kind = 'order'
  )
),
order_rows AS (
  INSERT INTO public.booking_units (
    booking_id, booking_item_id, kind, label_name, unit_index, code, created_at
  )
  SELECT
    d.booking_id,
    NULL,
    'order'::public.booking_unit_kind,
    'Order',
    1,
    'S2U-' || d.display_id || '-O',
    d.created_at
  FROM display d
  RETURNING booking_id
),
item_units AS (
  SELECT
    bi.id AS booking_item_id,
    bi.booking_id,
    bi.name AS label_name,
    gs.unit_index,
    upper(substr(bi.booking_id::text, 1, 8)) AS display_id,
    bi.created_at,
    row_number() OVER (
      PARTITION BY bi.booking_id
      ORDER BY bi.created_at, bi.id, gs.unit_index
    ) AS global_index
  FROM public.booking_items bi
  JOIN display d ON d.booking_id = bi.booking_id
  CROSS JOIN LATERAL generate_series(1, bi.qty) AS gs(unit_index)
)
INSERT INTO public.booking_units (
  booking_id, booking_item_id, kind, label_name, unit_index, code, created_at
)
SELECT
  iu.booking_id,
  iu.booking_item_id,
  'unit'::public.booking_unit_kind,
  iu.label_name,
  iu.unit_index,
  'S2U-' || iu.display_id || '-' || lpad(iu.global_index::text, 3, '0'),
  iu.created_at
FROM item_units iu;
