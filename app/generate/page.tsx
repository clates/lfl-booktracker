"use client"

import { useState, useEffect } from "react"
import { ParchmentFrame } from "@/components/ui/parchment-frame"
import { GoogleBookSearch } from "@/components/google-book-search"
import { useToast } from "@/hooks/use-toast"
import useLocation from "@/hooks/use-location"
import { Loader2 } from "lucide-react"

export default function GeneratePage() {
  const [selectedBook, setSelectedBook] = useState<{
    title: string
    authors?: string[]
    coverUrl?: string
  } | null>(null)

  const [generatedCode, setGeneratedCode] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()
  const { latitude, longitude } = useLocation()

  function getCookie(name: string) {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift()
    return null
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
      // Get anonymous ID if exists
      const anonymousId = getCookie("anonymousId")
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
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex gap-6 p-4 bg-muted/30 rounded-lg border border-primary/10">
                      {selectedBook.coverUrl && (
                        <img
                          src={selectedBook.coverUrl}
                          alt={selectedBook.title}
                          className="w-24 h-36 object-cover rounded shadow-md"
                        />
                      )}
                      <div className="space-y-2">
                        <h3 className="font-serif text-xl font-semibold">{selectedBook.title}</h3>
                        <p className="text-muted-foreground">{selectedBook.authors?.join(", ")}</p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !latitude}
                        className="px-8 py-3 bg-primary text-primary-foreground font-serif text-lg rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Forging Code...
                          </>
                        ) : !latitude ? (
                          "Waiting for Location..."
                        ) : (
                          "Generate Tracking Code"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl font-bold text-primary">
                    Your Book is Ready!
                  </h2>
                  <p className="text-muted-foreground">
                    Write this code clearly on the inside cover of your book:
                  </p>
                </div>

                <div className="py-8 px-6 bg-muted/50 rounded-xl border-2 border-dashed border-primary/20">
                  <p className="font-mono text-4xl sm:text-5xl font-bold tracking-widest text-primary select-all">
                    {generatedCode}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setGeneratedCode("")
                    setSelectedBook(null)
                  }}
                  className="text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors"
                >
                  Register another book
                </button>
              </div>
            )}
          </ParchmentFrame>
        </div>
      </main>
    </>
  )
}
