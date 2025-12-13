// geohash.ts
// Geohash library for Javascript (Modified for LFL Tracker)
// Original: (c) 2008 David Troy
// Distributed under the MIT License

export const BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const BITS = [16, 8, 4, 2, 1];

// Continental US Bounding Box
const US_LAT_MIN = 24.0;
const US_LAT_MAX = 50.0;
const US_LON_MIN = -125.0;
const US_LON_MAX = -66.0;

export function encodeGeoHash(latitude: number, longitude: number): string {
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error(`Invalid coordinates: lat=${latitude}, lon=${longitude}`);
  }

  // Check if within Continental US
  if (
    latitude >= US_LAT_MIN &&
    latitude <= US_LAT_MAX &&
    longitude >= US_LON_MIN &&
    longitude <= US_LON_MAX
  ) {
    return encode(
      latitude,
      longitude,
      US_LAT_MIN,
      US_LAT_MAX,
      US_LON_MIN,
      US_LON_MAX,
      5
    );
  } else {
    // Rest of World: Prefix 'W' + 4 char standard global hash
    // Standard Bounds: Lat -90..90, Lon -180..180
    const suffix = encode(latitude, longitude, -90, 90, -180, 180, 4);
    return "W" + suffix;
  }
}

function encode(
  latitude: number,
  longitude: number,
  minLat: number,
  maxLat: number,
  minLon: number,
  maxLon: number,
  precision: number
): string {
  let is_even = true;
  let lat_interval = [minLat, maxLat];
  let lon_interval = [minLon, maxLon];
  let bit = 0;
  let ch = 0;
  let geohash = "";

  while (geohash.length < precision) {
    if (is_even) {
      const mid = (lon_interval[0] + lon_interval[1]) / 2;
      if (longitude > mid) {
        ch |= BITS[bit];
        lon_interval[0] = mid;
      } else {
        lon_interval[1] = mid;
      }
    } else {
      const mid = (lat_interval[0] + lat_interval[1]) / 2;
      if (latitude > mid) {
        ch |= BITS[bit];
        lat_interval[0] = mid;
      } else {
        lat_interval[1] = mid;
      }
    }

    is_even = !is_even;
    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return geohash;
}

// Helper to normalize user input (O->0, I/L->1)
export function normalizeGeoHash(input: string): string {
  return input
    .toUpperCase()
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1")
    .replace(/[^0-9A-Z]/g, ""); // Strip non-alphanumeric
}
