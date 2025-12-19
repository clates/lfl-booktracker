import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { HomeMapWrapper } from "@/components/home-map-wrapper"
import { adminSupabase } from "@/lib/supabase-admin"
import { LedgerList, SightingWithBook } from "@/components/ledger-list"

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
  // We need to reverse for display (Oldest -> Newest)
  const sightings = (sightingsData || []) as unknown as SightingWithBook[]
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
        <div className="container flex flex-col lg:flex-row mx-auto px-4 gap-8 lg:gap-16 py-8">
          <div className="w-full lg:w-2/3">
            {/* Map takes up more space on desktop */}
            <HomeMapWrapper sightings={sortedSightings} />
          </div>
          <div className="w-full lg:w-1/3 flex flex-col justify-center">
            {/* Ledger list on the side */}
            <LedgerList sightings={sortedSightings} />
          </div>
        </div>
        <HowItWorks />
      </main>
    </>
  )
}
