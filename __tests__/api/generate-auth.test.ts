import { POST } from "@/app/api/books/generate/route"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Mock Supabase
jest.mock("@supabase/auth-helpers-nextjs", () => ({
    createRouteHandlerClient: jest.fn(),
}))

jest.mock("@supabase/supabase-js", () => ({
    createClient: jest.fn(() => ({
        from: jest.fn(() => ({
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn(() => ({
                        data: { id: "test-book-id" },
                        error: null,
                    })),
                })),
            })),
        })),
    })),
}))

// Mock Next.js headers
jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}))

// Mock internal libs
jest.mock("@/lib/id_generator", () => ({
    generateBookId: jest.fn().mockResolvedValue("TEST-CODE-123"),
}))
jest.mock("@/lib/book-utils", () => ({
    parseBookMetadata: jest.fn(() => ({
        title: "Test Book",
        author: "Test Author",
        cover_url: "http://example.com/cover.jpg",
        isbn: "1234567890",
    })),
}))

jest.mock("@/lib/location-utils", () => ({
    getWhimsicalLocation: jest.fn().mockResolvedValue("Mock Town"),
}))

describe("Generate API Auth", () => {
    const mockCookies = {
        getAll: jest.fn(),
        get: jest.fn(),
    }
    const mockSupabase = {
        auth: {
            getUser: jest.fn(),
            getSession: jest.fn(),
        },
        from: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockResolvedValue(mockCookies);
        (createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase);
        const { createClient } = require("@supabase/supabase-js");
        (createClient as jest.Mock).mockReturnValue(mockSupabase);

        // Default valid book generation mocks
        const mockInsertSightings = jest.fn().mockResolvedValue({ error: null });
        const mockInsertBooks = jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: { id: "book-123" }, error: null })
            })
        });

        mockSupabase.from.mockImplementation((table) => {
            if (table === 'books') {
                return { insert: mockInsertBooks }
            }
            if (table === 'sightings') {
                return { insert: mockInsertSightings }
            }
            return { select: jest.fn() }
        })

        // Attach to mockSupabase for easy access in tests (a bit hacky but works for this scope)
        // @ts-ignore
        mockSupabase._mockInsertSightings = mockInsertSightings;
        // @ts-ignore
        mockSupabase._mockInsertBooks = mockInsertBooks;
    })

    it("should capture user_id when user is authenticated via getUser", async () => {
        // Mock authenticated user
        const mockUser = { id: "user-123", email: "test@example.com" }
        mockSupabase.auth.getUser.mockResolvedValue({
            data: { user: mockUser },
            error: null,
        })

        const request = {
            json: jest.fn().mockResolvedValue({
                book: { title: "Test Book" },
                location: { lat: 10, long: 20 },
                anonymousId: "anon-123",
            }),
            url: "http://localhost/api/books/generate",
            headers: new Headers(),
        } as unknown as Request

        await POST(request)

        // Verify sightings insert includes user_id
        expect(mockSupabase.from).toHaveBeenCalledWith("sightings")
        // @ts-ignore
        expect(mockSupabase._mockInsertSightings).toHaveBeenCalled()
        // @ts-ignore
        const sightingInsertCall = mockSupabase._mockInsertSightings.mock.calls[0][0]
        expect(sightingInsertCall).toEqual(expect.objectContaining({
            user_id: "user-123",
            anonymous_id: null
        }))
    })

    it("should use anonymous_id when user is not authenticated", async () => {
        // Mock no user
        mockSupabase.auth.getUser.mockResolvedValue({
            data: { user: null },
            error: null,
        })

        const request = {
            json: jest.fn().mockResolvedValue({
                book: { title: "Test Book" },
                location: { lat: 10, long: 20 },
                anonymousId: "anon-123",
            }),
            url: "http://localhost/api/books/generate",
            headers: new Headers(),
        } as unknown as Request

        await POST(request)

        // Verify sightings insert includes anonymous_id and null user_id
        expect(mockSupabase.from).toHaveBeenCalledWith("sightings")
        // @ts-ignore
        expect(mockSupabase._mockInsertSightings).toHaveBeenCalled()
        // @ts-ignore
        const sightingInsertCall = mockSupabase._mockInsertSightings.mock.calls[0][0]
        expect(sightingInsertCall).toEqual(expect.objectContaining({
            user_id: null,
            anonymous_id: "anon-123"
        }))
    })
})
