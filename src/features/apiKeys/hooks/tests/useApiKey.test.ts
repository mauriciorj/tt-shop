import { renderHook } from '@testing-library/react'
import UseApiKey from '../useApiKey'

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('@/hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}))

jest.mock('@convex-dev/react-query', () => ({
  convexQuery: jest.fn(() => ({ queryKey: ['convex'] })),
}))

jest.mock('@/convex/_generated/api', () => ({
  api: { userApiKeys: { getApiKey: 'userApiKeys:getApiKey' } },
}))

// ── Imports after mocks ───────────────────────────────────────────────────────

import UseUser from '@/hooks/useUser'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '@/convex/_generated/api'

const mockUseUser = UseUser as jest.Mock
const mockUseQuery = useQuery as jest.Mock
const mockConvexQuery = convexQuery as jest.Mock

// ── Helpers ───────────────────────────────────────────────────────────────────

const setupUseUser = (id: string | null) =>
  mockUseUser.mockReturnValue({ id })

const setupUseQuery = (data: unknown = undefined, isLoading = false) =>
  mockUseQuery.mockReturnValue({ data, isLoading })

beforeEach(() => {
  jest.clearAllMocks()
  setupUseUser('user_123')
  setupUseQuery()
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('UseApiKey', () => {
  describe('convexQuery argument', () => {
    it('passes { clerk_id } when user id is present', () => {
      setupUseUser('user_abc')
      renderHook(() => UseApiKey())
      expect(mockConvexQuery).toHaveBeenCalledWith(
        api.userApiKeys.getApiKey,
        { clerk_id: 'user_abc' }
      )
    })

    it('passes "skip" when user id is null', () => {
      setupUseUser(null)
      renderHook(() => UseApiKey())
      expect(mockConvexQuery).toHaveBeenCalledWith(
        api.userApiKeys.getApiKey,
        'skip'
      )
    })

    it('passes "skip" when user id is undefined', () => {
      mockUseUser.mockReturnValue({ id: undefined })
      renderHook(() => UseApiKey())
      expect(mockConvexQuery).toHaveBeenCalledWith(
        api.userApiKeys.getApiKey,
        'skip'
      )
    })
  })

  describe('apiKey', () => {
    it('returns null when query data is undefined', () => {
      setupUseQuery(undefined)
      const { result } = renderHook(() => UseApiKey())
      expect(result.current.apiKey).toBeNull()
    })

    it('returns null when query data is null', () => {
      setupUseQuery(null)
      const { result } = renderHook(() => UseApiKey())
      expect(result.current.apiKey).toBeNull()
    })

    it('returns the api key object when query data is present', () => {
      const key = { created_at: '2024-01-15T10:00:00Z', key_prefix: 'usr_abc' }
      setupUseQuery(key)
      const { result } = renderHook(() => UseApiKey())
      expect(result.current.apiKey).toEqual(key)
    })
  })

  describe('isLoading', () => {
    it('is true when the query is loading', () => {
      setupUseQuery(undefined, true)
      const { result } = renderHook(() => UseApiKey())
      expect(result.current.isLoading).toBe(true)
    })

    it('is false when the query has resolved', () => {
      setupUseQuery({ created_at: '2024-01-15T10:00:00Z' }, false)
      const { result } = renderHook(() => UseApiKey())
      expect(result.current.isLoading).toBe(false)
    })
  })
})
