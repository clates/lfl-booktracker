"use client"

import dynamic from "next/dynamic"

const HomeMap = dynamic(() => import("@/components/home-map").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" />,
})

export function HomeMapWrapper() {
  return <HomeMap />
}
