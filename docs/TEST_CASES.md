# Test Cases Reference

This document outlines the critical boundary conditions and edge cases verified by the implementation logic. These scenarios ensure the robustness of the Geohashing and ID Generation systems against "fencepost" errors and overflow conditions.

## 1. Geohash Encoding (`lib/geohash.ts`)

### 1.1 Coordinate Boundaries (Global)

| Scenario          | Input (Lat, Lon) | Expected Outcome             | Rationale                                           |
| :---------------- | :--------------- | :--------------------------- | :-------------------------------------------------- |
| **Max Positive**  | `90.0, 180.0`    | Valid "W" Prefix Hash        | Boundary inclusive (-90..90, -180..180).            |
| **Max Negative**  | `-90.0, -180.0`  | Valid "W" Prefix Hash        | Boundary inclusive.                                 |
| **Equator/Prime** | `0.0, 0.0`       | Valid "W" Prefix Hash        | Center point.                                       |
| **Out of Bounds** | `90.1, 0.0`      | `Error: Invalid coordinates` | Explicit validation prevents invalid geodetic data. |
| **Out of Bounds** | `0.0, -180.1`    | `Error: Invalid coordinates` | Explicit validation prevents invalid geodetic data. |

### 1.2 US Projection Bounding Box

Logic uses inclusive bounds: `[24.0, 50.0]` Lat, `[-125.0, -66.0]` Lon.

| Scenario           | Input (Lat, Lon)   | Expected Format | Rationale                                                      |
| :----------------- | :----------------- | :-------------- | :------------------------------------------------------------- |
| **US Bottom-Left** | `24.0, -125.0`     | 5-char (No "W") | Inclusive start of range.                                      |
| **US Top-Right**   | `50.0, -66.0`      | 5-char (No "W") | Inclusive end of range.                                        |
| **Just Outside**   | `23.99999, -125.0` | Starts with "W" | Valid coordinate, but falls back to generic global projection. |
| **Just Outside**   | `50.00001, -66.0`  | Starts with "W" | Valid coordinate, but falls back to generic global projection. |

## 2. ID Generation (`lib/id_generator.ts`)

### 2.1 Counter Rollover (Suffix Length)

The suffix generator switches from 3 characters (15-bit) to 4 characters (20-bit) at a specific threshold.

| Scenario       | Counter Value | Bit Length | Suffix Length | Logic Path                                         |
| :------------- | :------------ | :--------- | :------------ | :------------------------------------------------- |
| **Zero Start** | `0`           | 0          | 3 chars       | `counter < 32768` (True).                          |
| **Max 3-Char** | `32767`       | 15         | 3 chars       | `32767 < 32768` (True). (Mask `0x7FFF`).           |
| **Rollover**   | `32768`       | 16         | 4 chars       | `32768 < 32768` (False). Switches to 20-bit logic. |
| **Max 4-Char** | `1,048,575`   | 20         | 4 chars       | Masks to `0xFFFFF`.                                |

### 2.2 Bijective Property (Collision Checks)

The implementation uses a Modular Affine Cipher: `(x * P) ^ K`.

- **Prime (P)**: Must be coprime to usage size (32768 or 1048576) to ensure 1-to-1 mapping.
- **XOR Key (K)**: Can be any value, used for obfuscation.
- **Reversibility**: Since P is coprime to the modulus size (powers of 2), the function is a permutation in that domain, guaranteeing no collisions for unique counters within the range.

### 2.3 Limits and Overflow Safety

- **Max Safe Integer**: JS `Number.MAX_SAFE_INTEGER` (2^53 - 1) is significantly larger than the 20-bit logic (2^20).
- **Intermediate Overflow**: The PR review noted a concern about `counter * PRIME_20` overflowing 20 bits.
  - **Analysis**: `1,048,575 (20-bit max) * 486187 (PRIME) ≈ 5.09 * 10^11`. This is well within the Javascript Safe Integer limit (9 \* 10^15) and 32-bit Bitwise operation limit (2^31 - 1 for signed, 2^32 for unsigned >>>).
  - **Bitwise Truncation**: JS bitwise operators (`&`) implicitly convert operands to 32-bit integers. Since our max valid product fits in 40 bits (worst case) but our typical product fits in 39 bits? Actually `5 * 10^11` is approx `2^39`.
  - **Correction**: `5 * 10^11` exceeds 32 bits (`4.29 * 10^9`).
    - **Behavior**: JS `&` operator truncates the high bits.
    - **Impact**: We implicitly compute `(counter * PRIME) % 2^32` then `& 0xFFFFF` (mod 2^20).
    - **validity**: As long as the mapping remains bijective in the 20-bit domain, the loss of high bits strictly due to 32-bit truncation behaves as an additional modulo step.
    - **Verification**: `(x * P) mod 2^20` is the intended operation. `((x * P) mod 2^32) mod 2^20` is mathematically equivalent to `(x * P) mod 2^20`. Thus, **Logic is Safe**.

### 2.4 Input Normalization (`lib/geohash.ts`)

- **Function**: `normalizeGeoHash`
- **Mapping**:
  - `O` -> `0` (Zero)
  - `I` / `L` -> `1` (One)
  - All other non-alphanumeric removed.
- **Rationale**: Crockford Base32 excludes I/L/O to avoid visual confusion. This function allows users to type them safely by mapping to their visual lookalikes.

## 3. Security Boundaries

- **Access Control**: `grid_counters` table has RLS enabled.
- **Write Access**: No `INSERT` or `UPDATE` policies exist for users.
- **Implicit Deny**: Postgres RLS denies all operations not explicitly permitted. Thus, users **cannot** bypass the `increment_counter` RPC to modify the table directly.
