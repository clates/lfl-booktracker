import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { adminSupabase } from "@/lib/supabase-admin"
import { SightingWithBook } from "@/components/ledger-list"
import { SightingsFeed } from "@/components/sightings-feed"

export const dynamic = "force-dynamic"

export default async function Home() {
  const { data: sightingsData, error } = await adminSupabase
    .from("sightings")
    .select("*, book:books(*)")
    .order("created_at", { ascending: false })
    .limit(25)

  if (error) {
    console.error("Error fetching sightings:", error)
    return (
      <>
        <div
          className="fixed inset-0 -z-10 opacity-25 blur-[1px]"
          style={{
            backgroundImage: "url('/images/background/lfl-background-edited.png')",
          }}
        />
        <main className="min-h-screen">
          <Hero />
          <section className="mx-auto max-w-3xl px-4 py-8 text-center">
            <h2 className="text-lg font-semibold text-red-600">Error loading recent sightings</h2>
            <p className="mt-2 text-sm text-gray-700">
              We&apos;re having trouble fetching the latest sightings right now. Please try again in
              a few moments.
            </p>
          </section>
          <HowItWorks />
        </main>
      </>
    )
  }

  // Cast the data to our type, assuming the join worked as expected.
  const rawSightings = (sightingsData || []) as unknown as SightingWithBook[]

  // Collect unique user IDs from the sightings so we can fetch user info in a single query.
  const uniqueIds = Array.from(
    new Set(rawSightings.map((s) => s.user_id).filter(Boolean))
  ) as string[]

  // Batch-fetch user info from auth.users for all relevant user IDs.
  // We use Promise.all to fetch users in parallel, avoiding N+1 sequential requests.
  const usersMap = new Map<string, string>()

  if (uniqueIds.length > 0) {
    const userPromises = uniqueIds.map((id) => adminSupabase.auth.admin.getUserById(id))
    const userResponses = await Promise.all(userPromises)

    userResponses.forEach((response) => {
      if (response.data.user) {
        usersMap.set(response.data.user.id, response.data.user.email || "")
      }
    })
  }

  // Attach user info to sightings using the pre-fetched user map.
  const sightings = rawSightings.map((sighting) => {
    if (sighting.user_id && usersMap.has(sighting.user_id)) {
      const fullEmail = usersMap.get(sighting.user_id) || ""
      // Security: Obfuscate the email server-side.
      // Format: first 3 chars + ... + last 3 chars of username.
      const username = fullEmail.split("@")[0]
      const maskedEmail = `${username.slice(0, 3)}...${username.slice(-3)}`
      return {
        ...sighting,
        user: {
          email: maskedEmail,
        },
      }
    }
    return sighting
  })

  // We need to reverse for display (Oldest -> Newest) because the feed will process them in order
  const sortedSightings = [...sightings].reverse()

  return (
    <>
      <div
        className="fixed inset-0 -z-10 opacity-25 blur-[1px]"
        style={{
          backgroundImage: "url('/images/background/lfl-background-edited.png')",
        }}
      />
      <main className="min-h-screen">
        <Hero />
        <SightingsFeed initialSightings={sortedSightings} />
        <HowItWorks />
      </main>
    </>
  )
}
