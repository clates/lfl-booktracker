import { getBookCover, OpenLibraryDoc } from '@/lib/openLibrary';

describe('openLibrary utility', () => {
  describe('getBookCover', () => {
    it('generates the correct cover URL', () => {
      const mockBook: OpenLibraryDoc = {
        title: 'Test Book',
        author_name: ['Test Author'],
        cover_edition_key: 'OL123M',
        isbn: ['1234567890'],
        ratings_count: 5,
      };

      const url = getBookCover(mockBook);
      expect(url).toBe('https://covers.openlibrary.org/b/olid/OL123M-M.jpg');
    });
  });
});
