/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { GET } from '../route'

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@/src/features/api-keys/lib/verifyApiKey', () => ({
  verifyApiKey: jest.fn(),
}))

jest.mock('convex/browser', () => ({
  ConvexHttpClient: jest.fn().mockImplementation(() => ({
    query: jest.fn(),
    mutation: jest.fn(),
  })),
}))

jest.mock('@/convex/_generated/api', () => ({
  api: {
    userApiKeys: {
      hasReachedLimit: 'userApiKeys:hasReachedLimit',
      incrementUsage: 'userApiKeys:incrementUsage',
    },
    videos: {
      getVideosWithPagination: 'videos:getVideosWithPagination',
    },
  },
}))

// ─── Imports after mocks ──────────────────────────────────────────────────────

import { verifyApiKey } from '@/src/features/api-keys/lib/verifyApiKey'
import { ConvexHttpClient } from 'convex/browser'

const mockVerifyApiKey = verifyApiKey as jest.Mock

// Grab the mocked client instance created when the module initialises
let mockQuery: jest.Mock
let mockMutation: jest.Mock

beforeAll(() => {
  const instance = (ConvexHttpClient as jest.Mock).mock.results[0].value
  mockQuery = instance.query
  mockMutation = instance.mutation
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeRequest = (params: Record<string, string> = {}, headers: Record<string, string> = {}) => {
  const url = new URL('http://localhost/api/videos')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return new NextRequest(url, { headers })
}

const defaultPaginationResult = {
  page: [{ k_id: 'v1', title: 'Video 1' }],
  continueCursor: 'cursor_abc',
  isDone: false,
}

const setupSuccess = () => {
  mockVerifyApiKey.mockResolvedValue('user_123')
  mockQuery.mockImplementation((key: string) => {
    if (key === 'userApiKeys:hasReachedLimit') return Promise.resolve(false)
    if (key === 'videos:getVideosWithPagination') return Promise.resolve(defaultPaginationResult)
  })
  mockMutation.mockResolvedValue(undefined)
}

beforeEach(() => {
  jest.clearAllMocks()
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('GET /api/videos', () => {
  describe('authentication', () => {
    it('returns 401 when verifyApiKey returns null', async () => {
      mockVerifyApiKey.mockResolvedValue(null)
      const res = await GET(makeRequest())
      expect(res.status).toBe(401)
    })

    it('returns Unauthorized error body when unauthenticated', async () => {
      mockVerifyApiKey.mockResolvedValue(null)
      const res = await GET(makeRequest())
      const body = await res.json()
      expect(body).toEqual({ error: 'Unauthorized' })
    })

    it('does not query Convex when unauthenticated', async () => {
      mockVerifyApiKey.mockResolvedValue(null)
      await GET(makeRequest())
      expect(mockQuery).not.toHaveBeenCalled()
    })
  })

  describe('rate limiting', () => {
    it('returns 429 when the API call limit is reached', async () => {
      mockVerifyApiKey.mockResolvedValue('user_123')
      mockQuery.mockResolvedValue(true) // hasReachedLimit
      const res = await GET(makeRequest())
      expect(res.status).toBe(429)
    })

    it('returns limit error body when rate limited', async () => {
      mockVerifyApiKey.mockResolvedValue('user_123')
      mockQuery.mockResolvedValue(true)
      const res = await GET(makeRequest())
      const body = await res.json()
      expect(body).toEqual({ error: 'API call limit reached (1,000 requests)' })
    })

    it('checks the limit with the clerk_id from verifyApiKey', async () => {
      mockVerifyApiKey.mockResolvedValue('clerk_xyz')
      mockQuery.mockResolvedValue(true)
      await GET(makeRequest())
      expect(mockQuery).toHaveBeenCalledWith(
        'userApiKeys:hasReachedLimit',
        { clerk_id: 'clerk_xyz' }
      )
    })

    it('does not query videos when rate limited', async () => {
      mockVerifyApiKey.mockResolvedValue('user_123')
      mockQuery.mockResolvedValue(true)
      await GET(makeRequest())
      expect(mockQuery).toHaveBeenCalledTimes(1)
    })
  })

  describe('successful response', () => {
    beforeEach(setupSuccess)

    it('returns 200', async () => {
      const res = await GET(makeRequest())
      expect(res.status).toBe(200)
    })

    it('returns data, total, cursor and isDone in the body', async () => {
      const res = await GET(makeRequest())
      const body = await res.json()
      expect(body).toEqual({
        data: defaultPaginationResult.page,
        total: defaultPaginationResult.page.length,
        cursor: defaultPaginationResult.continueCursor,
        isDone: defaultPaginationResult.isDone,
      })
    })

    it('calls incrementUsage after a successful response', async () => {
      await GET(makeRequest())
      expect(mockMutation).toHaveBeenCalledWith(
        'userApiKeys:incrementUsage',
        { clerk_id: 'user_123' }
      )
    })
  })

  describe('pagination params', () => {
    beforeEach(setupSuccess)

    it('uses default limit of 10 when not provided', async () => {
      await GET(makeRequest())
      expect(mockQuery).toHaveBeenCalledWith(
        'videos:getVideosWithPagination',
        { paginationOpts: { numItems: 10, cursor: null } }
      )
    })

    it('uses the provided limit param', async () => {
      await GET(makeRequest({ limit: '25' }))
      expect(mockQuery).toHaveBeenCalledWith(
        'videos:getVideosWithPagination',
        { paginationOpts: { numItems: 25, cursor: null } }
      )
    })

    it('clamps limit to a maximum of 100', async () => {
      await GET(makeRequest({ limit: '999' }))
      expect(mockQuery).toHaveBeenCalledWith(
        'videos:getVideosWithPagination',
        { paginationOpts: { numItems: 100, cursor: null } }
      )
    })

    it('clamps limit to a minimum of 1', async () => {
      await GET(makeRequest({ limit: '0' }))
      expect(mockQuery).toHaveBeenCalledWith(
        'videos:getVideosWithPagination',
        { paginationOpts: { numItems: 1, cursor: null } }
      )
    })

    it('passes the cursor param when provided', async () => {
      await GET(makeRequest({ cursor: 'cursor_xyz' }))
      expect(mockQuery).toHaveBeenCalledWith(
        'videos:getVideosWithPagination',
        { paginationOpts: { numItems: 10, cursor: 'cursor_xyz' } }
      )
    })

    it('passes null cursor when not provided', async () => {
      await GET(makeRequest())
      expect(mockQuery).toHaveBeenCalledWith(
        'videos:getVideosWithPagination',
        { paginationOpts: { numItems: 10, cursor: null } }
      )
    })
  })

  describe('error handling', () => {
    it('returns 500 when the Convex query throws', async () => {
      mockVerifyApiKey.mockResolvedValue('user_123')
      mockQuery.mockImplementation((key: string) => {
        if (key === 'userApiKeys:hasReachedLimit') return Promise.resolve(false)
        return Promise.reject(new Error('Convex error'))
      })
      const res = await GET(makeRequest())
      expect(res.status).toBe(500)
    })

    it('returns error body when the query throws', async () => {
      mockVerifyApiKey.mockResolvedValue('user_123')
      mockQuery.mockImplementation((key: string) => {
        if (key === 'userApiKeys:hasReachedLimit') return Promise.resolve(false)
        return Promise.reject(new Error('Convex error'))
      })
      const res = await GET(makeRequest())
      const body = await res.json()
      expect(body).toEqual({ error: 'Failed to fetch videos' })
    })

    it('does not call incrementUsage when the query throws', async () => {
      mockVerifyApiKey.mockResolvedValue('user_123')
      mockQuery.mockImplementation((key: string) => {
        if (key === 'userApiKeys:hasReachedLimit') return Promise.resolve(false)
        return Promise.reject(new Error('Convex error'))
      })
      await GET(makeRequest())
      expect(mockMutation).not.toHaveBeenCalled()
    })
  })
})
