"use client"

import { useState, useEffect } from "react"
import { BookOpen, Loader2, MapPin } from "lucide-react"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { GoogleBookSearch } from "@/components/google-book-search"
import { ParchmentFrame } from "@/components/ui/parchment-frame"
import { useToast } from "@/hooks/use-toast"
import useLocation from "@/hooks/use-location"

export function AddSightingDrawer() {
  const [open, setOpen] = useState(false)
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

  // Ensure anonymous ID cookie exists
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

  function formatCode(code: string) {
    return `${code.slice(0, 4)}-${code.slice(4, 6)}-${code.slice(6, 9)}`.toUpperCase()
  }

  function resetState() {
    setGeneratedCode("")
    setSelectedBook(null)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="text-center cursor-pointer group">
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 group-hover:text-primary transition-colors">
            Can&apos;t find your book?
            <span className="font-semibold underline underline-offset-2">Register it here</span>
          </p>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-xl">
          <DrawerHeader>
            <DrawerTitle className="font-serif text-2xl text-center">
              Register a New Book
            </DrawerTitle>
            <DrawerDescription className="text-center">
              Generate a unique tracking code for your book to start its journey.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0">
            <ParchmentFrame variant="default" className="w-full">
              {!generatedCode ? (
                <div className="space-y-6">
                  {!selectedBook ? (
                    <div className="space-y-4">
                      <h3 className="font-serif text-lg font-semibold text-center text-primary/80">
                        Search for your book
                      </h3>
                      <GoogleBookSearch onSelect={setSelectedBook} />
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="flex gap-4 p-3 bg-muted/40 rounded-lg border border-primary/10 items-start">
                        {selectedBook.coverUrl ? (
                          <img
                            src={selectedBook.coverUrl}
                            alt={selectedBook.title}
                            className="w-16 h-24 object-cover rounded shadow-sm shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-24 bg-muted flex items-center justify-center rounded shadow-sm shrink-0">
                            <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                          </div>
                        )}
                        <div className="space-y-1 min-w-0">
                          <h3 className="font-serif font-semibold leading-tight line-clamp-2">
                            {selectedBook.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {selectedBook.authors?.join(", ")}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive mt-1"
                            onClick={() => setSelectedBook(null)}
                          >
                            Change book
                          </Button>
                        </div>
                      </div>

                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !latitude}
                        className="w-full font-serif text-lg shadow-md"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Forging Code...
                          </>
                        ) : !latitude ? (
                          <>
                            <MapPin className="mr-2 h-5 w-5 animate-pulse" />
                            Locating you...
                          </>
                        ) : (
                          "Generate Tracking Code"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 text-center animate-in zoom-in-95 duration-500 py-2">
                  <div className="space-y-2">
                    <h2 className="font-serif text-xl font-bold text-primary">
                      Ready for Adventure!
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Write this code on the inside cover:
                    </p>
                  </div>

                  <div className="py-6 px-4 bg-white/50 rounded-lg border-2 border-dashed border-primary/20 backdrop-blur-sm">
                    <p className="font-mono text-3xl font-bold tracking-widest text-primary select-all">
                      {formatCode(generatedCode)}
                    </p>
                  </div>

                  <Button variant="outline" onClick={resetState} className="mt-2">
                    Register another book
                  </Button>
                </div>
              )}
            </ParchmentFrame>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                onClick={() => {
                  // Optional: reset state on close if desired, but user might want to keep it open
                  // For now, let's just close.
                }}
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
