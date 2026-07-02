import { auth } from "@clerk/nextjs/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"

/**
 * Supabase client for signed-in users. Passes the Clerk session JWT so RLS
 * policies (auth.jwt() ->> 'sub') apply. Create a new client per request.
 */
export async function createClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      async accessToken() {
        return (await auth()).getToken()
      },
    }
  )
}
