"use client"

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"
import L from "leaflet"
import { SightingWithBook } from "@/components/ledger-list"

// MapUpdater component to handle map side-effects
function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMapEvents({})

  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      const lat = Number(center[0])
      const lng = Number(center[1])
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        map.flyTo([lat, lng], 13, {
          animate: true,
          duration: 1.5,
        })
      }
    }
  }, [center, map])

  return null
}

interface HomeMapProps {
  sightings: SightingWithBook[]
}

export default function HomeMap({ sightings }: HomeMapProps) {
  // Use a different icon for sightings if available, or the same one.
  // Using the standard book marker for sightings.
  const sightingIcon = new L.Icon({
    iconUrl: "/images/maps/book-marker.png",
    iconRetinaUrl: "/images/maps/book-marker.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  // Set default icon to our book icon
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconUrl: "/images/maps/book-marker.png",
      iconRetinaUrl: "/images/maps/book-marker.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })
  }, [])

  // Determine the newest sighting to fly to (which is at index 0 because of SightingsFeed prepend)
  const newestSighting = sightings[0]
  const flyToCenter =
    newestSighting && newestSighting.lat && newestSighting.lon
      ? ([newestSighting.lat, newestSighting.lon] as [number, number])
      : null

  return (
    <div className="h-[400px] w-full my-8 rounded-xl overflow-hidden border-4 border-[#8b4513] shadow-xl flex items-center justify-center bg-secondary">
      <MapContainer
        // Default center (Herndon)
        center={[38.971, -77.387]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
        <MapUpdater center={flyToCenter} />
        {sightings.map((sighting) => {
          if (sighting.lat && sighting.lon) {
            return (
              <Marker key={sighting.id} position={[sighting.lat, sighting.lon]} icon={sightingIcon}>
                <Popup>
                  <div
                    className="flex flex-col gap-1"
                    aria-label={`Location of ${sighting.book?.title}`}
                  >
                    <span className="font-bold text-sm">{sighting.book?.title}</span>
                    <span className="text-xs">{sighting.book?.author}</span>
                  </div>
                </Popup>
              </Marker>
            )
          }
          return null
        })}
      </MapContainer>
    </div>
  )
}
