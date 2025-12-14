import { supabase } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { anonymousId } = await request.json();

    if (!anonymousId) {
       return NextResponse.json({ message: "No anonymous ID provided" }, { status: 400 });
    }

    // 1. Get authenticated user
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Initialize Admin Client (Service Role)
    // We need service role because we might be updating rows that the user *can't see* yet via RLS 
    // or to ensure we can update 'anonymous' rows reliably.
    // Actually, RLS usually allows users to update their OWN rows, but these rows belong to 'anon' or NULL.
    // So yes, Admin client is safest to 'adopt' these rows.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    // 3. Update sightings
    const { data, error, count } = await adminSupabase
      .from("sightings")
      .update({ user_id: userId })
      .eq("anonymous_id", anonymousId)
      .is("user_id", null) // Only claim unclaimed ones
      .select("id");

    if (error) {
      console.error("Error claiming sightings:", error);
      return NextResponse.json({ error: "Failed to claim sightings" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      claimedCount: data.length 
    });

  } catch (error) {
    console.error("Error in claim route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
