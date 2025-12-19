// Mock Supabase and Next.js dependencies
const mockExchangeCodeForSession = jest.fn()
const mockSupabase = {
  auth: {
    exchangeCodeForSession: mockExchangeCodeForSession,
  },
}

jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createRouteHandlerClient: jest.fn(() => mockSupabase),
}))

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}))

jest.mock("next/server", () => {
  const actualModule = jest.requireActual("next/server")

  // Create a custom Response class that properly supports the url property
  class MockNextResponse extends global.Response {
    constructor(body, init = {}) {
      super(body, init)
      // Store the redirect URL if provided
      if (init.url) {
        this.url = init.url
      }
    }

    static redirect(url, init) {
      return new MockNextResponse(null, {
        ...init,
        status: 307,
        headers: { Location: url },
        url: url, // Explicitly set the url property
      })
    }
  }

  return {
    ...actualModule,
    NextResponse: MockNextResponse,
  }
})

import { GET } from "@/app/auth/callback/route"

describe("GET /auth/callback", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("exchanges code for session when code is provided", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ data: { session: {} }, error: null })

    const request = new Request("http://localhost:3000/auth/callback?code=test-auth-code")

    await GET(request)

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("test-auth-code")
  })

  it("redirects to origin after successful code exchange", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ data: { session: {} }, error: null })

    const request = new Request("http://localhost:3000/auth/callback?code=test-auth-code")

    const response = await GET(request)

    // Check status code which should be 307 for redirect
    expect(response.status).toBe(307)
    // Check Location header (NextResponse.redirect adds trailing slash to origin)
    expect(response.headers.get("Location")).toBe("http://localhost:3000")
  })

  it("skips code exchange when code parameter is missing", async () => {
    const request = new Request("http://localhost:3000/auth/callback")

    await GET(request)

    expect(mockExchangeCodeForSession).not.toHaveBeenCalled()
  })

  it("redirects to origin even when code parameter is missing", async () => {
    const request = new Request("http://localhost:3000/auth/callback")

    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(response.headers.get("Location")).toBe("http://localhost:3000")
  })

  it("handles code exchange errors gracefully", async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      data: null,
      error: { message: "Invalid code" },
    })

    const request = new Request("http://localhost:3000/auth/callback?code=invalid-code")

    const response = await GET(request)

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith("invalid-code")
    expect(response.status).toBe(307)
    expect(response.headers.get("Location")).toBe("http://localhost:3000")
  })

  it("preserves origin URL with different domains", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ data: { session: {} }, error: null })

    const request = new Request("https://example.com/auth/callback?code=test-code")

    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(response.headers.get("Location")).toBe("https://example.com")
  })

  it("preserves origin URL with different ports", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ data: { session: {} }, error: null })

    const request = new Request("http://localhost:8080/auth/callback?code=test-code")

    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(response.headers.get("Location")).toBe("http://localhost:8080")
  })
})
