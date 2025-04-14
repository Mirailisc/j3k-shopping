import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import '@testing-library/jest-dom'
import Protected from './Protected'

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  Navigate: vi.fn(({ to }) => <div>Redirected to {to}</div>),
  Outlet: () => <div>Protected Content</div>,
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
describe('AdminProtected', () => {
  it('shows loading screen when `isLoading` is true', () => {
    ;(useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: true,
    })

    render(<Protected />, { wrapper: MemoryRouter })

    const loadingImage = screen.getByRole('img')
    expect(loadingImage).toBeInTheDocument()
  })

  it('redirects to sign-in when not authenticated', () => {
    ;(useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    })

    render(<Protected />, { wrapper: MemoryRouter })

    expect(screen.getByText(/Redirected to \/sign-in/i)).toBeInTheDocument()
  })
})
