import { BookMetadata } from "./types"
import { OpenLibraryDoc, getBookCover } from "./openLibrary"

/**
 * Helper to parse metadata from different book sources (Google vs OpenLibrary)
 */
export function parseBookMetadata(bookData: BookMetadata) {
  let title = "Unknown Title"
  let author = "Unknown Author"
  let cover_url: string | null = null
  let isbn: string | null = null

  if (!bookData) {
    return { title, author, cover_url, isbn }
  }

  // Title
  if ("title" in bookData && bookData.title) {
    title = bookData.title
  }

  // Author
  // Google Books: authors[]
  if ("authors" in bookData && Array.isArray(bookData.authors) && bookData.authors.length > 0) {
    author = bookData.authors.join(", ")
  }
  // OpenLibrary: author_name[]
  else if (
    "author_name" in bookData &&
    Array.isArray(bookData.author_name) &&
    bookData.author_name.length > 0
  ) {
    author = bookData.author_name[0]
  }
  // Generic fallback if author is string (legacy/stub)
  else if ("author" in bookData && typeof (bookData as any).author === "string") {
    author = (bookData as any).author
  }

  // Cover
  if ("coverUrl" in bookData && bookData.coverUrl) {
    cover_url = bookData.coverUrl
  } else if ("cover_url" in bookData && bookData.cover_url) {
    cover_url = (bookData as any).cover_url
  }

  // OpenLibrary Logic (using getBookCover helper which expects OpenLibraryDoc)
  if (!cover_url && "cover_edition_key" in bookData) {
    // Cast is safe here because we checked for cover_edition_key presence which implies OpenLibraryDoc structure
    cover_url = getBookCover(bookData as OpenLibraryDoc) || null
  }

  // ISBN
  // Google Books: isbn (string)
  if ("isbn" in bookData && typeof bookData.isbn === "string") {
    isbn = bookData.isbn
  }
  // OpenLibrary: isbn[]
  else if ("isbn" in bookData && Array.isArray(bookData.isbn) && bookData.isbn.length > 0) {
    isbn = bookData.isbn[0]
  }

  return { title, author, cover_url, isbn }
}
