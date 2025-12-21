import { adminSupabase } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { anonymousId } = await request.json()

    if (
      !anonymousId ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(anonymousId)
    ) {
      return NextResponse.json({ message: "Invalid anonymous ID" }, { status: 400 })
    }

    // 1. Get authenticated user
    const cookieStore = await cookies()
    // Use ANON_KEY for session handling (respects RLS)
    const supabase = createRouteHandlerClient(
      { cookies: () => cookieStore },
      {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
    )
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id

    // 2. Claim sightings using centralized Admin Client
    // 3. Update sightings
    const { data, error, count } = await adminSupabase
      .from("sightings")
      .update({ user_id: userId })
      .eq("anonymous_id", anonymousId)
      .is("user_id", null) // Only claim unclaimed ones
      .select("id")

    if (error) {
      console.error("Error claiming sightings:", error)
      return NextResponse.json({ error: "Failed to claim sightings" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      claimedCount: data.length,
    })
  } catch (error) {
    console.error("Error in claim route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
