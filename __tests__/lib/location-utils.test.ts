
import { getWhimsicalLocation } from "@/lib/location-utils"

// Mock global fetch
global.fetch = jest.fn()

describe("getWhimsicalLocation", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should return 'Near [Neighbourhood] in [City]' when both are present", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        address: {
          neighbourhood: "Cooktown",
          town: "Herndon",
          country: "United States",
        },
      }),
    })

    const result = await getWhimsicalLocation(38.9, -77.0)
    expect(result).toBe("Near Cooktown in Herndon")
    // Verify zoom level change
    expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("zoom=14"),
        expect.any(Object)
    )
  })

  it("should return 'Near [Neighbourhood]' when only neighbourhood is present", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        address: {
          suburb: "Suburbtown", // Using suburb as partial alias for neighbourhood logic
        },
      }),
    })

    const result = await getWhimsicalLocation(10, 20)
    expect(result).toBe("Near Suburbtown")
  })

  it("should return '[City]' when only city is present", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        address: {
          city: "Buffalo",
        },
      }),
    })

    const result = await getWhimsicalLocation(10, 20)
    expect(result).toBe("Buffalo")
  })

  it("should return 'The Wilds' when no relevant address parts are found", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        address: {
          country: "Nowhere Land",
        },
      }),
    })

    const result = await getWhimsicalLocation(0, 0)
    expect(result).toBe("The Wilds")
  })

  it("should return 'The Wilds' on fetch failure (api error)", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    })

    const result = await getWhimsicalLocation(0, 0)
    expect(result).toBe("The Wilds")
  })

  it("should return 'The Wilds' on network exception", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error("Network Error"))

    const result = await getWhimsicalLocation(0, 0)
    expect(result).toBe("The Wilds")
  })
})
