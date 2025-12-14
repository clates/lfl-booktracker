import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { anonymousId } = await request.json();

    if (!anonymousId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(anonymousId)) {
       return NextResponse.json({ message: "Invalid anonymous ID" }, { status: 400 });
    }

    // 1. Get authenticated user
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore }, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.DB_KEY
    });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Claim sightings
    // Use DB_KEY which acts as our service/admin key for this app logic
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.DB_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
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
