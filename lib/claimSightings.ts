import { createClient } from "@supabase/supabase-js";

export async function claimSightings(userId: string, anonymousId: string) {
  // Use DB_KEY to bypass RLS and update 'anonymous' rows
  
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
