import { adminSupabase } from './supabase-admin';
import { encodeGeoHash, BASE32 } from './geohash';

// Constants for obfuscation
// Coprime to 32768 (2^15)
const PRIME = 20219;
// XOR Mask
const XOR_KEY = 14325;
// Modulus for 3-char base32
const MODULUS_15BIT = 32768;

function toBase32(num: number, length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result = BASE32[num % 32] + result;
    num = Math.floor(num / 32);
  }
  return result;
}

export function generateSuffix(counter: number): string {
  // If counter fits in 3 chars (15 bits)
  if (counter < MODULUS_15BIT) {
    // Bijective Map: (x * P) ^ K
    // We mask to 15 bits to ensure we stay in range
    let val = (counter * PRIME) & 0x7fff;
    val = val ^ XOR_KEY;
    return toBase32(val, 3);
  } else {
    // Determine 4-char needs.
    // 4 chars = 20 bits = 1,048,576
    // We can use a different prime/xor or just standard base32 for simplicity in overflow
    // or extend the cipher.
    // Let's extend the cipher lightly to 20 bits.
    const PRIME_20 = 486187; // Large prime fitting in 20 bits
    const XOR_20 = 786433;
    let val = (counter * PRIME_20) & 0xfffff;
    val = val ^ XOR_20;
    return toBase32(val, 4);
  }
}

export async function generateBookId(lat: number, lon: number): Promise<string> {
  // 1. Calculate Prefix
  const prefix = encodeGeoHash(lat, lon);

  // 2. Get Atomic Counter from DB
  const { data: counter, error } = await adminSupabase.rpc('increment_counter', {
    prefix_in: prefix,
  });

  if (error) {
    console.error('Error generating ID counter:', error);
    throw new Error('Failed to generate Book ID');
  }

  // 3. Generate Suffix
  const suffix = generateSuffix(counter as number);

  // 4. Combine
  return `${prefix}-${suffix}`;
}
