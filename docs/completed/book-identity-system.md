# Book Identity System - Retrospective

## 1. Requirements (The "Why" and "What")

### Problem Statement

The initial implementation attempted to generate a unique book ID by hashing the book's location coordinates.

- **Critical Flaw**: Hashing static data (location) produces identical outputs for identical inputs, leading to duplicate IDs for books at the same library.
- **Uniqueness**: No distinction between books at the same location.

### Solution Requirements

Decouple "Location Identity" from "Book Identity" to create a composite string: `[GeoPrefix] - [ObfuscatedSuffix]`.

- **Part A: GeoPrefix (Location)**
  - Identifies the specific neighborhood grid cell (~0.4 mile resolution).
  - **Algorithm**: Custom Projected GeoHash (Z-order curve) using Crockford Base32.
  - **Projections**:
    - **Continental US**: Custom bounding box (Lat 24-50, Lon -125 to -66) for ~0.4 mile resolution.
    - **Rest of World**: Standard Global Bounds, prefixed with `W`.

- **Part B: Suffix (Identity)**
  - Identifies the specific book within that grid cell.
  - **Algorithm**: Bijective Map (Modular Affine Cipher) on a sequential counter.
  - **Appearance**: Random/Obfuscated to the user (`1` -> `XAH`).

## 2. Implementation Decisions (The "How")

### Database Schema

- **New Table**: `grid_counters`
  - Stores the latest sequence number for each `prefix` (grid cell).
  - `prefix` (PK), `counter` (Int).
- **Atomic Operation**:
  - Created `increment_counter(prefix)` stored procedure (RPC) to handle concurrency.
  - Uses `ON CONFLICT DO UPDATE` (Upsert) logic to ensure thread safety.

### Backend Logic (`lib/`)

- **GeoHash (`lib/geohash.ts`)**:
  - Implemented `encodeGeoHash` with the custom US bounding box.
  - Enforced Crockford Base32 `0123456789ABCDEFGHJKMNPQRSTVWXYZ`.
- **ID Generator (`lib/id_generator.ts`)**:
  - **Bijective Map Parameters**:
    - `PRIME`: 20219 (Coprime to 32768)
    - `XOR_KEY`: 14325
    - `MODULUS`: 32768 (15-bit, 3 chars in Base32)
  - **Overflow Handling**:
    - If counter > 32768, logic automatically expands to a 4-character suffix using a larger prime/modulus (20-bit).

### Frontend Integration

- **Endpoint**: `/api/books/generate`
- **User Feedback**: Updated UI messages to explicitly state "ID Generated Successfully" instead of generic "Hit recorded".

## 3. Retrospective

### Success Criteria Met

- [x] **Uniqueness**: IDs are guaranteed unique per location via DB sequence.
- [x] **Locality**: Prefix `W6PSK` correctly identifies a specific neighborhood.
- [x] **Usability**: IDs are short (8 chars) and use a typo-resistant alphabet.

### Lessons Learned

- **Documentation**: Keeping requirements alongside implementation plans helped verify the final logic efficiently.
- **Verification**: Writing a standalone script for the bijective map logic was crucial to verify collision resistance without needing a full DB setup during development.
