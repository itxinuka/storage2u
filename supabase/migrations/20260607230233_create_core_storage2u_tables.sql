-- Enums
CREATE TYPE booking_status AS ENUM (
  'scheduled',
  'picked_up',
  'in_storage',
  'delivered',
  'cancelled'
);

CREATE TYPE delivery_request_status AS ENUM (
  'pending',
  'scheduled',
  'in_transit',
  'delivered',
  'cancelled'
);

-- Universities (service area targets)
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code_prefix TEXT NOT NULL
);

-- Profiles (synced from Clerk webhooks)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  university TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bookings (one row per pickup request)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status booking_status NOT NULL DEFAULT 'scheduled',
  pickup_date DATE,
  pickup_address TEXT NOT NULL,
  notes TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Items (individual boxes/items per booking)
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0)
);

-- Delivery requests (student requests their stuff back)
CREATE TABLE delivery_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  requested_date DATE,
  delivery_address TEXT NOT NULL,
  status delivery_request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_profiles_clerk_user_id ON profiles(clerk_user_id);
CREATE INDEX idx_bookings_profile_id ON bookings(profile_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_items_booking_id ON items(booking_id);
CREATE INDEX idx_delivery_requests_booking_id ON delivery_requests(booking_id);
CREATE INDEX idx_delivery_requests_profile_id ON delivery_requests(profile_id);
CREATE INDEX idx_universities_postal_code_prefix ON universities(postal_code_prefix);
