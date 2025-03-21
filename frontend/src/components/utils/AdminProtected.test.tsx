import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AdminProtected from './AdminProtected'
import '@testing-library/jest-dom'

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  Navigate: vi.fn(({ to }) => <div>Redirected to {to}</div>),
  Outlet: () => <div>Protected Admin Content</div>,
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
describe('AdminProtected', () => {
  it('shows loading screen when `isLoading` is true', () => {
    ;(useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: true,
    })

    render(<AdminProtected />, { wrapper: MemoryRouter })

    const loadingImage = screen.getByRole('img')
    expect(loadingImage).toBeInTheDocument()
  })

  it('redirects to sign-in when not authenticated', () => {
    ;(useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    })

    render(<AdminProtected />, { wrapper: MemoryRouter })

    expect(screen.getByText(/Redirected to \/sign-in/i)).toBeInTheDocument()
  })

  it('reject non-admins from accessing dashboard', () => {
    ;(useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: true,
      user: { isAdmin: false, isSuperAdmin: false },
      isLoading: false,
    })

    render(<AdminProtected />, { wrapper: MemoryRouter })

    expect(screen.getByText(/Redirected to \//i)).toBeInTheDocument()
  })

  it('allows admin to access dashboard', () => {
    ;(useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: true,
      user: { isAdmin: true, isSuperAdmin: true },
      isLoading: false,
    })

    render(<AdminProtected />, { wrapper: MemoryRouter })

    expect(screen.getByText(/Protected Admin Content/i)).toBeInTheDocument()
  })
})
