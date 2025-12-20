"use client"

import { useState, useEffect } from "react"
import { ParchmentFrame } from "@/components/ui/parchment-frame"
import { GoogleBookSearch } from "@/components/google-book-search"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import useLocation from "@/hooks/use-location"
import { GoogleBookData } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function GeneratePage() {
  const [selectedBook, setSelectedBook] = useState<GoogleBookData | null>(null)

  const [generatedCode, setGeneratedCode] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()
  const { latitude, longitude } = useLocation()

  // Helper to get cookie
  function getCookie(name: string) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift()
  }

  useEffect(() => {
    if (!getCookie("lfl_anonymous_id")) {
      const newId = crypto.randomUUID()
      // Set cookie for 1 year
      document.cookie = `lfl_anonymous_id=${newId}; path=/; max-age=31536000; SameSite=Lax; Secure`
    }
  }, [])

  async function handleGenerate() {
    if (!selectedBook) return

    // Basic location check - navigator.geolocation is also checked by useLocation hook
    if (!latitude || !longitude) {
      toast({
        title: "Location Required",
        description: "We need your location to generate a code.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const anonymousId = getCookie("lfl_anonymous_id")
      const response = await fetch("/api/books/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book: selectedBook,
          location: {
            lat: latitude,
            long: longitude,
          },
          anonymousId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate code")
      }

      const { code } = await response.json()
      setGeneratedCode(code)
      toast({
        title: "Success",
        description: "Book code generated successfully!",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to generate ID. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Format the code into ###-###-### format
  function formatCode(code: string) {
    return `${code.slice(0, 4)}-${code.slice(4, 6)}-${code.slice(6, 9)}`.toUpperCase()
  }

  return (
    <>
      <div
        className="fixed inset-0 -z-10 opacity-25 blur-[1px]"
        style={{
          backgroundImage: "url('/images/background/lfl-background-edited.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <main className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="font-serif text-4xl font-bold tracking-tighter sm:text-5xl text-primary">
              Start a Journey
            </h1>
            <p className="text-muted-foreground text-lg italic font-serif max-w-2xl mx-auto">
              Search for your book, generate a unique tracking code, and write it on the inside
              cover before releasing it into the wild.
            </p>
          </div>

          <ParchmentFrame variant="wavy" className="w-full max-w-3xl mx-auto">
            {!generatedCode ? (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl font-bold text-center text-primary">
                    Select Your Book
                  </h2>
                  <GoogleBookSearch
                    onSelect={(book) => {
                      setSelectedBook(book)
                    }}
                  />
                </div>

                {selectedBook && (
                  <div className="bg-background/50 p-6 rounded-lg border border-primary/10 flex flex-col md:flex-row gap-6 items-center md:items-start animate-in fade-in zoom-in-95 duration-300">
                    {selectedBook.coverUrl ? (
                      <div className="relative w-32 h-48 shadow-md rounded-sm overflow-hidden flex-shrink-0">
                        <img
                          src={selectedBook.coverUrl}
                          alt={selectedBook.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-48 bg-muted flex items-center justify-center rounded-sm shadow-sm flex-shrink-0">
                        <span className="text-xs text-muted-foreground text-center px-2">
                          No Cover
                        </span>
                      </div>
                    )}

                    <div className="flex-1 space-y-4 text-center md:text-left w-full">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-primary">
                          {selectedBook.title}
                        </h3>
                        <p className="text-muted-foreground italic">
                          {selectedBook.authors?.join(", ") || "Unknown Author"}
                        </p>
                      </div>

                      <div className="pt-2">
                        <Button
                          onClick={handleGenerate}
                          disabled={isGenerating || !latitude}
                          className="w-full md:w-auto font-serif"
                          size="lg"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating Identity...
                            </>
                          ) : (
                            "Generate Tracking Code"
                          )}
                        </Button>
                        {!latitude && (
                          <p className="text-xs text-destructive mt-2">
                            Location access is required to generate a code.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-8 py-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                  <h2 className="font-serif text-3xl font-bold text-primary">Identity Assigned</h2>
                  <p className="text-muted-foreground italic">
                    Please write this code clearly on the inside cover.
                  </p>
                </div>

                <div className="relative p-8 border-4 border-double border-primary/20 bg-background/50 rounded-lg shadow-inner">
                  <p className="font-mono text-5xl md:text-6xl font-bold tracking-widest text-primary select-all">
                    {formatCode(generatedCode)}
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedCode("")
                    setSelectedBook(null)
                  }}
                >
                  Generate Another
                </Button>
              </div>
            )}
          </ParchmentFrame>
        </div>
      </main>
    </>
  )
}
