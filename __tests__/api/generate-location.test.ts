import { POST } from "@/app/api/books/generate/route"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { getWhimsicalLocation } from "@/lib/location-utils"

// Mock Supabase
jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createRouteHandlerClient: jest.fn(),
}))

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(), // We won't strictly test the admin client anymore as we switched to route handler client
  })),
}))

// Mock Next.js headers
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}))

// Mock internal libs
jest.mock("@/lib/id_generator", () => ({
  generateBookId: jest.fn().mockResolvedValue("TEST-CODE-LOC"),
}))
jest.mock("@/lib/book-utils", () => ({
  parseBookMetadata: jest.fn(() => ({
    title: "Test Book Location",
    author: "Test Author",
    cover_url: "http://example.com/cover.jpg",
    isbn: "0000000001",
  })),
}))

// Mock location utils specifically to verify usage
jest.mock("@/lib/location-utils", () => ({
  getWhimsicalLocation: jest.fn(),
}))

describe("Generate API Location Privacy", () => {
  const mockCookies = {
    getAll: jest.fn(),
    get: jest.fn(),
  }
  const mockSupabase = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(cookies as jest.Mock).mockResolvedValue(mockCookies)
    ;(createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase)
    ;(getWhimsicalLocation as jest.Mock).mockResolvedValue("Whimsical Town, USA")

    // Mock auth
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-loc-123" } },
      error: null,
    })

    // Mock DB calls
    const mockInsertSightings = jest.fn().mockResolvedValue({ error: null })
    const mockInsertBooks = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: { id: "book-loc-123" }, error: null }),
      }),
    })

    mockSupabase.from.mockImplementation((table) => {
      if (table === "books") return { insert: mockInsertBooks }
      if (table === "sightings") return { insert: mockInsertSightings }
      return { select: jest.fn() }
    })

    // Attach helper to access mocks
    // @ts-ignore
    mockSupabase._mockInsertBooks = mockInsertBooks
    // @ts-ignore
    mockSupabase._mockInsertSightings = mockInsertSightings
  })

  it("should use whimsical location instead of raw coordinates in DB inserts", async () => {
    const request = {
      json: jest.fn().mockResolvedValue({
        book: { title: "Test Book" },
        location: { lat: 38.9, long: -77.0 },
        anonymousId: "anon-loc-123",
      }),
      url: "http://localhost/api/books/generate",
    } as unknown as Request

    await POST(request)

    // Verify getWhimsicalLocation was called with correct coords
    expect(getWhimsicalLocation).toHaveBeenCalledWith(38.9, -77.0)

    // Verify Books Insert
    // @ts-ignore
    const bookInsertCall = mockSupabase._mockInsertBooks.mock.calls[0][0]
    expect(bookInsertCall.location).toBe("Whimsical Town, USA")
    // Ensure we still store raw coords for mapping
    expect(bookInsertCall.lat).toBe(38.9)
    expect(bookInsertCall.lon).toBe(-77.0)

    // Verify Sightings Insert
    // @ts-ignore
    const sightingInsertCall = mockSupabase._mockInsertSightings.mock.calls[0][0]
    expect(sightingInsertCall.location).toBe("Whimsical Town, USA")
    expect(sightingInsertCall.lat).toBe(38.9)
    expect(sightingInsertCall.lon).toBe(-77.0)
  })
})
