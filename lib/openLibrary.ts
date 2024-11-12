export type OpenLibraryDoc = {
  title: string;
  author_name: string[];
  cover_edition_key: string;
  isbn: string[];
  ratings_count: number;
};

export const getBookCover = (book: OpenLibraryDoc) => {
  return `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`;
};
