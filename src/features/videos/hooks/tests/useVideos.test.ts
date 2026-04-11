import { renderHook, act } from '@testing-library/react'
import { useQuery, useMutation } from 'convex/react'
import UseUser from '@/hooks/useUser'
import { toast } from 'sonner'
import useVideos from '../useVideos'

jest.mock('convex/react', () => ({ useQuery: jest.fn(), useMutation: jest.fn() }))
jest.mock('@convex-dev/react-query', () => ({ convexQuery: jest.fn(() => ({})) }))
jest.mock('@/convex/_generated/api', () => ({
  api: {
    videos: { getAllVideos: 'videos:getAllVideos' },
    savedVideos: {
      getSavedVideoIds: 'savedVideos:getSavedVideoIds',
      toggleSavedVideo: 'savedVideos:toggleSavedVideo',
    },
    users: { recordTranscriptionAndCheckLimit: 'users:recordTranscriptionAndCheckLimit' },
  },
}))
jest.mock('@/hooks/useUser', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('@/components/periodFilter', () => ({}), { virtual: true })
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }))

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

const mockUseQuery = useQuery as jest.Mock
const mockUseMutation = useMutation as jest.Mock
const mockUseUser = UseUser as jest.Mock
const mockToast = toast as jest.Mocked<typeof toast>

const mockClipboard = { writeText: jest.fn() }
Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
})

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
  id: 'user_abc',
  isFreeUser: false,
  isLoading: false,
  FREE_USER_ITEMS_PER_PAGE: 10,
  userSubscriptionPlan: 'pro',
}

// useQuery is called twice in the hook:
//  1st call → savedVideoIds (convex/react native)
//  2nd call → getAllVideos  (convex/react native)
const setupUseQuery = (videos: ReturnType<typeof makeVideo>[], savedIds: string[] = []) => {
  mockUseQuery.mockImplementation((query: string) => {
    if (query === 'savedVideos:getSavedVideoIds') return savedIds
    if (query === 'videos:getAllVideos') return videos
    return undefined
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  mockUseUser.mockReturnValue(defaultUser)
  mockUseMutation.mockReturnValue(jest.fn().mockResolvedValue({ saved: true }))
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

    it('starts with selectedVideo as null', () => {
      const { result } = renderHook(() => useVideos())
      expect(result.current.selectedVideo).toBeNull()
    })

    it('starts with copied as false', () => {
      const { result } = renderHook(() => useVideos())
      expect(result.current.copied).toBe(false)
    })
  })

  describe('loading state', () => {
    it('is loading when getAllVideos is null and user is loading', () => {
      mockUseUser.mockReturnValue({ ...defaultUser, isLoading: true })
      mockUseQuery.mockReturnValue(null)
      const { result } = renderHook(() => useVideos())
      expect(result.current.isLoading).toBe(true)
    })

    it('is not loading when getAllVideos has data', () => {
      mockUseUser.mockReturnValue({ ...defaultUser, isLoading: true })
      setupUseQuery([makeVideo()])
      const { result } = renderHook(() => useVideos())
      expect(result.current.isLoading).toBe(false)
    })

    it('is not loading when user is not loading even if getAllVideos is null', () => {
      mockUseUser.mockReturnValue({ ...defaultUser, isLoading: false })
      mockUseQuery.mockReturnValue(null)
      const { result } = renderHook(() => useVideos())
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('savedVideoIds', () => {
    it('exposes savedVideoIds from convex', () => {
      setupUseQuery([makeVideo()], ['vid_001', 'vid_002'])
      const { result } = renderHook(() => useVideos())
      expect(result.current.savedVideoIds).toEqual(['vid_001', 'vid_002'])
    })

    it('exposes empty savedVideoIds when none saved', () => {
      setupUseQuery([], [])
      const { result } = renderHook(() => useVideos())
      expect(result.current.savedVideoIds).toEqual([])
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
        makeVideo({ video_id: 'vid_1', category_id: '601450', category_name: 'Beauty' }),
        makeVideo({ video_id: 'vid_2', category_id: '602284', category_name: 'Baby' }),
      ]
      setupUseQuery(videos)
      const { result } = renderHook(() => useVideos())
      expect(result.current.data).toHaveLength(2)
    })

    it('filters videos by selected category', () => {
      const videos = [
        makeVideo({ video_id: 'vid_1', category_id: '601450', category_name: 'Beauty' }),
        makeVideo({ video_id: 'vid_2', category_id: '602284', category_name: 'Baby' }),
        makeVideo({ video_id: 'vid_3', category_id: '601450', category_name: 'Beauty' }),
      ]
      setupUseQuery(videos)
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setSelectedCategory('601450'))
      expect(result.current.data).toHaveLength(2)
      expect(result.current.data.every((v) => v.category_name === 'Beauty')).toBe(true)
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
      setupUseQuery([makeVideo({ category_id: '601450', category_name: 'Beauty' })])
      const { result } = renderHook(() => useVideos())
      expect(result.current.categories![0]).toEqual({ id: 'all', label: 'Todas as categorias' })
    })

    it('deduplicates categories with the same id', () => {
      setupUseQuery([
        makeVideo({ video_id: 'vid_1', category_id: '601450', category_name: 'Beauty' }),
        makeVideo({ video_id: 'vid_2', category_id: '601450', category_name: 'Beauty' }),
        makeVideo({ video_id: 'vid_3', category_id: '602284', category_name: 'Baby' }),
      ])
      const { result } = renderHook(() => useVideos())
      expect(result.current.categories).toHaveLength(3) // "all" + 2 unique
    })

    it('sorts categories alphabetically by label', () => {
      setupUseQuery([
        makeVideo({ video_id: 'vid_1', category_id: '602284', category_name: 'Baby' }),
        makeVideo({ video_id: 'vid_2', category_id: '601450', category_name: 'Beauty' }),
        makeVideo({ video_id: 'vid_3', category_id: '605196', category_name: 'Auto' }),
      ])
      const { result } = renderHook(() => useVideos())
      const labels = result.current.categories!.slice(1).map((c) => c.label)
      expect(labels).toEqual(['Auto', 'Baby', 'Beauty'])
    })

    it('excludes videos without category_name or category_id from categories', () => {
      setupUseQuery([
        makeVideo({ video_id: 'vid_1', category_id: '601450', category_name: 'Beauty' }),
        makeVideo({ video_id: 'vid_2', category_id: null, category_name: null }),
      ])
      const { result } = renderHook(() => useVideos())
      expect(result.current.categories).toHaveLength(2) // "all" + 1
    })
  })

  describe('period selection', () => {
    it('uses revenue when selectedPeriod is "30"', () => {
      setupUseQuery([makeVideo({ revenue: 1000, revenue_7_days: 700, revenue_14_days: 1400 })])
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setSelectedPeriod('30'))
      expect(result.current.data[0].revenue).toBe(1000)
    })

    it('uses revenue_7_days when selectedPeriod is "7"', () => {
      setupUseQuery([makeVideo({ revenue: 1000, revenue_7_days: 700, revenue_14_days: 1400 })])
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setSelectedPeriod('7'))
      expect(result.current.data[0].revenue).toBe(700)
    })

    it('uses revenue_14_days when selectedPeriod is "14"', () => {
      setupUseQuery([makeVideo({ revenue: 1000, revenue_7_days: 700, revenue_14_days: 1400 })])
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
      mockUseUser.mockReturnValue({ ...defaultUser, isFreeUser: true, FREE_USER_ITEMS_PER_PAGE: 10 })
      setupUseQuery(Array.from({ length: 20 }, (_, i) => makeVideo({ video_id: `vid_${i}` })))
      const { result } = renderHook(() => useVideos())
      expect(result.current.data.length).toBeLessThanOrEqual(10)
    })

    it('does not limit data for non-free users', () => {
      setupUseQuery(Array.from({ length: 15 }, (_, i) => makeVideo({ video_id: `vid_${i}` })))
      const { result } = renderHook(() => useVideos())
      expect(result.current.data).toHaveLength(12)
    })
  })

  describe('handleToggleSave', () => {
    it('calls toggleSaved mutation with correct args', async () => {
      const mockToggle = jest.fn().mockResolvedValue({ saved: true })
      mockUseMutation.mockReturnValue(mockToggle)
      setupUseQuery([makeVideo()])
      const { result } = renderHook(() => useVideos())
      await act(() => result.current.handleToggleSave('vid_001'))
      expect(mockToggle).toHaveBeenCalledWith({ clerk_id: 'user_abc', video_k_id: 'vid_001' })
    })
  })

  describe('selectedVideo', () => {
    it('setSelectedVideo updates selectedVideo', () => {
      const video = makeVideo()
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setSelectedVideo(video as any))
      expect(result.current.selectedVideo).toEqual(video)
    })

    it('setSelectedVideo can be reset to null', () => {
      const video = makeVideo()
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setSelectedVideo(video as any))
      act(() => result.current.setSelectedVideo(null))
      expect(result.current.selectedVideo).toBeNull()
    })
  })

  describe('return values', () => {
    it('exposes isFreeUser from UseUser', () => {
      mockUseUser.mockReturnValue({ ...defaultUser, isFreeUser: true })
      const { result } = renderHook(() => useVideos())
      expect(result.current.isFreeUser).toBe(true)
    })

    it('exposes userSubscriptionPlan from UseUser', () => {
      mockUseUser.mockReturnValue({ ...defaultUser, userSubscriptionPlan: 'enterprise' })
      const { result } = renderHook(() => useVideos())
      expect(result.current.userSubscriptionPlan).toBe('enterprise')
    })
  })

  describe('transcription — initial state', () => {
    it('starts with isTranscribing as false', () => {
      const { result } = renderHook(() => useVideos())
      expect(result.current.isTranscribing).toBe(false)
    })

    it('starts with displayedTranscription as empty string', () => {
      const { result } = renderHook(() => useVideos())
      expect(result.current.displayedTranscription).toBe('')
    })
  })

  describe('handleOpenTranscription — paid user', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      const mockRecord = jest.fn().mockResolvedValue({ allowed: true })
      mockUseMutation.mockImplementation((mutation: string) => {
        if (mutation === 'users:recordTranscriptionAndCheckLimit') return mockRecord
        return jest.fn().mockResolvedValue({ saved: true })
      })
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('sets selectedVideo', async () => {
      const video = makeVideo()
      const { result } = renderHook(() => useVideos())
      await act(async () => result.current.handleOpenTranscription(video as any))
      expect(result.current.selectedVideo).toEqual(video)
    })

    it('does not call recordTranscription for paid users', async () => {
      const mockRecord = jest.fn().mockResolvedValue({ allowed: true })
      mockUseMutation.mockReturnValue(mockRecord)
      const { result } = renderHook(() => useVideos())
      await act(async () => result.current.handleOpenTranscription(makeVideo() as any))
      expect(mockRecord).not.toHaveBeenCalled()
    })

    it('sets isTranscribing to true immediately after opening', async () => {
      const { result } = renderHook(() => useVideos())
      await act(async () => result.current.handleOpenTranscription(makeVideo() as any))
      expect(result.current.isTranscribing).toBe(true)
    })

    it('builds displayedTranscription incrementally via interval', async () => {
      const video = makeVideo({ transcription: 'ABCDEFGH' })
      const { result } = renderHook(() => useVideos())
      await act(async () => result.current.handleOpenTranscription(video as any))

      act(() => jest.advanceTimersByTime(30))
      expect(result.current.displayedTranscription).toBe('ABCD')

      act(() => jest.advanceTimersByTime(30))
      expect(result.current.displayedTranscription).toBe('ABCDEFGH')
    })

    it('sets isTranscribing to false once animation completes', async () => {
      const video = makeVideo({ transcription: 'ABCDEFGH' })
      const { result } = renderHook(() => useVideos())
      await act(async () => result.current.handleOpenTranscription(video as any))
      act(() => jest.advanceTimersByTime(60))
      expect(result.current.isTranscribing).toBe(false)
    })
  })

  describe('handleOpenTranscription — free user', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      mockUseUser.mockReturnValue({ ...defaultUser, isFreeUser: true })
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('proceeds and sets selectedVideo when allowed', async () => {
      mockUseMutation.mockImplementation((mutation: string) => {
        if (mutation === 'users:recordTranscriptionAndCheckLimit')
          return jest.fn().mockResolvedValue({ allowed: true })
        return jest.fn().mockResolvedValue({ saved: true })
      })
      const { result } = renderHook(() => useVideos())
      await act(async () => result.current.handleOpenTranscription(makeVideo() as any))
      expect(result.current.selectedVideo).not.toBeNull()
    })

    it('shows a toast error and leaves selectedVideo null when not allowed', async () => {
      mockUseMutation.mockImplementation((mutation: string) => {
        if (mutation === 'users:recordTranscriptionAndCheckLimit')
          return jest.fn().mockResolvedValue({ allowed: false })
        return jest.fn().mockResolvedValue({ saved: true })
      })
      const { result } = renderHook(() => useVideos())
      await act(async () => result.current.handleOpenTranscription(makeVideo() as any))
      expect(result.current.selectedVideo).toBeNull()
      expect(mockToast.error).toHaveBeenCalledTimes(1)
    })

    it('toast action navigates to /subscription when not allowed', async () => {
      mockUseMutation.mockImplementation((mutation: string) => {
        if (mutation === 'users:recordTranscriptionAndCheckLimit')
          return jest.fn().mockResolvedValue({ allowed: false })
        return jest.fn().mockResolvedValue({ saved: true })
      })
      const { result } = renderHook(() => useVideos())
      await act(async () => result.current.handleOpenTranscription(makeVideo() as any))
      const toastArg = mockToast.error.mock.calls[0][1] as {
        action: { label: string; onClick: () => void }
      }
      toastArg.action.onClick()
      expect(mockPush).toHaveBeenCalledWith('/subscription')
    })
  })

  describe('handleCopy', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      mockUseMutation.mockImplementation((mutation: string) => {
        if (mutation === 'users:recordTranscriptionAndCheckLimit')
          return jest.fn().mockResolvedValue({ allowed: true })
        return jest.fn().mockResolvedValue({ saved: true })
      })
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('does nothing when selectedVideo has no transcription', async () => {
      const { result } = renderHook(() => useVideos())
      act(() => result.current.setSelectedVideo(makeVideo({ transcription: undefined }) as any))
      await act(async () => result.current.handleCopy())
      expect(mockClipboard.writeText).not.toHaveBeenCalled()
    })

    it('copies the transcription to the clipboard', async () => {
      const { result } = renderHook(() => useVideos())
      await act(async () =>
        result.current.handleOpenTranscription(makeVideo({ transcription: 'Full text' }) as any)
      )
      await act(async () => result.current.handleCopy())
      expect(mockClipboard.writeText).toHaveBeenCalledWith('Full text')
    })

    it('sets copied to true after copying', async () => {
      const { result } = renderHook(() => useVideos())
      await act(async () =>
        result.current.handleOpenTranscription(makeVideo({ transcription: 'Some text' }) as any)
      )
      await act(async () => result.current.handleCopy())
      expect(result.current.copied).toBe(true)
    })

    it('resets copied to false after 2 seconds', async () => {
      const { result } = renderHook(() => useVideos())
      await act(async () =>
        result.current.handleOpenTranscription(makeVideo({ transcription: 'Some text' }) as any)
      )
      await act(async () => result.current.handleCopy())
      expect(result.current.copied).toBe(true)
      act(() => jest.advanceTimersByTime(2000))
      expect(result.current.copied).toBe(false)
    })
  })

  describe('transcription cleanup effect', () => {
    beforeEach(() => {
      jest.useFakeTimers()
      mockUseMutation.mockImplementation((mutation: string) => {
        if (mutation === 'users:recordTranscriptionAndCheckLimit')
          return jest.fn().mockResolvedValue({ allowed: true })
        return jest.fn().mockResolvedValue({ saved: true })
      })
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('resets isTranscribing to false when selectedVideo is set to null', async () => {
      const { result } = renderHook(() => useVideos())
      await act(async () =>
        result.current.handleOpenTranscription(makeVideo() as any)
      )
      expect(result.current.isTranscribing).toBe(true)
      act(() => result.current.setSelectedVideo(null))
      expect(result.current.isTranscribing).toBe(false)
    })

    it('resets displayedTranscription to empty string when selectedVideo is set to null', async () => {
      const video = makeVideo({ transcription: 'ABCDEFGH' })
      const { result } = renderHook(() => useVideos())
      await act(async () => result.current.handleOpenTranscription(video as any))
      act(() => jest.advanceTimersByTime(30))
      expect(result.current.displayedTranscription).toBe('ABCD')
      act(() => result.current.setSelectedVideo(null))
      expect(result.current.displayedTranscription).toBe('')
    })
  })
})
