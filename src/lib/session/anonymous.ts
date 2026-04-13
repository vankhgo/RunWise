import type { SupabaseClient } from "@supabase/supabase-js"

export async function ensureAnonymousSession(supabase: SupabaseClient) {
  try {
    const current = await supabase.auth.getSession()
    if (current.error) return { userId: null, error: current.error.message }

    const existingUserId = current.data.session?.user?.id
    if (existingUserId) return { userId: existingUserId, error: null }

    const anon = await supabase.auth.signInAnonymously()
    if (anon.error) return { userId: null, error: anon.error.message }

    return {
      userId: anon.data.user?.id ?? null,
      error: anon.data.user?.id ? null : "Anonymous user unavailable",
    }
  } catch {
    return {
      userId: null,
      error: "Anonymous session bootstrap failed",
    }
  }
}
