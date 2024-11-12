import { OpenLibraryDoc } from "./openLibrary";

export type Book = {
  id: string;
  code: string;
  title: string;
  author: string;
  location: string;
  created_at: string;
};

export type Sighting = {
  id: string;
  book_id: string;
  user_id: string;
  location: string;
  created_at: string;
  user: {
    email: string;
  };
};

export type GenerateBookCodeRequest = {
  book: OpenLibraryDoc;
  location: { lat: string | number; long: string | number };
}