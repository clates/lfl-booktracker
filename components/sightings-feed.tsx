"use client"

import { useState, useEffect } from "react"
import { SightingWithBook, LedgerList } from "@/components/ledger-list"
import { HomeMapWrapper } from "@/components/home-map-wrapper"

interface SightingsFeedProps {
  initialSightings: SightingWithBook[]
}

export function SightingsFeed({ initialSightings }: SightingsFeedProps) {
  const [displayedSightings, setDisplayedSightings] = useState<SightingWithBook[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const SIGHTING_DISPLAY_INTERVAL_MS = 5000

    // If we've shown all sightings, stop.
    if (currentIndex >= initialSightings.length) return

    const timer = setInterval(() => {
      const nextItem = initialSightings[currentIndex]

      if (nextItem) {
        setDisplayedSightings((prevSightings) => {
          // Prevent duplicates
          if (prevSightings.some((s) => s.id === nextItem.id)) {
            return prevSightings
          }
          return [nextItem, ...prevSightings]
        })
      }

      setCurrentIndex((prev) => prev + 1)
    }, SIGHTING_DISPLAY_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [currentIndex, initialSightings])

  return (
    <div className="container flex flex-col lg:flex-row mx-auto px-4 gap-8 lg:gap-16 py-8">
      <div className="w-full lg:w-2/3">
        {/* Map takes up more space on desktop */}
        <HomeMapWrapper sightings={displayedSightings} />
      </div>
      <div className="w-full lg:w-1/3 flex flex-col justify-center">
        {/* Ledger list on the side */}
        <LedgerList sightings={displayedSightings} />
      </div>
    </div>
  )
}
