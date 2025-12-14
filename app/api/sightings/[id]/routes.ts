import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-admin';


export async function generateStaticParams() {
  const { data: ids, error } = await supabase.from('sightings').select('id');
  if (error) throw error;
  return ids.map((id) => ({ slug: id }));
}
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { data: sighting, error: bookError } = await supabase
      .from('sightings')
      .select('*')
      .eq('id', params.code.toUpperCase())
      .single();

    if (bookError) throw bookError;
    if (!sighting) {
      return NextResponse.json({ error: 'Sighting not found' }, { status: 404 });
    }
    return NextResponse.json(sighting);
  } catch (error) {
    console.error('Error fetching sighting:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book data' },
      { status: 500 }
    );
  }
}