import { renderHook, act } from '@testing-library/react'
import { useQuery } from 'convex/react'
import UseUser from '@/hooks/useUser'
import useVideos from '../useVideos'

jest.mock('convex/react', () => ({ useQuery: jest.fn() }))
jest.mock('@/convex/_generated/api', () => ({
  api: {
    videos: { getVideos: 'videos:getVideos' },
  },
}))
jest.mock('@/hooks/useUser', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('@/components/periodFilter', () => ({}), { virtual: true })

const mockUseQuery = useQuery as jest.Mock
const mockUseUser = UseUser as jest.Mock

const makeVideo = (overrides = {}) => ({
  video_id: 'vid_001',
  description: 'Test video',
  duration: '1:00',
  image: null,
  revenue: 1000,
  revenue_7_days: 700,
  revenue_14_days: 1400,
  sales: 100,
  views: 500_000,
  category_id: '601450',
  category_name: 'Beauty',
  tt_account: '@seller',
  ...overrides,
})

const defaultUser = {
  isFreeUser: false,
  isLoading: false,
  FREE_USER_ITEMS_PER_PAGE: 10,
}

const setupUseQuery = (videos: ReturnType<typeof makeVideo>[]) => {
  mockUseQuery.mockImplementation((query: string) => {
    if (query === 'videos:getVideos') return videos
    return undefined
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  mockUseUser.mockReturnValue(defaultUser)
  setupUseQuery([])
})

describe('useVideos', () => {
  describe('initial state', () => {
    it('starts on page 1', () => {
      const { result } = renderHook(() => useVideos())
      expect(result.current.currentPage).toBe(1)
    })

    it('starts with selectedCategory "all"', () => {
      const { result } = renderHook(() => useVideos())
      expect(result.current.selectedCategory).toBe('all')
    })

    it('starts with selectedPeriod "30"', () => {
      const { result } = renderHook(() => useVideos())
      expect(result.current.selectedPeriod).toBe('30')
    })

    it('exposes itemsPerPage as 12', () => {
      const { result } = renderHook(() => useVideos())
      expect(result.current.itemsPerPage).toBe(12)
    })

    it('returns empty data when no videos', () => {
      const { result } = renderHook(() => useVideos())
      expect(result.current.data).toEqual([])
    })
  })

  describe('loading state', () => {
    it('is loading when getVideos is null and user is loading', () => {
      mockUseUser.mockReturnValue({ ...defaultUser, isLoading: true })
      mockUseQuery.mockReturnValue(null)
      const { result } = renderHook(() => useVideos())
      expect(result.current.isLoading).toBe(true)
    })

    it('is not loading when getVideos has data', () => {
      mockUseUser.mockReturnValue({ ...defaultUser, isLoading: true })
      setupUseQuery([makeVideo()])
      const { result } = renderHook(() => useVideos())
      expect(result.current.isLoading).toBe(false)
    })

    it('is not loading when user is not loading even if getVideos is null', () => {
      mockUseUser.mockReturnValue({ ...defaultUser, isLoading: false })
      mockUseQuery.mockReturnValue(null)
      const { result } = renderHook(() => useVideos())
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('pagination', () => {
    it('returns up to 12 videos on the first page', () => {
      const videos = Array.from({ length: 15 }, (_, i) =>
        makeVideo({ video_id: `vid_${i}` })
      )
      setupUseQuery(videos)
      const { result } = renderHook(() => useVideos())
      expect(result.current.data).toHaveLength(12)
    })

    it('returns the remaining videos on the second page', () => {
      const videos = Array.from({ length: 15 }, (_, i) =>
        makeVideo({ video_id: `vid_${i}` })
      )
      setupUseQuery(videos)
      const { result } = renderHook(() => useVideos())
      act(() => result.current.onPageChange(2))
      expect(result.current.data).toHaveLength(3)
    })

    it('onPageChange updates currentPage', () => {
      const { result } = renderHook(() => useVideos())
      act(() => result.current.onPageChange(3))
      expect(result.current.currentPage).toBe(3)
    })

    it('setCurrentPage updates currentPage', () => {
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setCurrentPage(5))
      expect(result.current.currentPage).toBe(5)
    })
  })

  describe('category filtering', () => {
    it('returns all videos when selectedCategory is "all"', () => {
      const videos = [
        makeVideo({
          video_id: 'vid_1',
          category_id: '601450',
          category_name: 'Beauty',
        }),
        makeVideo({
          video_id: 'vid_2',
          category_id: '602284',
          category_name: 'Baby',
        }),
      ]
      setupUseQuery(videos)
      const { result } = renderHook(() => useVideos())
      expect(result.current.data).toHaveLength(2)
    })

    it('filters videos by selected category', () => {
      const videos = [
        makeVideo({
          video_id: 'vid_1',
          category_id: '601450',
          category_name: 'Beauty',
        }),
        makeVideo({
          video_id: 'vid_2',
          category_id: '602284',
          category_name: 'Baby',
        }),
        makeVideo({
          video_id: 'vid_3',
          category_id: '601450',
          category_name: 'Beauty',
        }),
      ]
      setupUseQuery(videos)
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setSelectedCategory('601450'))
      expect(result.current.data).toHaveLength(2)
      expect(
        result.current.data.every((v) => v.category_name === 'Beauty')
      ).toBe(true)
    })

    it('setSelectedCategory updates selectedCategory', () => {
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setSelectedCategory('601450'))
      expect(result.current.selectedCategory).toBe('601450')
    })
  })

  describe('categories derivation', () => {
    it('returns undefined categories when there are no videos', () => {
      setupUseQuery([])
      const { result } = renderHook(() => useVideos())
      expect(result.current.categories).toBeUndefined()
    })

    it('includes "Todas as categorias" as the first option', () => {
      setupUseQuery([
        makeVideo({ category_id: '601450', category_name: 'Beauty' }),
      ])
      const { result } = renderHook(() => useVideos())
      expect(result.current.categories![0]).toEqual({
        id: 'all',
        label: 'Todas as categorias',
      })
    })

    it('deduplicates categories with the same id', () => {
      setupUseQuery([
        makeVideo({
          video_id: 'vid_1',
          category_id: '601450',
          category_name: 'Beauty',
        }),
        makeVideo({
          video_id: 'vid_2',
          category_id: '601450',
          category_name: 'Beauty',
        }),
        makeVideo({
          video_id: 'vid_3',
          category_id: '602284',
          category_name: 'Baby',
        }),
      ])
      const { result } = renderHook(() => useVideos())
      expect(result.current.categories).toHaveLength(3) // "all" + 2 unique
    })

    it('sorts categories alphabetically by label', () => {
      setupUseQuery([
        makeVideo({
          video_id: 'vid_1',
          category_id: '602284',
          category_name: 'Baby',
        }),
        makeVideo({
          video_id: 'vid_2',
          category_id: '601450',
          category_name: 'Beauty',
        }),
        makeVideo({
          video_id: 'vid_3',
          category_id: '605196',
          category_name: 'Auto',
        }),
      ])
      const { result } = renderHook(() => useVideos())
      const labels = result.current.categories!.slice(1).map((c) => c.label)
      expect(labels).toEqual(['Auto', 'Baby', 'Beauty'])
    })

    it('excludes videos without category_name or category_id from categories', () => {
      setupUseQuery([
        makeVideo({
          video_id: 'vid_1',
          category_id: '601450',
          category_name: 'Beauty',
        }),
        makeVideo({
          video_id: 'vid_2',
          category_id: null,
          category_name: null,
        }),
      ])
      const { result } = renderHook(() => useVideos())
      expect(result.current.categories).toHaveLength(2) // "all" + 1
    })
  })

  describe('period selection', () => {
    it('uses revenue when selectedPeriod is "30"', () => {
      setupUseQuery([
        makeVideo({
          revenue: 1000,
          revenue_7_days: 700,
          revenue_14_days: 1400,
        }),
      ])
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setSelectedPeriod('30'))
      expect(result.current.data[0].revenue).toBe(1000)
    })

    it('uses revenue_7_days when selectedPeriod is "7"', () => {
      setupUseQuery([
        makeVideo({
          revenue: 1000,
          revenue_7_days: 700,
          revenue_14_days: 1400,
        }),
      ])
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setSelectedPeriod('7'))
      expect(result.current.data[0].revenue).toBe(700)
    })

    it('uses revenue_14_days when selectedPeriod is "14"', () => {
      setupUseQuery([
        makeVideo({
          revenue: 1000,
          revenue_7_days: 700,
          revenue_14_days: 1400,
        }),
      ])
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setSelectedPeriod('14'))
      expect(result.current.data[0].revenue).toBe(1400)
    })

    it('falls back to revenue when revenue_7_days is missing and period is "7"', () => {
      setupUseQuery([makeVideo({ revenue: 1000, revenue_7_days: undefined })])
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setSelectedPeriod('7'))
      expect(result.current.data[0].revenue).toBe(1000)
    })

    it('setSelectedPeriod updates selectedPeriod', () => {
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setSelectedPeriod('7'))
      expect(result.current.selectedPeriod).toBe('7')
    })
  })

  describe('rank assignment', () => {
    it('assigns rank starting from 1 based on position', () => {
      setupUseQuery([
        makeVideo({ video_id: 'vid_1' }),
        makeVideo({ video_id: 'vid_2' }),
        makeVideo({ video_id: 'vid_3' }),
      ])
      const { result } = renderHook(() => useVideos())
      expect(result.current.data[0].rank).toBe(1)
      expect(result.current.data[1].rank).toBe(2)
      expect(result.current.data[2].rank).toBe(3)
    })
  })

  describe('free user limit', () => {
    it('limits data to FREE_USER_ITEMS_PER_PAGE for free users', () => {
      mockUseUser.mockReturnValue({
        ...defaultUser,
        isFreeUser: true,
        FREE_USER_ITEMS_PER_PAGE: 10,
      })
      setupUseQuery(
        Array.from({ length: 20 }, (_, i) =>
          makeVideo({ video_id: `vid_${i}` })
        )
      )
      const { result } = renderHook(() => useVideos())
      expect(result.current.data.length).toBeLessThanOrEqual(10)
    })

    it('does not limit data for non-free users', () => {
      setupUseQuery(
        Array.from({ length: 15 }, (_, i) =>
          makeVideo({ video_id: `vid_${i}` })
        )
      )
      const { result } = renderHook(() => useVideos())
      expect(result.current.data).toHaveLength(12)
    })
  })

  describe('return values', () => {
    it('exposes isFreeUser from UseUser', () => {
      mockUseUser.mockReturnValue({ ...defaultUser, isFreeUser: true })
      const { result } = renderHook(() => useVideos())
      expect(result.current.isFreeUser).toBe(true)
    })
  })
})
