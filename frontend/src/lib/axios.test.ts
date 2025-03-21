import { vi, expect, test } from 'vitest'
import { axiosInstance } from './axios'

vi.mock('axios', () => ({
  default: {
    create: vi.fn().mockReturnValue({
      interceptors: {
        request: {
          use: vi.fn(),
        },
      },
      defaults: {
        baseURL: '/api/v2',
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    }),
  },
}))

vi.mock('react-cookie')

test('axiosInstance creates with correct base URL and headers', () => {
  expect(axiosInstance.defaults.baseURL).toBe('/api/v2')
  expect(axiosInstance.defaults.headers['Content-Type']).toBe('application/json')
  expect(axiosInstance.defaults.withCredentials).toBe(true)
})
