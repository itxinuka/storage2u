-- Phase 5: warehouse tables for ops warehouses view

CREATE TABLE public.warehouses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL DEFAULT '—',
  capacity_pct integer NOT NULL DEFAULT 0 CHECK (capacity_pct >= 0 AND capacity_pct <= 100),
  units_occupied integer NOT NULL DEFAULT 0 CHECK (units_occupied >= 0),
  box_count integer NOT NULL DEFAULT 0 CHECK (box_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.warehouse_campuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  campus_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT warehouse_campuses_unique UNIQUE (warehouse_id, campus_name)
);

CREATE INDEX warehouse_campuses_warehouse_id_idx ON public.warehouse_campuses (warehouse_id);
CREATE INDEX warehouse_campuses_campus_name_idx ON public.warehouse_campuses (campus_name);

CREATE TABLE public.storage_holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id uuid NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  bay_code text NOT NULL,
  box_count integer NOT NULL DEFAULT 0 CHECK (box_count >= 0),
  item_count integer NOT NULL DEFAULT 0 CHECK (item_count >= 0),
  stored_since date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX storage_holdings_warehouse_id_idx ON public.storage_holdings (warehouse_id);
CREATE INDEX storage_holdings_profile_id_idx ON public.storage_holdings (profile_id);

ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_holdings ENABLE ROW LEVEL SECURITY;

-- Ops tables are accessed via service role from server actions only.

INSERT INTO public.warehouses (name, city, capacity_pct, units_occupied, box_count)
SELECT v.name, v.city, v.capacity_pct, v.units_occupied, v.box_count
FROM (VALUES
  ('Burnaby Facility', 'Burnaby, BC', 72, 184, 1240),
  ('Richmond Facility', 'Richmond, BC', 58, 142, 980)
) AS v(name, city, capacity_pct, units_occupied, box_count)
WHERE NOT EXISTS (SELECT 1 FROM public.warehouses LIMIT 1);

INSERT INTO public.warehouse_campuses (warehouse_id, campus_name)
SELECT w.id, c.campus_name
FROM public.warehouses w
JOIN (VALUES
  ('Burnaby Facility', 'UBC'),
  ('Richmond Facility', 'SFU')
) AS c(warehouse_name, campus_name) ON w.name = c.warehouse_name
ON CONFLICT (warehouse_id, campus_name) DO NOTHING;

INSERT INTO public.storage_holdings (
  warehouse_id,
  profile_id,
  bay_code,
  box_count,
  item_count,
  stored_since
)
SELECT
  w.id,
  p.id,
  h.bay_code,
  h.box_count,
  h.item_count,
  h.stored_since::date
FROM public.warehouses w
JOIN (VALUES
  ('Burnaby Facility', 'A-12-03', 6, 2, '2026-09-19'),
  ('Burnaby Facility', 'A-12-07', 4, 1, '2026-09-19'),
  ('Burnaby Facility', 'B-04-11', 7, 1, '2026-09-12'),
  ('Richmond Facility', 'D-01-05', 8, 2, '2026-05-04'),
  ('Richmond Facility', 'D-03-14', 5, 0, '2026-09-19')
) AS h(warehouse_name, bay_code, box_count, item_count, stored_since) ON w.name = h.warehouse_name
CROSS JOIN (SELECT id FROM public.profiles ORDER BY created_at LIMIT 1) p
WHERE NOT EXISTS (SELECT 1 FROM public.storage_holdings LIMIT 1);
