import { renderHook, act } from '@testing-library/react'
import useStores from '../useStores'

// ─── Mocks ───────────────────────────────────────────────────────────────────

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
  api: { stores: { getAllStores: 'stores:getAllStores' } },
}))

// ─── Imports after mocks ──────────────────────────────────────────────────────

import UseUser from '@/hooks/useUser'
import { useQuery } from '@tanstack/react-query'

const mockUseUser = UseUser as jest.Mock
const mockUseQuery = useQuery as jest.Mock

// ─── Helpers ─────────────────────────────────────────────────────────────────

const setupUseUser = (overrides = {}) =>
  mockUseUser.mockReturnValue({
    FREE_USER_ITEMS_PER_PAGE: 3,
    id: 'user_123',
    isFreeUser: false,
    isLoading: false,
    userSubscriptionPlan: 'pro',
    ...overrides,
  })

const setupUseQuery = (data: unknown = undefined, isLoading = false) =>
  mockUseQuery.mockReturnValue({ data, isLoading })

const makeStore = (overrides = {}) => ({
  k_id: 'store_001',
  name: 'Test Store',
  category_id: '601450',
  category_name: 'Beleza',
  country: 'BR',
  type: 'marketplace',
  unit_price: 49.9,
  revenue: 10000,
  revenue_7_days: 2000,
  revenue_14_days: 4000,
  revenue_growth_rate: 5,
  revenue_history: [100, 200, 300],
  sales: 500,
  image: null,
  ...overrides,
})

beforeEach(() => {
  jest.clearAllMocks()
  setupUseUser()
  setupUseQuery()
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useStores', () => {
  describe('initial state', () => {
    it('starts on page 1', () => {
      const { result } = renderHook(() => useStores())
      expect(result.current.currentPage).toBe(1)
    })

    it('starts with selectedCategory "all"', () => {
      const { result } = renderHook(() => useStores())
      expect(result.current.selectedCategory).toBe('all')
    })

    it('starts with selectedPeriod "30"', () => {
      const { result } = renderHook(() => useStores())
      expect(result.current.selectedPeriod).toBe('30')
    })

    it('starts with sortKey "revenue"', () => {
      const { result } = renderHook(() => useStores())
      expect(result.current.sortKey).toBe('revenue')
    })

    it('starts with sortOrder "desc"', () => {
      const { result } = renderHook(() => useStores())
      expect(result.current.sortOrder).toBe('desc')
    })

    it('starts with itemsPerPage 10', () => {
      const { result } = renderHook(() => useStores())
      expect(result.current.itemsPerPage).toBe(10)
    })

    it('data is empty when query returns undefined', () => {
      const { result } = renderHook(() => useStores())
      expect(result.current.data).toEqual([])
    })
  })

  describe('user data passthrough', () => {
    it('exposes userId from UseUser', () => {
      setupUseUser({ id: 'clerk_abc' })
      const { result } = renderHook(() => useStores())
      expect(result.current.userId).toBe('clerk_abc')
    })

    it('exposes isFreeUser from UseUser', () => {
      setupUseUser({ isFreeUser: true })
      const { result } = renderHook(() => useStores())
      expect(result.current.isFreeUser).toBe(true)
    })

    it('exposes userSubscriptionPlan from UseUser', () => {
      setupUseUser({ userSubscriptionPlan: 'starter' })
      const { result } = renderHook(() => useStores())
      expect(result.current.userSubscriptionPlan).toBe('starter')
    })
  })

  describe('isLoading', () => {
    it('is true only when both query and db user are loading', () => {
      setupUseUser({ isLoading: true })
      setupUseQuery(undefined, true)
      const { result } = renderHook(() => useStores())
      expect(result.current.isLoading).toBe(true)
    })

    it('is false when only the query is loading', () => {
      setupUseUser({ isLoading: false })
      setupUseQuery(undefined, true)
      const { result } = renderHook(() => useStores())
      expect(result.current.isLoading).toBe(false)
    })

    it('is false when only the db user is loading', () => {
      setupUseUser({ isLoading: true })
      setupUseQuery(undefined, false)
      const { result } = renderHook(() => useStores())
      expect(result.current.isLoading).toBe(false)
    })

    it('is false when neither is loading', () => {
      setupUseUser({ isLoading: false })
      setupUseQuery([], false)
      const { result } = renderHook(() => useStores())
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('categories memo', () => {
    it('is undefined when getAllStores is undefined', () => {
      setupUseQuery(undefined)
      const { result } = renderHook(() => useStores())
      expect(result.current.categories).toBeUndefined()
    })

    it('is undefined when all stores lack category_name or category_id', () => {
      setupUseQuery([
        makeStore({ category_name: null, category_id: null }),
      ])
      const { result } = renderHook(() => useStores())
      expect(result.current.categories).toBeUndefined()
    })

    it('prepends "Todas as categorias" as the first item', () => {
      setupUseQuery([makeStore({ category_id: '601450', category_name: 'Beleza' })])
      const { result } = renderHook(() => useStores())
      expect(result.current.categories?.[0]).toEqual({ id: 'all', label: 'Todas as categorias' })
    })

    it('deduplicates categories by category_id', () => {
      setupUseQuery([
        makeStore({ k_id: 'a', category_id: '601450', category_name: 'Beleza' }),
        makeStore({ k_id: 'b', category_id: '601450', category_name: 'Beleza' }),
        makeStore({ k_id: 'c', category_id: '605196', category_name: 'Automotivo' }),
      ])
      const { result } = renderHook(() => useStores())
      // "all" + 2 unique categories
      expect(result.current.categories).toHaveLength(3)
    })

    it('sorts categories alphabetically by label', () => {
      setupUseQuery([
        makeStore({ k_id: 'a', category_id: '603014', category_name: 'Esportes' }),
        makeStore({ k_id: 'b', category_id: '605196', category_name: 'Automotivo' }),
        makeStore({ k_id: 'c', category_id: '601450', category_name: 'Beleza' }),
      ])
      const { result } = renderHook(() => useStores())
      const labels = result.current.categories?.slice(1).map((c) => c.label)
      expect(labels).toEqual(['Automotivo', 'Beleza', 'Esportes'])
    })
  })

  describe('pagination', () => {
    it('returns only the first page of items', () => {
      const stores = Array.from({ length: 15 }, (_, i) =>
        makeStore({ k_id: `s${i}`, name: `Store ${i}`, revenue: i * 100 })
      )
      setupUseQuery(stores)
      const { result } = renderHook(() => useStores())
      expect(result.current.data).toHaveLength(10)
    })

    it('returns the second page after onPageChange(2)', () => {
      const stores = Array.from({ length: 25 }, (_, i) =>
        makeStore({ k_id: `s${i}`, name: `Store ${i}`, revenue: 1000 - i })
      )
      setupUseQuery(stores)
      const { result } = renderHook(() => useStores())

      act(() => result.current.onPageChange(2))

      expect(result.current.currentPage).toBe(2)
      expect(result.current.data).toHaveLength(10)
    })

    it('returns remaining items on last partial page', () => {
      const stores = Array.from({ length: 13 }, (_, i) =>
        makeStore({ k_id: `s${i}`, name: `Store ${i}`, revenue: 1000 - i })
      )
      setupUseQuery(stores)
      const { result } = renderHook(() => useStores())

      act(() => result.current.onPageChange(2))

      expect(result.current.data).toHaveLength(3)
    })
  })

  describe('free user limit', () => {
    it('limits results to FREE_USER_ITEMS_PER_PAGE for free users', () => {
      setupUseUser({ isFreeUser: true })
      const stores = Array.from({ length: 20 }, (_, i) =>
        makeStore({ k_id: `s${i}`, name: `Store ${i}` })
      )
      setupUseQuery(stores)
      const { result } = renderHook(() => useStores())
      expect(result.current.data).toHaveLength(10)
    })

    it('does not limit results for paid users', () => {
      setupUseUser({ isFreeUser: false })
      const stores = Array.from({ length: 10 }, (_, i) =>
        makeStore({ k_id: `s${i}`, name: `Store ${i}` })
      )
      setupUseQuery(stores)
      const { result } = renderHook(() => useStores())
      expect(result.current.data).toHaveLength(10)
    })
  })

  describe('category filter', () => {
    it('returns all stores when selectedCategory is "all"', () => {
      setupUseQuery([
        makeStore({ k_id: 'a', category_id: '601450', category_name: 'Beleza' }),
        makeStore({ k_id: 'b', category_id: '605196', category_name: 'Automotivo' }),
      ])
      const { result } = renderHook(() => useStores())
      expect(result.current.data).toHaveLength(2)
    })

    it('filters to only matching category when a category is selected', () => {
      setupUseQuery([
        makeStore({ k_id: 'a', category_id: '601450', category_name: 'Beleza' }),
        makeStore({ k_id: 'b', category_id: '605196', category_name: 'Automotivo' }),
        makeStore({ k_id: 'c', category_id: '601450', category_name: 'Beleza' }),
      ])
      const { result } = renderHook(() => useStores())

      act(() => result.current.setSelectedCategory('601450'))

      expect(result.current.data).toHaveLength(2)
      expect(result.current.data.every((s) => s.category_name === 'Beleza')).toBe(true)
    })
  })

  describe('sorting', () => {
    const storeA = makeStore({ k_id: 'a', revenue: 5000, revenue_growth_rate: 2, sales: 100, revenue_history: [10, 50] })
    const storeB = makeStore({ k_id: 'b', revenue: 9000, revenue_growth_rate: 8, sales: 300, revenue_history: [20, 90] })
    const storeC = makeStore({ k_id: 'c', revenue: 3000, revenue_growth_rate: 5, sales: 200, revenue_history: [30, 70] })

    it('sorts by revenue desc by default', () => {
      setupUseQuery([storeA, storeB, storeC])
      const { result } = renderHook(() => useStores())
      const revenues = result.current.data.map((s) => s.revenue)
      expect(revenues).toEqual([9000, 5000, 3000])
    })

    it('sorts by revenue asc when setSortOrder("asc") is called', () => {
      setupUseQuery([storeA, storeB, storeC])
      const { result } = renderHook(() => useStores())
      act(() => result.current.setSortOrder('asc'))
      const revenues = result.current.data.map((s) => s.revenue)
      expect(revenues).toEqual([3000, 5000, 9000])
    })

    it('sorts by sales when setSortKey("sales") is called', () => {
      setupUseQuery([storeA, storeB, storeC])
      const { result } = renderHook(() => useStores())
      act(() => {
        result.current.setSortKey('sales')
        result.current.setSortOrder('desc')
      })
      const sales = result.current.data.map((s) => s.sales)
      expect(sales).toEqual([300, 200, 100])
    })

    it('sorts by revenueGrowthRate desc', () => {
      setupUseQuery([storeA, storeB, storeC])
      const { result } = renderHook(() => useStores())
      act(() => result.current.setSortKey('revenueGrowthRate'))
      const rates = result.current.data.map((s) => s.revenue_growth_rate)
      expect(rates).toEqual([8, 5, 2])
    })

    it('sorts by revenueHistory (last element) desc', () => {
      setupUseQuery([storeA, storeB, storeC])
      const { result } = renderHook(() => useStores())
      act(() => result.current.setSortKey('revenueHistory'))
      // last elements: storeA=50, storeB=90, storeC=70 → desc: 90, 70, 50
      const lastRevenues = result.current.data.map(
        (s) => s.revenue_history[s.revenue_history.length - 1]
      )
      expect(lastRevenues).toEqual([90, 70, 50])
    })
  })

  describe('period-based revenue', () => {
    const storeA = makeStore({ k_id: 'a', revenue: 10000, revenue_7_days: 1000, revenue_14_days: 2000 })
    const storeB = makeStore({ k_id: 'b', revenue: 8000, revenue_7_days: 3000, revenue_14_days: 1500 })

    it('sorts and maps by 30-day revenue when period is "30"', () => {
      setupUseQuery([storeA, storeB])
      const { result } = renderHook(() => useStores())
      // default period is '30', sortKey 'revenue' desc
      const revenues = result.current.data.map((s) => s.revenue)
      expect(revenues).toEqual([10000, 8000])
    })

    it('sorts and maps by 7-day revenue when period is "7"', () => {
      setupUseQuery([storeA, storeB])
      const { result } = renderHook(() => useStores())
      act(() => result.current.setSelectedPeriod('7'))
      // storeB 7-day=3000 > storeA 7-day=1000
      const revenues = result.current.data.map((s) => s.revenue)
      expect(revenues).toEqual([3000, 1000])
    })

    it('sorts and maps by 14-day revenue when period is "14"', () => {
      setupUseQuery([storeA, storeB])
      const { result } = renderHook(() => useStores())
      act(() => result.current.setSelectedPeriod('14'))
      // storeA 14-day=2000 > storeB 14-day=1500
      const revenues = result.current.data.map((s) => s.revenue)
      expect(revenues).toEqual([2000, 1500])
    })

    it('falls back to revenue when revenue_7_days is missing', () => {
      const s = makeStore({ k_id: 'a', revenue: 5000, revenue_7_days: undefined })
      setupUseQuery([s])
      const { result } = renderHook(() => useStores())
      act(() => result.current.setSelectedPeriod('7'))
      expect(result.current.data[0].revenue).toBe(5000)
    })
  })

  describe('rank assignment', () => {
    it('assigns rank starting at 1 after sorting', () => {
      setupUseQuery([
        makeStore({ k_id: 'a', revenue: 5000 }),
        makeStore({ k_id: 'b', revenue: 9000 }),
        makeStore({ k_id: 'c', revenue: 3000 }),
      ])
      const { result } = renderHook(() => useStores())
      const ranks = result.current.data.map((s) => s.rank)
      expect(ranks).toEqual([1, 2, 3])
    })

    it('rank reflects sort order — rank 1 is the highest revenue desc', () => {
      setupUseQuery([
        makeStore({ k_id: 'a', revenue: 5000 }),
        makeStore({ k_id: 'b', revenue: 9000 }),
      ])
      const { result } = renderHook(() => useStores())
      expect(result.current.data[0].revenue).toBe(9000)
      expect(result.current.data[0].rank).toBe(1)
    })
  })

  describe('setters', () => {
    it('setCurrentPage updates currentPage', () => {
      const { result } = renderHook(() => useStores())
      act(() => result.current.setCurrentPage(3))
      expect(result.current.currentPage).toBe(3)
    })

    it('onPageChange updates currentPage', () => {
      const { result } = renderHook(() => useStores())
      act(() => result.current.onPageChange(4))
      expect(result.current.currentPage).toBe(4)
    })

    it('setSelectedCategory updates selectedCategory', () => {
      const { result } = renderHook(() => useStores())
      act(() => result.current.setSelectedCategory('601450'))
      expect(result.current.selectedCategory).toBe('601450')
    })

    it('setSelectedPeriod updates selectedPeriod', () => {
      const { result } = renderHook(() => useStores())
      act(() => result.current.setSelectedPeriod('7'))
      expect(result.current.selectedPeriod).toBe('7')
    })

    it('setSortKey updates sortKey', () => {
      const { result } = renderHook(() => useStores())
      act(() => result.current.setSortKey('sales'))
      expect(result.current.sortKey).toBe('sales')
    })

    it('setSortOrder updates sortOrder', () => {
      const { result } = renderHook(() => useStores())
      act(() => result.current.setSortOrder('asc'))
      expect(result.current.sortOrder).toBe('asc')
    })
  })
})
