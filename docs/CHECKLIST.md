# Project Checklist

Outstanding work items for storage2u.

## Auth & Supabase

- [ ] **Wire Clerk session tokens into the Supabase server client** (`lib/server.ts`)
  - The `bookings` and `profiles` tables use RLS policies that expect a Clerk JWT with `sub` matching `clerk_user_id` (via `auth.jwt() ->> 'sub'` and `get_profile_id_for_clerk_user()`).
  - The current Supabase client uses the publishable key only and does not pass a Clerk token, so dashboard queries will return empty results until this is configured.
  - Pass the Clerk session token when creating the Supabase client, e.g. `getToken({ template: 'supabase' })` from `auth()` in server components.
- [ ] **Create a Supabase JWT template in the Clerk Dashboard**
  - Required for `getToken({ template: 'supabase' })` to return a token Supabase can validate.
  - See [Clerk + Supabase integration](https://clerk.com/docs/integrations/databases/supabase).
- [ ] **Configure Supabase to accept Clerk as a third-party auth provider**
  - Add Clerk's JWKS URL in the Supabase dashboard so Supabase can verify Clerk-issued JWTs.

## Student Dashboard

- [ ] **Implement `DashboardView`** (`components/dashboard-view.tsx`)
  - Currently a placeholder that returns `null`.
  - Should render the `bookings` data passed from `app/dashboard/page.tsx`.
