"use client"

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"
import L from "leaflet"
import { SightingWithBook } from "@/components/ledger-list"

function LocationMarker() {
  const [position, setPosition] = useState(L.latLng(0, 0))
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return position === null ? null : (
    <Marker
      position={position}
      icon={
        new L.Icon({
          iconUrl: "/images/maps/book-marker.png",
          iconRetinaUrl: "/images/maps/book-marker.png",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        })
      }
    >
      <Popup>You are here</Popup>
    </Marker>
  )
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

  return (
    <div className="h-[400px] w-full my-8 rounded-xl overflow-hidden border-4 border-[#8b4513] shadow-xl flex items-center justify-center bg-secondary">
      <MapContainer
        // Herndon Fortnightly Library - 38.97188332537304, -77.38713321966762
        center={[38.971, -77.387]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        {sightings.map((sighting) => {
          if (sighting.lat && sighting.lon) {
            return (
              <Marker key={sighting.id} position={[sighting.lat, sighting.lon]} icon={sightingIcon}>
                <Popup>
                  <div className="flex flex-col gap-1">
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
