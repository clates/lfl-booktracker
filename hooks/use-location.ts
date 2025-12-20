import { useState, useEffect } from "react"

interface Location {
  latitude: number | null
  longitude: number | null
  error: string | null
}

const useLocation = () => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    error: null,
  })

  const getLocation = (startWithHighAccuracy = false) => {
    // Reset error state on retry
    setLocation((prev) => ({ ...prev, error: null }))

    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: "Geolocation is not supported by this browser." }))
      return
    }

    const attemptGetLocation = (highAccuracy: boolean) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          })
        },
        (error) => {
          if (!highAccuracy) {
            // If low accuracy failed, try high accuracy
            console.log("Low accuracy location failed, retrying with high accuracy...")
            attemptGetLocation(true)
          } else {
            // Both failed
            setLocation((prev) => ({ ...prev, error: `Error getting location: ${error.message}` }))
          }
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: 20000,
          maximumAge: 0,
        }
      )
    }

    // Start with low accuracy, unless forced to high
    attemptGetLocation(startWithHighAccuracy)
  }

  useEffect(() => {
    getLocation()
  }, [])

  return { ...location, refetch: () => getLocation(true) }
}

export default useLocation
