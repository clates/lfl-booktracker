import { adminSupabase } from './supabase-admin';

export async function claimSightings(userId: string, anonymousId: string) {
  // Use centralized Admin Client to bypass RLS and update 'anonymous' rows

  try {
    const { error, count } = await adminSupabase
      .from('sightings')
      .update({ user_id: userId })
      .eq('anonymous_id', anonymousId)
      .is('user_id', null);

    if (error) {
      console.error('Error claiming sightings:', error);
    } else if (count && count > 0) {
      console.log(`Claimed ${count} sightings for user ${userId}`);
    }
  } catch (e) {
    console.error('Exception claiming sightings:', e);
  }
}
