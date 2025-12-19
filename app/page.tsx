import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { HomeMapWrapper } from "@/components/home-map-wrapper"

export default function Home() {
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
        <div className="container mx-auto px-4">
          <HomeMapWrapper />
        </div>
        <HowItWorks />
      </main>
    </>
  )
}
