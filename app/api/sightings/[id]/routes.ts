import { NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase-admin';

export async function generateStaticParams() {
  const { data: sightings } = await adminSupabase.from('sightings').select('id');
  return sightings?.map(({ id }) => ({ id })) || [];
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data: sighting, error } = await adminSupabase
      .from('sightings')
      .select('*, book:books(*)')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!sighting) {
      return NextResponse.json({ error: 'Sighting not found' }, { status: 404 });
    }
    return NextResponse.json(sighting);
  } catch (error) {
    console.error('Error fetching sighting:', error);
    return NextResponse.json({ error: 'Failed to fetch sighting' }, { status: 500 });
  }
}
