import { POST } from "@/app/api/books/generate/route"
import { NextResponse } from "next/server"

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, options) => ({
      status: options?.status || 200,
      json: async () => body,
      ...body,
    })),
  },
}))

// Mock next/headers
jest.mock("next/headers", () => ({
  cookies: jest.fn().mockReturnValue(
    Promise.resolve({
      getAll: jest.fn().mockReturnValue([]),
      get: jest.fn().mockReturnValue(undefined),
    })
  ),
}))

jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createRouteHandlerClient: jest.fn().mockReturnValue({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    },
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { id: "test-id" }, error: null }),
        }),
      }),
    }),
  }),
}))

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { id: "test-id" }, error: null }),
        }),
      }),
    }),
  }),
}))

jest.mock("@/lib/id_generator", () => ({
  generateBookId: jest.fn().mockResolvedValue("TEST-CODE"),
}))


jest.mock("@/lib/book-utils", () => ({
  parseBookMetadata: jest.fn().mockReturnValue({
    title: "Test Title",
    author: "Test Author",
    cover_url: "http://test.com/cover.jpg",
    isbn: "1234567890",
  }),
}))

jest.mock("@/lib/location-utils", () => ({
  getWhimsicalLocation: jest.fn().mockResolvedValue("Mock Town"),
}))

describe("POST /api/books/generate", () => {
  it("should generate a book code successfully", async () => {
    const request = new Request("http://localhost:3000/api/books/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    jest.spyOn(request, "json").mockResolvedValue({
      location: { lat: 40.7128, long: -74.006 },
      book: { title: "Test Book" },
      anonymousId: "anon-123",
    })

    const response = await POST(request)
    const data = await response.json()

    expect(data.code).toBe("TEST-CODE")
  })
})
