"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Sighting } from "@/lib/types" // Assuming we can use or extend this
import Image from "next/image"
import { useState, useEffect } from "react"

// We need an extended type because the basic Sighting type might not have the joined book data.
// Based on the query: .select('*, books(*)') -> returns 'books' property or .select('*, book:books(*)') returns 'book'
// The user request example had .select('*, books(*)')
// I'll assume we map it to a comfortable structure or use the raw result.
// Let's define the prop type clearly.

export type SightingWithBook = Sighting & {
  book: {
    title: string
    author: string
    cover_url?: string
  } | null
}
// Note: Supabase join via books(*) usually returns an object if it's many-to-one, or array if one-to-many.
// sightings.book_id -> books.id. This is Many-to-One (Sighting belongs to Book).
// So 'books' should be a single object (or null).

interface LedgerListProps {
  sightings: SightingWithBook[]
}

export function LedgerList({ sightings }: LedgerListProps) {
  const [displayedSightings, setDisplayedSightings] = useState<SightingWithBook[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // If we've shown all sightings, stop.
    if (currentIndex >= sightings.length) return

    const timer = setInterval(() => {
      setDisplayedSightings((prev) => {
        const nextItem = sightings[currentIndex]
        // Prepend new item to appear at the top
        return [nextItem, ...prev]
      })
      setCurrentIndex((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(timer)
  }, [currentIndex, sightings])

  return (
    <div className="w-full h-[500px] flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-xl border shadow-xl overflow-hidden">
      <div className="p-4 border-b bg-muted/50">
        <h2 className="font-serif text-xl font-bold">Recent Sightings</h2>
        <p className="text-xs text-muted-foreground">Live activity from the community</p>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pr-4">
          {displayedSightings.map((sighting) => {
            // Handle case where book might is missing or joined differently, but typing helps.
            const book = sighting.book
            if (!book) return null

            return (
              <div
                key={sighting.id}
                className="flex flex-row gap-4 items-start pb-4 border-b last:border-0 last:pb-0 animate-in slide-in-from-top-4 fade-in duration-700"
              >
                <div className="relative w-[50px] h-[75px] flex-shrink-0 shadow-sm rounded overflow-hidden bg-muted">
                  <Image
                    src={book.cover_url || "https://placehold.co/40x60?text=No+Cover"}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="50px"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                  <p className="text-[10px] text-muted-foreground/70 uppercase tracking-widest mt-1">
                    {new Date(sighting.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )
          })}
          {displayedSightings.length === 0 && (
            <div className="text-center text-muted-foreground py-8 animate-pulse">
              Listening for drops...
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
