-- Optional Protection Plan add-on per booking

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS protection_plan boolean NOT NULL DEFAULT false;
