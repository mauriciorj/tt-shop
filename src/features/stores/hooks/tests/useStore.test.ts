import { renderHook, act } from '@testing-library/react'
import useStore from '../useStore'

// ─── Mocks ───────────────────────────────────────────────────────────────────

// Factory mock — prevents Jest from loading the real file and pulling in ESM Clerk
jest.mock('@/hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}))

jest.mock('@convex-dev/react-query', () => ({
  convexQuery: jest.fn((fn, args) => ({ queryKey: ['convex', fn, args] })),
}))

jest.mock('@/convex/_generated/api', () => ({
  api: {
    stores: {
      getStoreByName: 'stores:getStoreByName',
    },
  },
}))

jest.mock('@/hooks/useCategories', () => ({
  data: [
    { id: '601450', label: 'Beleza e cuidados pessoais' },
    { id: '605196', label: 'Automotivo' },
    { id: '603014', label: 'Esportes e lazer' },
  ],
}))

// ─── Imports after mocks ──────────────────────────────────────────────────────

import UseUser from '@/hooks/useUser'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '@/convex/_generated/api'

const mockUseUser = UseUser as jest.Mock
const mockUseQuery = useQuery as jest.Mock
const mockConvexQuery = convexQuery as jest.Mock

// ─── Helpers ──────────────────────────────────────────────────────────────────

const setupUseUser = (overrides = {}) =>
  mockUseUser.mockReturnValue({ isFreeUser: false, id: 'user_123', ...overrides })

const setupUseQuery = (overrides = {}) =>
  mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, ...overrides })

beforeEach(() => {
  jest.clearAllMocks()
  setupUseUser()
  setupUseQuery()
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useStore', () => {
  describe('initial state', () => {
    it('returns store as null before setName is called', () => {
      const { result } = renderHook(() => useStore())
      expect(result.current.store).toBeNull()
    })

    it('returns isLoading as false initially', () => {
      const { result } = renderHook(() => useStore())
      expect(result.current.isLoading).toBe(false)
    })

    it('exposes setName as a function', () => {
      const { result } = renderHook(() => useStore())
      expect(typeof result.current.setName).toBe('function')
    })
  })

  describe('user data passthrough', () => {
    it('returns clerkId from UseUser', () => {
      setupUseUser({ id: 'clerk_abc' })
      const { result } = renderHook(() => useStore())
      expect(result.current.clerkId).toBe('clerk_abc')
    })

    it('returns isFreeUser from UseUser', () => {
      setupUseUser({ isFreeUser: true })
      const { result } = renderHook(() => useStore())
      expect(result.current.isFreeUser).toBe(true)
    })

    it('returns isFreeUser false for paid users', () => {
      setupUseUser({ isFreeUser: false })
      const { result } = renderHook(() => useStore())
      expect(result.current.isFreeUser).toBe(false)
    })
  })

  describe('loading state', () => {
    it('returns isLoading true when query is loading', () => {
      setupUseQuery({ isLoading: true, data: undefined })
      const { result } = renderHook(() => useStore())
      expect(result.current.isLoading).toBe(true)
    })

    it('returns isLoading false when query is done', () => {
      setupUseQuery({ isLoading: false, data: undefined })
      const { result } = renderHook(() => useStore())
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('query arguments', () => {
    it('passes undefined to the query when name is null (initial state)', () => {
      renderHook(() => useStore())
      expect(mockConvexQuery).toHaveBeenCalledWith(
        api.stores.getStoreByName,
        { name: undefined }
      )
    })

    it('passes the store name to the query after setName is called', () => {
      const { result } = renderHook(() => useStore())
      act(() => {
        result.current.setName('cool-shop')
      })
      expect(mockConvexQuery).toHaveBeenLastCalledWith(
        api.stores.getStoreByName,
        { name: 'cool-shop' }
      )
    })

    it('passes undefined when setName is called with empty string', () => {
      const { result } = renderHook(() => useStore())
      act(() => {
        result.current.setName('')
      })
      expect(mockConvexQuery).toHaveBeenLastCalledWith(
        api.stores.getStoreByName,
        { name: undefined }
      )
    })
  })

  describe('store memo — no data', () => {
    it('returns null when query returns undefined', () => {
      setupUseQuery({ data: undefined })
      const { result } = renderHook(() => useStore())
      expect(result.current.store).toBeNull()
    })

    it('returns null when query data has no name', () => {
      setupUseQuery({ data: { name: undefined, category_id: '601450' } })
      const { result } = renderHook(() => useStore())
      expect(result.current.store).toBeNull()
    })
  })

  describe('store memo — with data', () => {
    it('returns the store with category_name resolved from categories', () => {
      setupUseQuery({
        data: {
          name: 'Test Store',
          category_id: '601450',
          revenue: 85000,
          sales: 3400,
        },
      })
      const { result } = renderHook(() => useStore())
      expect(result.current.store).toMatchObject({
        name: 'Test Store',
        category_id: '601450',
        category_name: 'Beleza e cuidados pessoais',
        revenue: 85000,
        sales: 3400,
      })
    })

    it('resolves the correct category label for a different category_id', () => {
      setupUseQuery({
        data: { name: 'Auto Shop', category_id: '605196' },
      })
      const { result } = renderHook(() => useStore())
      expect(result.current.store?.category_name).toBe('Automotivo')
    })

    it('sets category_name to undefined when category_id is not in the list', () => {
      setupUseQuery({
        data: { name: 'Mystery Store', category_id: 'unknown_id' },
      })
      const { result } = renderHook(() => useStore())
      expect(result.current.store?.category_name).toBeUndefined()
    })

    it('preserves all fields from the raw query data', () => {
      const rawData = {
        name: 'Full Store',
        category_id: '603014',
        revenue: 50000,
        sales: 1200,
        revenue_growth_rate: 5.5,
        revenue_history: [100, 200, 300],
        country: 'BR',
        type: 'marketplace',
        unit_price: 29.9,
        image: 'https://example.com/img.jpg',
      }
      setupUseQuery({ data: rawData })
      const { result } = renderHook(() => useStore())
      expect(result.current.store).toMatchObject(rawData)
      expect(result.current.store?.category_name).toBe('Esportes e lazer')
    })
  })

  describe('setName triggers re-query', () => {
    it('store updates after setName is called and query resolves', () => {
      setupUseQuery({ data: undefined })
      const { result, rerender } = renderHook(() => useStore())

      expect(result.current.store).toBeNull()

      mockUseQuery.mockReturnValue({
        data: { name: 'New Store', category_id: '601450' },
        isLoading: false,
      })

      act(() => {
        result.current.setName('new-store')
      })
      rerender()

      expect(result.current.store).toMatchObject({
        name: 'New Store',
        category_name: 'Beleza e cuidados pessoais',
      })
    })
  })
})
