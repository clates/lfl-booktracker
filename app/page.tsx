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
  }

  // Cast the data to our type, assuming the join worked as expected.
  const rawSightings = (sightingsData || []) as unknown as SightingWithBook[]

  // Manually fetch user info if user_id is present (since we can't easily join auth.users)
  const sightings = await Promise.all(
    rawSightings.map(async (sighting) => {
      if (sighting.user_id) {
        const { data: userData } = await adminSupabase.auth.admin.getUserById(sighting.user_id)
        if (userData.user) {
          return {
            ...sighting,
            user: {
              email: userData.user.email || "",
            },
          }
        }
      }
      return sighting
    })
  )

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
