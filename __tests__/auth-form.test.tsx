import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { AuthForm } from "../components/auth-form"
import "@testing-library/jest-dom"

// Mock Supabase
const mockSignInWithPassword = jest.fn()
const mockSignUp = jest.fn()
const mockSignInWithOAuth = jest.fn()

jest.mock("@supabase/auth-helpers-nextjs", () => ({
  createClientComponentClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}))

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}))

// Mock Sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe("AuthForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders sign in form by default", () => {
    render(<AuthForm />)
    expect(screen.getByText("Sign In", { selector: "h3" })).toBeInTheDocument() // CardTitle renders as h3 usually in shadcn? or div. Let's check text content.
    expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
  })

  it("switches to sign up form", () => {
    render(<AuthForm />)
    const signUpLink = screen.getByText("Don't have an account? Sign up")
    fireEvent.click(signUpLink)
    expect(screen.getByText("Create an account to start tracking")).toBeInTheDocument()
    expect(screen.getByText("Sign Up", { selector: 'button[type="submit"]' })).toBeInTheDocument()
  })

  it("calls signInWithPassword on submit when in sign in mode", async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null })
    render(<AuthForm />)

    fireEvent.change(screen.getByPlaceholderText("name@example.com"), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } })

    fireEvent.click(screen.getByText("Sign In", { selector: 'button[type="submit"]' }))

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      })
    })
  })

  it("calls signUp on submit when in sign up mode", async () => {
    mockSignUp.mockResolvedValue({ error: null })
    render(<AuthForm />)

    fireEvent.click(screen.getByText("Don't have an account? Sign up"))

    fireEvent.change(screen.getByPlaceholderText("name@example.com"), {
      target: { value: "new@example.com" },
    })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } })

    fireEvent.click(screen.getByText("Sign Up", { selector: 'button[type="submit"]' }))

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "password123",
        options: {
          emailRedirectTo: expect.stringContaining("/auth/callback"),
        },
      })
    })
  })
})
