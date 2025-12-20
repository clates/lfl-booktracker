import { parseBookMetadata } from "@/lib/book-utils"
import { BookMetadata } from "@/lib/types"

describe("parseBookMetadata", () => {
  it("should parse Google Books data correctly", () => {
    const googleBook: BookMetadata = {
      title: "Google Book Title",
      authors: ["Author One", "Author Two"],
      coverUrl: "http://example.com/cover.jpg",
      isbn: "1234567890",
      googleId: "g1",
    }

    const result = parseBookMetadata(googleBook)

    expect(result).toEqual({
      title: "Google Book Title",
      author: "Author One, Author Two",
      cover_url: "http://example.com/cover.jpg",
      isbn: "1234567890",
    })
  })

  it("should parse OpenLibrary data correctly", () => {
    const olBook: BookMetadata = {
      title: "OL Book Title",
      author_name: ["OL Author"],
      cover_edition_key: "OL123M",
      isbn: ["0987654321"],
      key: "/works/OL123W",
      // Force type to satisfy simplified mock if needed, but the structure matches
      edition_key: ["OL123M"],
      publish_year: [2021],
    } as any // Cast as any because OpenLibraryDoc has many required fields

    const result = parseBookMetadata(olBook)

    expect(result).toEqual({
      title: "OL Book Title",
      author: "OL Author",
      cover_url: "https://covers.openlibrary.org/b/olid/OL123M-M.jpg", // Expecting getBookCover logic
      isbn: "0987654321",
    })
  })

  it("should handle missing optional fields gracefully", () => {
    const minimalBook: BookMetadata = {
      title: "Minimal Book",
    } as any

    const result = parseBookMetadata(minimalBook)

    expect(result).toEqual({
      title: "Minimal Book",
      author: "Unknown Author",
      cover_url: null,
      isbn: null,
    })
  })

  it("should return defaults for null input", () => {
    const result = parseBookMetadata(null as any)
    expect(result).toEqual({
      title: "Unknown Title",
      author: "Unknown Author",
      cover_url: null,
      isbn: null,
    })
  })
})
