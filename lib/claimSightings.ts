import { createClient } from "@supabase/supabase-js";

export async function claimSightings(userId: string, anonymousId: string) {
  // Use Service Role Key to bypass RLS and update 'anonymous' rows
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.DB_KEY;
  
  if (!serviceRoleKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY or DB_KEY for claiming sightings");
    return;
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  try {
    const { error, count } = await adminSupabase
      .from("sightings")
      .update({ user_id: userId })
      .eq("anonymous_id", anonymousId)
      .is("user_id", null);

    if (error) {
      console.error("Error claiming sightings:", error);
    } else if (count && count > 0) {
      console.log(`Claimed ${count} sightings for user ${userId}`);
    }
  } catch (e) {
    console.error("Exception claiming sightings:", e);
  }
}
