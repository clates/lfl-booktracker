# Test Cases Reference

This document outlines the critical boundary conditions and edge cases verified by the implementation logic. These scenarios ensure the robustness of the Geohashing and ID Generation systems against "fencepost" errors and overflow conditions.

## 1. Geohash Encoding (`lib/geohash.ts`)

### 1.1 Coordinate Boundaries (Global)
| Scenario | Input (Lat, Lon) | Expected Outcome | Rationale |
| :--- | :--- | :--- | :--- |
| **Max Positive** | `90.0, 180.0` | Valid "W" Prefix Hash | Boundary inclusive (-90..90, -180..180). |
| **Max Negative** | `-90.0, -180.0` | Valid "W" Prefix Hash | Boundary inclusive. |
| **Equator/Prime** | `0.0, 0.0` | Valid "W" Prefix Hash | Center point. |
| **Out of Bounds** | `90.1, 0.0` | `Error: Invalid coordinates` | Explicit validation prevents invalid geodetic data. |
| **Out of Bounds** | `0.0, -180.1` | `Error: Invalid coordinates` | Explicit validation prevents invalid geodetic data. |

### 1.2 US Projection Bounding Box
Logic uses inclusive bounds: `[24.0, 50.0]` Lat, `[-125.0, -66.0]` Lon.

| Scenario | Input (Lat, Lon) | Expected Format | Rationale |
| :--- | :--- | :--- | :--- |
| **US Bottom-Left** | `24.0, -125.0` | 5-char (No "W") | Inclusive start of range. |
| **US Top-Right** | `50.0, -66.0` | 5-char (No "W") | Inclusive end of range. |
| **Just Outside** | `23.99999, -125.0` | Starts with "W" | Valid coordinate, but falls back to generic global projection. |
| **Just Outside** | `50.00001, -66.0` | Starts with "W" | Valid coordinate, but falls back to generic global projection. |

## 2. ID Generation (`lib/id_generator.ts`)

### 2.1 Counter Rollover (Suffix Length)
The suffix generator switches from 3 characters (15-bit) to 4 characters (20-bit) at a specific threshold.

| Scenario | Counter Value | Bit Length | Suffix Length | Logic Path |
| :--- | :--- | :--- | :--- | :--- |
| **Zero Start** | `0` | 0 | 3 chars | `counter < 32768` (True). |
| **Max 3-Char** | `32767` | 15 | 3 chars | `32767 < 32768` (True). (Mask `0x7FFF`). |
| **Rollover** | `32768` | 16 | 4 chars | `32768 < 32768` (False). Switches to 20-bit logic. |
| **Max 4-Char** | `1,048,575` | 20 | 4 chars | Masks to `0xFFFFF`. |

### 2.2 Bijective Property (Collision Checks)
The implementation uses a Modular Affine Cipher: `(x * P) ^ K`.
- **Prime (P)**: Must be coprime to usage size (32768 or 1048576) to ensure 1-to-1 mapping.
- **XOR Key (K)**: Can be any value, used for obfuscation.
- **Reversibility**: Since P is coprime to the modulus size (powers of 2), the function is a permutation in that domain, guaranteeing no collisions for unique counters within the range.

### 2.3 Limits
- **Max Safe Integer**: JS `Number.MAX_SAFE_INTEGER` (2^53 - 1) is significantly larger than the 20-bit logic (2^20). Code handles larger numbers by default, but suffix length logic would need extension if counters exceed ~1 million per 1km grid square (highly unlikely).
