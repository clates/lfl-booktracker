import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"

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
        <HowItWorks />
      </main>
    </>
  )
}
