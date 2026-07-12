-- Ops-managed booking availability blocks (full days and/or time windows)

CREATE TABLE public.booking_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_date date NOT NULL,
  time_window_id text,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text,
  CONSTRAINT booking_blocks_time_window_check CHECK (
    time_window_id IS NULL
    OR time_window_id IN ('morning', 'afternoon', 'evening')
  ),
  CONSTRAINT booking_blocks_date_window_key UNIQUE NULLS NOT DISTINCT (block_date, time_window_id)
);

CREATE INDEX booking_blocks_block_date_idx ON public.booking_blocks (block_date);

ALTER TABLE public.booking_blocks ENABLE ROW LEVEL SECURITY;

-- Ops tables are accessed via service role from server actions only.
