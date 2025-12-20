import { OpenLibraryDoc } from "./openLibrary"

export type Book = {
  id: string
  code: string
  title: string
  author: string
  isbn?: string
  cover_url?: string
  location: string
  lat?: number
  lon?: number
  created_at: string
}

export type Sighting = {
  id: string
  book_id: string
  user_id: string | null
  anonymous_id?: string
  location: string
  lat?: number
  lon?: number
  sighting_type: string
  created_at: string
  user?: {
    email: string
  }
}

// Google Books API / Component format
export type GoogleBookData = {
  title: string
  authors?: string[]
  coverUrl?: string
  isbn?: string
  googleId?: string
}

// Union type for the API input
export type BookMetadata = OpenLibraryDoc | GoogleBookData

export type GenerateBookCodeRequest = {
  book: BookMetadata
  location: { lat: string | number; long: string | number }
  anonymousId?: string
}
