import "server-only"

import { auth } from "@clerk/nextjs/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"
import { debugLog } from "@/lib/debug-log"
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
    return (await auth()).getToken({ template: "supabase" })
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

  // #region agent log
  debugLog(
    "server.ts:createClient",
    "token resolved",
    { hasToken: Boolean(token) },
    "C"
  )
  // #endregion

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

  // #region agent log
  debugLog(
    "server.ts:createClient",
    "falling back to service role",
    {},
    "C"
  )
  // #endregion

  try {
    return createServiceRoleClient()
  } catch (err) {
    // #region agent log
    debugLog(
      "server.ts:createClient",
      "service role fallback failed",
      { message: err instanceof Error ? err.message : String(err) },
      "C"
    )
    // #endregion
    throw err
  }
}
