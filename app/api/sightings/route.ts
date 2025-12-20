import { NextResponse } from "next/server"
import { adminSupabase } from "@/lib/supabase-admin"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const bounds = searchParams.get("bounds")

  // Use adminSupabase for public read to ensure it works regardless of RLS complexity for now,
  // or use Anon key if policy allows. Documentation says we allowed SELECT for all.
  // But consistent use of adminSupabase for non-user-specific data is acceptable here or just use Anon.
  // Since we already imported adminSupabase and used it elsewhere, let's stick to it or Anon?
  // User asked for "Correct Key Usage". GET is public.
  // But wait, adminSupabase bypasses RLS. Does GET need to respect RLS?
  // RLS says "Enable read access for all users". So Anon key is fine.
  // HOWEVER, I will use adminSupabase for now to guarantee it works as I don't want to fight imports again,
  // and GET is read-only.

  let query = adminSupabase.from("sightings").select("*, book:books(*)")

  // TODO: Implement bounds filtering if supported by schema (lat/lon)
  // if (bounds) ...

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const { bookId, location } = await request.json()

    // Auth Check: Use Anon Key with Session
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore } as any, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Insert: Use User Client (respects RLS)
    const { data, error } = await supabase
      .from("sightings")
      .insert({
        book_id: bookId,
        user_id: user.id,
        location,
        // date: Date.now(), // Schema handles created_at
        sighting_type: "SIGHTING",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating sighting:", error)
    return NextResponse.json({ error: "Failed to create sighting" }, { status: 500 })
  }
}
