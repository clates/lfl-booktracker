import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(request: Request) {
  try {
    const { bookId, location } = await request.json();
    
    const cookieStore = cookies();
    // const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('sightings')
      .insert({
        book_id: bookId,
        user_id: user.id,
        location,
        date: Date.now(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating sighting:', error);
    return NextResponse.json(
      { error: 'Failed to create sighting' },
      { status: 500 }
    );
  }
}