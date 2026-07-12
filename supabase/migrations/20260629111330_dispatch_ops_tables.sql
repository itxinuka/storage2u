-- Phase 2: dispatch / shift tables for ops schedule

CREATE TYPE public.staff_role AS ENUM ('driver', 'mover', 'dispatcher');
CREATE TYPE public.shift_assignment_status AS ENUM ('available', 'loading', 'on_route');
CREATE TYPE public.dispatch_status AS ENUM ('scheduled', 'out', 'done');
CREATE TYPE public.stop_kind AS ENUM ('pickup', 'delivery');

CREATE TABLE public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role public.staff_role NOT NULL DEFAULT 'driver',
  phone text,
  clerk_user_id text UNIQUE,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_date date NOT NULL,
  hub text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT shifts_date_hub_unique UNIQUE (shift_date, hub)
);

CREATE TABLE public.shift_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL REFERENCES public.shifts(id) ON DELETE CASCADE,
  staff_id uuid REFERENCES public.staff(id) ON DELETE SET NULL,
  vehicle_id uuid NOT NULL REFERENCES public.vehicles(id),
  status public.shift_assignment_status NOT NULL DEFAULT 'available',
  stops_total integer NOT NULL DEFAULT 0 CHECK (stops_total >= 0),
  stops_done integer NOT NULL DEFAULT 0 CHECK (stops_done >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT shift_assignments_shift_vehicle_unique UNIQUE (shift_id, vehicle_id),
  CONSTRAINT shift_assignments_stops_done_lte_total CHECK (stops_done <= stops_total)
);

CREATE TABLE public.dispatch_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_kind public.stop_kind NOT NULL,
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  delivery_request_id uuid REFERENCES public.delivery_requests(id) ON DELETE CASCADE,
  shift_assignment_id uuid REFERENCES public.shift_assignments(id) ON DELETE SET NULL,
  dispatch_status public.dispatch_status NOT NULL DEFAULT 'scheduled',
  scheduled_time text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT dispatch_delivery_request_required CHECK (
    (stop_kind = 'pickup' AND delivery_request_id IS NULL)
    OR (stop_kind = 'delivery' AND delivery_request_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX dispatch_assignments_pickup_booking_idx
  ON public.dispatch_assignments (booking_id)
  WHERE stop_kind = 'pickup';

CREATE UNIQUE INDEX dispatch_assignments_delivery_request_idx
  ON public.dispatch_assignments (delivery_request_id)
  WHERE delivery_request_id IS NOT NULL;

CREATE INDEX staff_active_idx ON public.staff (active) WHERE active = true;
CREATE INDEX shifts_shift_date_idx ON public.shifts (shift_date);
CREATE INDEX shift_assignments_shift_id_idx ON public.shift_assignments (shift_id);
CREATE INDEX dispatch_assignments_shift_assignment_id_idx
  ON public.dispatch_assignments (shift_assignment_id);

CREATE OR REPLACE FUNCTION public.set_dispatch_assignments_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER dispatch_assignments_updated_at
  BEFORE UPDATE ON public.dispatch_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_dispatch_assignments_updated_at();

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_assignments ENABLE ROW LEVEL SECURITY;

-- Ops tables are accessed via service role from server actions only.

INSERT INTO public.vehicles (label) VALUES
  ('Van 01'),
  ('Van 02'),
  ('Van 03'),
  ('Van 04'),
  ('Van 05'),
  ('Van 07')
ON CONFLICT (label) DO NOTHING;

INSERT INTO public.staff (name, role, phone)
SELECT v.name, v.role::public.staff_role, v.phone
FROM (VALUES
  ('Marcus Chen', 'driver', '(604) 555-0301'),
  ('Dana Whitfield', 'driver', '(604) 555-0302'),
  ('Aaron Patel', 'driver', '(604) 555-0303'),
  ('Riya Kapoor', 'driver', '(604) 555-0304'),
  ('Tom Becker', 'mover', '(604) 555-0305'),
  ('Nina Lopez', 'driver', '(604) 555-0306')
) AS v(name, role, phone)
WHERE NOT EXISTS (SELECT 1 FROM public.staff LIMIT 1);
