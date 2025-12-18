import { POST } from '@/app/api/sightings/claim/route';
import { adminSupabase } from '@/lib/supabase-admin';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Mocks
jest.mock('@/lib/supabase-admin', () => ({
  adminSupabase: {
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          is: jest.fn(() => ({
            select: jest.fn().mockResolvedValue({ data: [{ id: '1' }], error: null }),
          })),
        })),
      })),
    })),
  },
}));

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('POST /api/sightings/claim', () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: {
            session: {
              user: { id: 'test-user-id' },
            },
          },
        }),
      },
    };
    (createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase);
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn(),
    });
  });

  it('should return 400 if anonymousId is missing', async () => {
    const request = new Request('http://localhost:3000/api/sightings/claim', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toBe('Invalid anonymous ID');
  });

  it('should return 400 if anonymousId is invalid UUID', async () => {
    const request = new Request('http://localhost:3000/api/sightings/claim', {
      method: 'POST',
      body: JSON.stringify({ anonymousId: 'invalid-uuid' }),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.message).toBe('Invalid anonymous ID');
  });

  it('should return 401 if user is not authenticated', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    const request = new Request('http://localhost:3000/api/sightings/claim', {
      method: 'POST',
      body: JSON.stringify({ anonymousId: '123e4567-e89b-12d3-a456-426614174000' }),
    });
    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('should attempt update via adminSupabase and return success', async () => {
    const request = new Request('http://localhost:3000/api/sightings/claim', {
      method: 'POST',
      body: JSON.stringify({ anonymousId: '123e4567-e89b-12d3-a456-426614174000' }),
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.claimedCount).toBe(1);

    // Check if adminSupabase was called correctly
    expect(adminSupabase.from).toHaveBeenCalledWith('sightings');
  });
});
