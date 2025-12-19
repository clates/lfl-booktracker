import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

// export async function generateStaticParams() {
//   // Static params generation requires a client.
//   // Skipping for now as this is dynamic.
//   return [];
// }

export async function GET(request: Request, { params }: any) {
  try {
    const cookieStore = cookies()
    // Explicitly use the DB_KEY which functions as our Anon/Service key here
    const supabase = createRouteHandlerClient(
      { cookies: () => cookieStore },
      {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.DB_KEY,
      }
    )

    const { data: book, error: bookError } = await supabase
      .from("books")
      .select("*")
      .eq("code", params.id.toUpperCase())
      .single()

    if (bookError) throw bookError
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    const { data: sightings, error: sightingsError } = await supabase
      .from("sightings")
      .select("*")
      .eq("book_id", book.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (sightingsError) throw sightingsError

    return NextResponse.json({ book, sightings })
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json({ error: "Failed to fetch book data" }, { status: 500 })
  }
}
