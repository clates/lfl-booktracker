import { decodeGeoHash, encodeGeoHash } from '@/lib/geohash';

describe('geohash utility', () => {
  describe('encodeGeoHash', () => {
    it('encodes a coordinate within the hardcoded bounds', () => {
      // Bounds in code: lat 25-50, lon -125 to -65
      const lat = 37.7749; // San Francisco
      const lon = -122.4194;
      
      const hash = encodeGeoHash(lat, lon);
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(12);
    });

    it('generates consistent hashes', () => {
      const lat = 40.7128; // New York
      const lon = -74.0060;
      const hash1 = encodeGeoHash(lat, lon);
      const hash2 = encodeGeoHash(lat, lon);
      expect(hash1).toBe(hash2);
    });
  });

  describe('decodeGeoHash', () => {
    it('decodes a standard geohash correctly', () => {
      // "9q8yy" is a standard geohash. 
      // 9q8yy centers at roughly 37.75, -122.45 (San Francisco)
      
      const hash = '9q8yy';
      const result = decodeGeoHash(hash);
      
      // Standard decoding should give us coordinates back
      expect(result.latitude[2]).toBeCloseTo(37.76, 1);
      expect(result.longitude[2]).toBeCloseTo(-122.44, 1);
    });
  });
});
