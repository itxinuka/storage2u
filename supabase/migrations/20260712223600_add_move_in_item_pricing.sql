ALTER TABLE public.move_in_bookings
  ADD COLUMN item_count integer NOT NULL DEFAULT 0
    CHECK (item_count >= 0),
  ADD COLUMN item_charge integer NOT NULL DEFAULT 0
    CHECK (item_charge >= 0);

UPDATE public.move_in_bookings AS booking
SET item_count = COALESCE((
  SELECT SUM(entry.value::integer)
  FROM jsonb_each_text(booking.items) AS entry
), 0);

UPDATE public.move_in_bookings
SET item_charge = GREATEST(0, item_count - 10) * 4;

COMMENT ON COLUMN public.move_in_bookings.item_count IS
  'Total quantity of all items in the move-in booking.';

COMMENT ON COLUMN public.move_in_bookings.item_charge IS
  'CAD item surcharge at quote time: $4 for each item beyond 10.';
