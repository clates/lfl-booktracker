import { NextResponse } from 'next/server';
import { generateBookId } from "@/lib/id_generator";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { OpenLibraryDoc, getBookCover } from "@/lib/openLibrary";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      location: { lat, long },
      book,
      anonymousId
    } = body;

    // 1. Get authenticated user (if any)
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore }, {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.DB_KEY
    });
    const { data: { session } } = await supabase.auth.getSession();
    const user_id = session?.user?.id || null;

    // 2. Generate Code
    const code = await generateBookId(lat, long);

    // 3. Initialize Admin Client for persistence (bypassing RLS for anonymous inserts)
    // Use DB_KEY as the service role key
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

    // 4. Prepare Metadata
    const typedBook = book as OpenLibraryDoc;
    const cover_url = typedBook ? getBookCover(typedBook) : null;
    const isbn = typedBook?.isbn ? typedBook.isbn[0] : null;

    // 5. Persist Book
    const { data: bookData, error: bookError } = await adminSupabase
      .from("books")
      .insert({
        code,
        title: typedBook?.title || "Unknown Title",
        author: typedBook?.author_name?.[0] || "Unknown Author",
        isbn: isbn,
        cover_url: cover_url,
        location: `${lat},${long}`, // Simple string representation
        lat: lat,
        lon: long
      })
      .select("id")
      .single();

    if (bookError) {
      console.error("Error inserting book:", bookError);
      throw new Error("Failed to persist book");
    }

    // 6. Persist Sighting
    const { error: sightingError } = await adminSupabase
      .from("sightings")
      .insert({
        book_id: bookData.id,
        user_id: user_id,
        anonymous_id: user_id ? null : anonymousId, // Only store anon ID if not logged in
        location: `${lat},${long}`,
        lat: lat,
        lon: long,
        sighting_type: 'REGISTER'
      });
      
    if (sightingError) {
       console.error("Error inserting sighting:", sightingError);
       // We log but maybe don't fail the whole request since book is created? 
       // But sighting is important. Let's throw.
       throw new Error("Failed to persist sighting");
    }

    return NextResponse.json({ code });
  } catch (error) {
    console.error("Error generating a book code:", error);
    return NextResponse.json(
      { error: "Failed to create code" },
      { status: 500 }
    );
  }
}
