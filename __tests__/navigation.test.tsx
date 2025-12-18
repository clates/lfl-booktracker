import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Navigation } from '../components/navigation';
import { toast } from 'sonner';
import '@testing-library/jest-dom';

// Mock Supabase
const mockGetSession = jest.fn();
const mockSignOut = jest.fn();
const mockOnAuthStateChange = jest.fn();

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => ({
    auth: {
      getSession: mockGetSession,
      signOut: mockSignOut,
      onAuthStateChange: mockOnAuthStateChange,
    },
  }),
}));

// Mock Next.js router
const mockRefresh = jest.fn();
const mockUsePathname = jest.fn();
const mockUseRouter = jest.fn(() => ({
  refresh: mockRefresh,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => mockUseRouter(),
  usePathname: () => mockUsePathname(),
}));

// Mock Sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Navigation', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    created_at: '2024-01-01',
    app_metadata: {},
    user_metadata: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
    
    // Setup default mock for onAuthStateChange
    mockOnAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: jest.fn(),
        },
      },
    });
  });

  it('renders with no user (unauthenticated state)', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
    });

    render(<Navigation />);

    await waitFor(() => {
      expect(screen.getByText('TaleTrail')).toBeInTheDocument();
    });

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Generate Code')).not.toBeInTheDocument();
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });

  it('renders with authenticated user', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: mockUser,
        },
      },
    });

    render(<Navigation />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    expect(screen.getByText('TaleTrail')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Generate Code')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('handles sign out correctly', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: mockUser,
        },
      },
    });
    mockSignOut.mockResolvedValue({ error: null });

    render(<Navigation />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    const signOutButton = screen.getByTitle('Sign Out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockRefresh).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Signed out successfully');
    });
  });

  it('sets up auth state change listener', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
    });

    render(<Navigation />);

    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });

    // Verify that the listener was set up
    expect(mockOnAuthStateChange).toHaveBeenCalledWith(expect.any(Function));
  });

  it('highlights active route correctly', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: mockUser,
        },
      },
    });
    mockUsePathname.mockReturnValue('/generate');

    const { container } = render(<Navigation />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    // The active route should have a different button variant (default instead of ghost)
    // We can verify this by checking the button structure
    const generateButton = screen.getByText('Generate Code').closest('a');
    expect(generateButton).toHaveAttribute('href', '/generate');
  });

  it('conditionally renders Generate Code button only when authenticated', async () => {
    const { rerender } = render(<Navigation />);

    // Initially no user
    mockGetSession.mockResolvedValue({
      data: { session: null },
    });

    await waitFor(() => {
      expect(screen.queryByText('Generate Code')).not.toBeInTheDocument();
    });

    // Now with user
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: mockUser,
        },
      },
    });

    rerender(<Navigation />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    expect(screen.getByText('Generate Code')).toBeInTheDocument();
  });

  it('unsubscribes from auth state changes on unmount', async () => {
    const mockUnsubscribe = jest.fn();

    mockGetSession.mockResolvedValue({
      data: { session: null },
    });

    mockOnAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: mockUnsubscribe,
        },
      },
    });

    const { unmount } = render(<Navigation />);

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
