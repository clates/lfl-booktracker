import "./globals.css"
import type { Metadata } from "next"
import { Inter, Crimson_Text } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ParchmentFilters } from "@/components/ui/parchment-filters"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { claimSightings } from "@/lib/claimSightings"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const crimson = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "TaleTrail",
  description: "Track and generate book codes",
}

export const dynamic = "force-dynamic"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  // Ensure we use the ANON key for client operations to respect RLS
  const supabase = createServerComponentClient(
    { cookies: () => Promise.resolve(cookieStore) },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
  )
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const anonymousId = cookieStore.get("lfl_anonymous_id")?.value

  if (session?.user?.id && anonymousId) {
    // Fire and forget? ideally await to ensure consistency but don't block too long?
    // We await to ensure it happens.
    await claimSightings(session.user.id, anonymousId)
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans`}>
        <ParchmentFilters />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="flex-1 min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
