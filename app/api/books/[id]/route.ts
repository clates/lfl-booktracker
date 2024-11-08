import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';


export async function generateStaticParams() {
  const { data: codes, error } = await supabase.from('books').select('code');
  if (error) throw error;
  return codes.map((code) => ({ slug: code }));
}
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('code', params.code.toUpperCase())
      .single();

    if (bookError) throw bookError;
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const { data: sightings, error: sightingsError } = await supabase
      .from('sightings')
      .select('*, user:user_id(email)')
      .eq('book_id', book.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (sightingsError) throw sightingsError;

    return NextResponse.json({ book, sightings });
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book data' },
      { status: 500 }
    );
  }
}