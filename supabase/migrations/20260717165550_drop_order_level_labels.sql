-- Remove order-level labels; keep only per-item unit labels.
DELETE FROM public.booking_units WHERE kind = 'order';
