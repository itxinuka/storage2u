-- Helper: resolve the signed-in Clerk user to a profile row
CREATE OR REPLACE FUNCTION public.get_profile_id_for_clerk_user()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id
  FROM public.profiles
  WHERE clerk_user_id = (auth.jwt() ->> 'sub')
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_profile_id_for_clerk_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_profile_id_for_clerk_user() TO authenticated;

-- profiles
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (clerk_user_id = (auth.jwt() ->> 'sub'));

CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (clerk_user_id = (auth.jwt() ->> 'sub'))
  WITH CHECK (clerk_user_id = (auth.jwt() ->> 'sub'));

-- bookings
CREATE POLICY "bookings_select_own"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (profile_id = public.get_profile_id_for_clerk_user());

CREATE POLICY "bookings_insert_own"
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = public.get_profile_id_for_clerk_user());

CREATE POLICY "bookings_update_own"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (profile_id = public.get_profile_id_for_clerk_user())
  WITH CHECK (profile_id = public.get_profile_id_for_clerk_user());

-- items (via owning booking)
CREATE POLICY "items_select_own"
  ON public.items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.id = items.booking_id
        AND b.profile_id = public.get_profile_id_for_clerk_user()
    )
  );

CREATE POLICY "items_insert_own"
  ON public.items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.id = items.booking_id
        AND b.profile_id = public.get_profile_id_for_clerk_user()
    )
  );

CREATE POLICY "items_update_own"
  ON public.items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.id = items.booking_id
        AND b.profile_id = public.get_profile_id_for_clerk_user()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.id = items.booking_id
        AND b.profile_id = public.get_profile_id_for_clerk_user()
    )
  );

CREATE POLICY "items_delete_own"
  ON public.items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.id = items.booking_id
        AND b.profile_id = public.get_profile_id_for_clerk_user()
    )
  );

-- delivery_requests
CREATE POLICY "delivery_requests_select_own"
  ON public.delivery_requests
  FOR SELECT
  TO authenticated
  USING (profile_id = public.get_profile_id_for_clerk_user());

CREATE POLICY "delivery_requests_insert_own"
  ON public.delivery_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    profile_id = public.get_profile_id_for_clerk_user()
    AND EXISTS (
      SELECT 1
      FROM public.bookings b
      WHERE b.id = delivery_requests.booking_id
        AND b.profile_id = public.get_profile_id_for_clerk_user()
    )
  );

CREATE POLICY "delivery_requests_update_own"
  ON public.delivery_requests
  FOR UPDATE
  TO authenticated
  USING (profile_id = public.get_profile_id_for_clerk_user())
  WITH CHECK (profile_id = public.get_profile_id_for_clerk_user());

-- universities (public reference data)
CREATE POLICY "universities_select_public"
  ON public.universities
  FOR SELECT
  TO anon, authenticated
  USING (true);
