import { createClient } from "@supabase/supabase-js"

// Centralized Admin Client for explicit server-side privileged operations.
// Bypasses RLS. Use with caution.
export const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.DB_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.DB_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)
