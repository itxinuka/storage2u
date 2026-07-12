-- Allow signed-in users to create their own profile row (first booking).

CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (clerk_user_id = (auth.jwt() ->> 'sub'));

-- Allow inserting line items on bookings the user owns.

CREATE POLICY "Users can insert own booking items"
  ON public.booking_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      JOIN public.profiles p ON p.id = b.profile_id
      WHERE b.id = booking_items.booking_id
        AND p.clerk_user_id = (auth.jwt() ->> 'sub')
    )
  );
