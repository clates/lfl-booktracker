"use client"

import dynamic from "next/dynamic"
import { SightingWithBook } from "@/components/ledger-list"

const HomeMap = dynamic(() => import("@/components/home-map").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" />,
})

interface HomeMapWrapperProps {
  sightings: SightingWithBook[]
}

export function HomeMapWrapper({ sightings }: HomeMapWrapperProps) {
  return <HomeMap sightings={sightings} />
}
