import { GET } from '@/app/api/books/[id]/route';

// Mock Supabase and Next.js headers
const mockSupabase = {
  from: jest.fn(),
};

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(() => mockSupabase),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({ json: async () => data, status: options?.status || 200 })),
  },
}));

describe('GET /api/books/[id]', () => {
  const mockFrom = mockSupabase.from as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 404 if book is not found', async () => {
    // Mock chain for book query
    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: null, error: null });

    mockFrom.mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
    });

    const request = {} as Request;
    // Note: The code uses params.id (from [id] directory)
    const params = { id: 'MISSING' }; 

    const response = await GET(request, { params: params as any });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Book not found');
  });

  it('returns book and sightings if book exists', async () => {
    const mockBook = { id: 1, code: 'EXISTING' };
    const mockSightings = [{ id: 101, book_id: 1 }];

    // Chain for book
    const mockBookSingle = jest.fn().mockResolvedValue({ data: mockBook, error: null });
    const mockBookEq = jest.fn().mockReturnThis();
    const mockBookSelect = jest.fn().mockReturnValue({
        eq: mockBookEq,
        single: mockBookSingle
    });

    // Chain for sightings
    const mockSightingsLimit = jest.fn().mockResolvedValue({ data: mockSightings, error: null });
    const mockSightingsOrder = jest.fn().mockReturnValue({ limit: mockSightingsLimit });
    const mockSightingsEq = jest.fn().mockReturnValue({ order: mockSightingsOrder });
    const mockSightingsSelect = jest.fn().mockReturnValue({ eq: mockSightingsEq });

    // Assuming first call is for 'books', second for 'sightings'
    // But mocked 'from' needs to return different things based on argument
    mockFrom.mockImplementation((table: string) => {
        if (table === 'books') {
            return { select: mockBookSelect };
        }
        if (table === 'sightings') {
            return { select: mockSightingsSelect };
        }
        return { select: jest.fn() };
    });

    const request = {} as Request;
    const params = { id: 'EXISTING' };

    const response = await GET(request, { params: params as any });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.book).toEqual(mockBook);
    expect(data.sightings).toEqual(mockSightings);
  });

  it('returns 500 on database error', async () => {
     // Mock error
    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } });

    mockFrom.mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
    });

    const request = {} as Request;
    const params = { id: 'ERROR' };

    const response = await GET(request, { params: params as any });
    
    expect(response.status).toBe(500);
  });
});
