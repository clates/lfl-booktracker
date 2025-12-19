const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.DB_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment.")
  process.exit(1)
}

const adminSupabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

const LOCATIONS = [
  { name: "Herndon", lat: 38.9696, lon: -77.3861 },
  { name: "Reston", lat: 38.9586, lon: -77.357 },
  { name: "Sterling", lat: 39.0067, lon: -77.4291 },
  { name: "Ashburn", lat: 39.0438, lon: -77.4874 },
]

const SEARCH_TERMS = [
  "bestsellers 2024",
  "classic novels",
  "science fiction",
  "mystery thriller",
  "fantasy books",
  "biography",
]

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomLocation() {
  const loc = LOCATIONS[getRandomInt(0, LOCATIONS.length - 1)]
  const latJitter = (Math.random() - 0.5) * 0.04
  const lonJitter = (Math.random() - 0.5) * 0.04
  return {
    lat: loc.lat + latJitter,
    lon: loc.lon + lonJitter,
    name: loc.name,
  }
}

async function fetchGoogleBooks() {
  console.log("Fetching books from Google Books API...")
  let allBooks = []

  for (const term of SEARCH_TERMS) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(term)}&maxResults=10&printType=books&langRestrict=en`
      )
      if (!res.ok) continue
      const data = await res.json()
      if (data.items) {
        const books = data.items
          .map((item) => {
            const info = item.volumeInfo
            let cover = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail
            if (cover) cover = cover.replace("http:", "https:")

            if (!info.title || !info.authors || !cover) return null

            return {
              title: info.title,
              author: info.authors[0],
              cover: cover,
            }
          })
          .filter((b) => b !== null)
        allBooks = [...allBooks, ...books]
      }
    } catch (e) {
      console.error(`Failed to fetch for ${term}:`, e.message)
    }
  }

  // Shuffle
  allBooks.sort(() => Math.random() - 0.5)
  // Unique by title to avoid duplicates
  const uniqueBooks = Array.from(new Map(allBooks.map((item) => [item.title, item])).values())

  console.log(`Fetched ${uniqueBooks.length} unique realistic books.`)
  return uniqueBooks
}

async function seed() {
  const freshBooks = await fetchGoogleBooks()

  // Fallback if API fails
  if (freshBooks.length === 0) {
    console.error("No books fetched using API. Aborting realistic seed.")
    return
  }

  // Limit to 30 or available
  const booksToInsert = freshBooks.slice(0, 30)
  console.log(`Starting seed with ${booksToInsert.length} books...`)

  let seededCount = 0

  for (const bookMeta of booksToInsert) {
    const location = getRandomLocation()
    const code = Math.random().toString(36).substring(7).toUpperCase()

    // 1. Create Book
    const { data: book, error: bookError } = await adminSupabase
      .from("books")
      .insert({
        title: bookMeta.title,
        author: bookMeta.author,
        cover_url: bookMeta.cover,
        code: code,
        location: location.name,
        lat: location.lat,
        lon: location.lon,
      })
      .select()
      .single()

    if (bookError) {
      console.error("Error creating book:", bookError.message)
      continue
    }

    // 2. Create Sighting
    const { error: sightingError } = await adminSupabase.from("sightings").insert({
      book_id: book.id,
      location: location.name,
      lat: location.lat,
      lon: location.lon,
      sighting_type: "DROP",
      created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    })

    if (sightingError) {
      console.error("Error creating sighting:", sightingError.message)
    } else {
      seededCount++
      process.stdout.write(".")
    }
  }

  console.log(`\nSeeding complete. Inserted ${seededCount} books and sightings.`)
}

seed()
