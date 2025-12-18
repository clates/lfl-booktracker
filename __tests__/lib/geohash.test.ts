import { encodeGeoHash, normalizeGeoHash } from '@/lib/geohash';

describe('geohash utility', () => {
  describe('encodeGeoHash', () => {
    it('encodes a coordinate within US bounds (5 chars, no W)', () => {
      // US Bounds: 24-50, -125 to -66
      const lat = 37.7749; // San Francisco
      const lon = -122.4194;

      const hash = encodeGeoHash(lat, lon);
      expect(hash.length).toBe(5);
      expect(hash.startsWith('W')).toBe(false);
    });

    it('encodes a coordinate outside US bounds (W + 4 chars)', () => {
      // London (Outside US)
      const lat = 51.5074;
      const lon = -0.1278;

      const hash = encodeGeoHash(lat, lon);
      expect(hash.length).toBe(5); // W + 4
      expect(hash.startsWith('W')).toBe(true);
    });

    it('throws error for invalid coordinates', () => {
      expect(() => encodeGeoHash(91, 0)).toThrow('Invalid coordinates');
      expect(() => encodeGeoHash(0, -181)).toThrow('Invalid coordinates');
    });

    it('handles US boundary conditions correctly', () => {
      // Exact US Bottom-Left: 24.0, -125.0
      expect(encodeGeoHash(24.0, -125.0).startsWith('W')).toBe(false);

      // Just Outside US Bottom-Left: 23.99, -125.0
      expect(encodeGeoHash(23.99, -125.0).startsWith('W')).toBe(true);
    });
  });

  describe('normalizeGeoHash', () => {
    it('normalizes O to 0', () => {
      expect(normalizeGeoHash('W0RD')).toBe('W0RD');
      expect(normalizeGeoHash('WORD')).toBe('W0RD');
    });

    it('normalizes I and L to 1', () => {
      expect(normalizeGeoHash('L1FE')).toBe('11FE');
      expect(normalizeGeoHash('I1FE')).toBe('11FE');
    });

    it('removes non-alphanumeric characters', () => {
      expect(normalizeGeoHash('A-B-C')).toBe('ABC');
      expect(normalizeGeoHash('A B C')).toBe('ABC');
    });

    it('converts to uppercase', () => {
      expect(normalizeGeoHash('abc')).toBe('ABC');
    });
  });
});
