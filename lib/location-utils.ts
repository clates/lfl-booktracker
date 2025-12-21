/**
 * Fetches a "whimsical" location name (suburb, town, city) from a lat/long pair
 * using OpenStreetMap's Nominatim API.
 *
 * This is used to obfuscate precise coordinates in public feeds.
 */
export async function getWhimsicalLocation(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
      {
        headers: {
          // Nominatim requires a User-Agent.
          "User-Agent": "LFL-BookTracker/1.0",
        },
        next: {
          // Cache for a long time to avoid rate limits on known coords
          revalidate: 86400,
        },
      }
    )

    if (!res.ok) {
      console.warn("Nominatim API Error:", res.status, res.statusText)
      return `${lat.toFixed(2)}, ${lon.toFixed(2)}`
    }

    const data = await res.json()

    // Extract just the suburb, neighborhood, or town as requested
    // Fallback to "The Wilds" if nothing specific found, or coordinate-ish hint
    const name =
      data.address?.suburb ||
      data.address?.town ||
      data.address?.city ||
      data.address?.village ||
      data.address?.county ||
      "The Wilds"

    return name
  } catch (error) {
    console.error("Failed to fetch whimsical location:", error)
    // Fallback to simplified coordinates
    return `${lat.toFixed(2)}, ${lon.toFixed(2)}`
  }
}
