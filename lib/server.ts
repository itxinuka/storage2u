import "server-only"

import { auth } from "@clerk/nextjs/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"
import { createServiceRoleClient } from "@/lib/supabase/service"

function requireSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    )
  }
  return { url, key }
}

async function getClerkSupabaseToken(): Promise<string | null> {
  try {
    return (await auth()).getToken()
  } catch (error) {
    console.error("[supabase] Clerk getToken failed:", error)
    return null
  }
}

/**
 * Supabase client for signed-in users. Passes the Clerk session JWT when
 * available so RLS applies. Falls back to the service role when the Clerk
 * token is unavailable (user is still gated by Clerk in layout/actions).
 */
export async function createClient() {
  const { url, key } = requireSupabasePublicEnv()
  const token = await getClerkSupabaseToken()

  if (token) {
    return createSupabaseClient<Database>(url, key, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      async accessToken() {
        return getClerkSupabaseToken()
      },
    })
  }

  return createServiceRoleClient()
}
