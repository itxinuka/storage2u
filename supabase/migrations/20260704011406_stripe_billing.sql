-- Stripe billing: pending payment status and Stripe ID columns

ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'pending_payment';

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx
  ON profiles (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;
