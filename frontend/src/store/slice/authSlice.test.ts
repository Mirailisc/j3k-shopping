import { configureStore } from '@reduxjs/toolkit'
import { describe, it, expect, vi } from 'vitest'
import authReducer, { login, logout, me } from './authSlice'
import { axiosInstance } from '@/lib/axios'

vi.mock('@/lib/axios', () => ({
  axiosInstance: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('authSlice', () => {
  let store: any

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    })
  })

  it('should set loading state to true when me is pending', () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: {} })

    store.dispatch(me('token'))

    const state = store.getState().auth
    expect(state.isLoading).toBe(true)
  })

  it('should set user and authentication status when me is fulfilled', async () => {
    const mockUserData = { username: 'john_doe', email: 'john@example.com' }
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockUserData })

    await store.dispatch(me('token'))

    const state = store.getState().auth
    expect(state.user).toEqual(mockUserData)
    expect(state.isAuthenticated).toBe(true)
    expect(state.isLoading).toBe(false)
  })

  it('should set error state when me is rejected', async () => {
    vi.mocked(axiosInstance.get).mockRejectedValue(new Error('Failed to fetch user data'))

    await store.dispatch(me('token'))

    const state = store.getState().auth
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(false)
    expect(state.user).toBeNull()
  })

  it('should set isAuthenticated and user when login is fulfilled', async () => {
    const mockLoginData = { user: { username: 'john_doe' } }
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: mockLoginData })

    await store.dispatch(login({ username: 'john_doe', password: 'password123' }))

    const state = store.getState().auth
    expect(state.user).toEqual(mockLoginData.user)
    expect(state.isAuthenticated).toBe(true)
  })

  it('should reset user and isAuthenticated when logout is fulfilled', () => {
    store.dispatch(logout())

    const state = store.getState().auth
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })
})
