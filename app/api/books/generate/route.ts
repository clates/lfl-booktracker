import { adminSupabase } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"
import { generateBookId } from "@/lib/id_generator"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { OpenLibraryDoc, getBookCover } from "@/lib/openLibrary"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      location: { lat, long },
      book,
      anonymousId,
    } = body

    // 1. Check user session (optional but good context)
    // Use defaults (implicitly uses NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const userId = session?.user?.id || null

    // 2. Generate Code
    const code = await generateBookId(lat, long)

    // 3. Initialize Admin Client for persistence (bypassing RLS for anonymous inserts)
    // Use DB_KEY as the service role key
    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.DB_KEY!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

    // 4. Prepare Metadata
    // 4. Prepare Metadata
    // The 'book' object might be an OpenLibraryDoc or a generic object from GoogleBookSearch
    const bookData = book as any; 
    
    const title = bookData.title || "Unknown Title";
    
    // Handle authors: could be 'authors' (Google) or 'author_name' (OpenLibrary) or just 'author'
    let author = "Unknown Author";
    if (Array.isArray(bookData.authors) && bookData.authors.length > 0) {
        author = bookData.authors.join(", ");
    } else if (Array.isArray(bookData.author_name) && bookData.author_name.length > 0) {
        author = bookData.author_name[0]; // Keep first author for consistency with old behavior
    } else if (typeof bookData.author === 'string') {
        author = bookData.author;
    }

    // Handle cover: use direct url or generate from OLID
    let cover_link = bookData.coverUrl || bookData.cover_url;
    if (!cover_link && bookData.cover_edition_key) {
        cover_link = getBookCover(bookData);
    }

    const isbn = bookData.isbn ? (Array.isArray(bookData.isbn) ? bookData.isbn[0] : bookData.isbn) : null;

    // 5. Persist Book
    const { data, error } = await adminSupabase
      .from("books")
      .insert({
        code,
        lat,
        lon: long,
        title: title,
        author: author,
        isbn: isbn,
        cover_url: cover_link,
        location: `${lat},${long}` 
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating book:", error)
      return NextResponse.json({ error: "Failed to generate book" }, { status: 500 })
    }

    // 4. Create Initial Sighting
    const { error: sightingError } = await adminSupabase.from("sightings").insert({
      book_id: data.id,
      lat,
      lon: long,
      location: `${lat},${long}`,
      sighting_type: "REGISTER",
      // If user is logged in, associate with them. Otherwise anonymous.
      user_id: userId,
      // If anonymous (no user_id), store the anonymousId to link later
      anonymous_id: userId ? null : anonymousId,
    })

    if (sightingError) {
      console.error("Error inserting sighting:", sightingError)
      // We log but maybe don't fail the whole request since book is created?
      // But sighting is important. Let's throw.
      throw new Error("Failed to persist sighting")
    }

    return NextResponse.json({ code })
  } catch (error) {
    console.error("Error generating a book code:", error)
    return NextResponse.json({ error: "Failed to create code" }, { status: 500 })
  }
}
