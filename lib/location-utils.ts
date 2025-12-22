/**
 * Fetches a "whimsical" location name (suburb, town, city) from a lat/long pair
 * using OpenStreetMap's Nominatim API.
 *
 * This is used to obfuscate precise coordinates in public feeds.
 */
export async function getWhimsicalLocation(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14`,
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
      return "The Wilds"
    }

    const data = await res.json()
    const addr = data.address || {}

    // Extract relevant parts
    const neighbourhood = addr.neighbourhood || addr.suburb || addr.quarter
    const city = addr.town || addr.city || addr.village || addr.municipality 
    const county = addr.county
    
    // Format: "Near [Neighbourhood] in [City]" or just "[City]"
    let name = "The Wilds"

    if (neighbourhood && city) {
      name = `Near ${neighbourhood} in ${city}`
    } else if (neighbourhood) {
      name = `Near ${neighbourhood}`
    } else if (city) {
      name = city
    } else if (county) {
      name = county
    }

    return name
  } catch (error) {
    console.error("Failed to fetch whimsical location:", error)
    return "The Wilds"
  }
}
