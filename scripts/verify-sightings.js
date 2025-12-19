const { createClient } = require("@supabase/supabase-js")

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

async function checkSightings() {
  console.log("Fetching sightings...")
  const { data, error } = await supabase
    .from("sightings")
    .select("*, books(*)")
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error:", error)
    return
  }

  console.log(`Fetched ${data.length} sightings.`)
  if (data.length > 0) {
    console.log("Sample sighting:", JSON.stringify(data[0], null, 2))
    const sorted = [...data].reverse()
    console.log("First item after reverse (should be oldest of the batch):", sorted[0].created_at)
    console.log(
      "Last item after reverse (should be newest of the batch):",
      sorted[sorted.length - 1].created_at
    )
  }
}

checkSightings()
