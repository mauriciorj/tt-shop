import { renderHook, act } from '@testing-library/react'
import { useQuery } from 'convex/react'
import UseUser from '@/hooks/useUser'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { toast } from 'sonner'
import useVideoTranscriptionGenerate from '../useVideoTranscriptionGenerate'
import { ITopVideosWithCategory } from '@/videos/types'

jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
}))
jest.mock('@/convex/_generated/api', () => ({
  api: {
    users: {
      getTranscriptionUsageToday: 'users:getTranscriptionUsageToday',
    },
  },
}))
jest.mock('@/hooks/useUser', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('@/hooks/useCopyToClipboard', () => ({
  __esModule: true,
  default: jest.fn(),
}))
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }))

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

const mockUseQuery = useQuery as jest.Mock
const mockUseUser = UseUser as jest.Mock
const mockUseCopyToClipboard = useCopyToClipboard as jest.Mock
const mockToast = toast as jest.Mocked<typeof toast>

const makeVideo = (overrides = {}): ITopVideosWithCategory => ({
  video_id: 'vid-001',
  description: 'Amazing product review',
  duration: '1:00',
  image: null,
  revenue: 1000,
  sales: 100,
  views: 500_000,
  transcription: 'ABCDEFGH',
  tt_account: '@seller',
  ...overrides,
})

const defaultUser = {
  id: 'user_abc',
  isFreeUser: false,
  isLoading: false,
  FREE_USER_ITEMS_PER_PAGE: 10,
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers()
  mockUseUser.mockReturnValue(defaultUser)
  mockUseQuery.mockReturnValue({ isAllowed: true })
  mockUseCopyToClipboard.mockReturnValue({
    isCopied: false,
    setTextToCopy: jest.fn(),
  })
})

afterEach(() => {
  jest.useRealTimers()
})

describe('useVideoTranscriptionGenerate', () => {
  describe('initial state', () => {
    it('starts with video as null', () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      expect(result.current.video).toBeNull()
    })

    it('starts with isLoading as false', () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      expect(result.current.isLoading).toBe(false)
    })

    it('starts with transcription as empty string', () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      expect(result.current.transcription).toBe('')
    })

    it('returns isCopied from useCopyToClipboard', () => {
      mockUseCopyToClipboard.mockReturnValue({
        isCopied: true,
        setTextToCopy: jest.fn(),
      })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      expect(result.current.isCopied).toBe(true)
    })

    it('returns setTextToCopy from useCopyToClipboard', () => {
      const mockSetTextToCopy = jest.fn()
      mockUseCopyToClipboard.mockReturnValue({
        isCopied: false,
        setTextToCopy: mockSetTextToCopy,
      })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      expect(result.current.setTextToCopy).toBe(mockSetTextToCopy)
    })
  })

  describe('setVideo', () => {
    it('setVideo updates the video', () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      const video = makeVideo()
      act(() => result.current.setVideo(video))
      expect(result.current.video).toEqual(video)
    })

    it('setVideo can reset video to null', () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      act(() => result.current.setVideo(makeVideo()))
      act(() => result.current.setVideo(null))
      expect(result.current.video).toBeNull()
    })
  })

  describe('handleOpenDialog — paid user', () => {
    it('sets the video', async () => {
      const video = makeVideo()
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenDialog(video))
      expect(result.current.video).toEqual(video)
    })

    it('passes "skip" to the query for paid users', () => {
      renderHook(() => useVideoTranscriptionGenerate())
      expect(mockUseQuery).toHaveBeenCalledWith(
        'users:getTranscriptionUsageToday',
        'skip'
      )
    })

    it('sets isLoading to true immediately after opening', async () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenDialog(makeVideo()))
      expect(result.current.isLoading).toBe(true)
    })

    it('resets transcription to empty on open', async () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenDialog(makeVideo()))
      expect(result.current.transcription).toBe('')
    })

    it('builds transcription incrementally via interval (chunk=4, tick=30ms)', async () => {
      const video = makeVideo({ transcription: 'ABCDEFGH' })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenDialog(video))

      act(() => jest.advanceTimersByTime(30))
      expect(result.current.transcription).toBe('ABCD')

      act(() => jest.advanceTimersByTime(30))
      expect(result.current.transcription).toBe('ABCDEFGH')
    })

    it('sets isLoading to false once animation completes', async () => {
      const video = makeVideo({ transcription: 'ABCDEFGH' })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenDialog(video))

      act(() => jest.advanceTimersByTime(60))
      expect(result.current.isLoading).toBe(false)
    })

    it('sets the full transcription text once animation completes', async () => {
      const video = makeVideo({ transcription: 'Hello' })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenDialog(video))

      act(() => jest.advanceTimersByTime(30))
      act(() => jest.advanceTimersByTime(30))
      expect(result.current.transcription).toBe('Hello')
    })

    it('handles a video with no transcription (empty string)', async () => {
      const video = makeVideo({ transcription: '' })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenDialog(video))
      act(() => jest.advanceTimersByTime(30))
      expect(result.current.transcription).toBe('')
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('handleOpenDialog — free user', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({ ...defaultUser, isFreeUser: true })
    })

    it('passes clerk_id to the query when userId is available', () => {
      renderHook(() => useVideoTranscriptionGenerate())
      expect(mockUseQuery).toHaveBeenCalledWith(
        'users:getTranscriptionUsageToday',
        { clerk_id: 'user_abc' }
      )
    })

    it('sets the video and starts animation when isAllowed is true', async () => {
      mockUseQuery.mockReturnValue({ isAllowed: true })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenDialog(makeVideo()))
      expect(result.current.video).not.toBeNull()
      expect(result.current.isLoading).toBe(true)
    })

    it('shows a toast error and leaves video null when isAllowed is false', async () => {
      mockUseQuery.mockReturnValue({ isAllowed: false })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenDialog(makeVideo()))
      expect(result.current.video).toBeNull()
      expect(mockToast.error).toHaveBeenCalledTimes(1)
    })

    it('includes a "Ver planos" action in the toast that navigates to /subscription', async () => {
      mockUseQuery.mockReturnValue({ isAllowed: false })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenDialog(makeVideo()))
      const toastArg = mockToast.error.mock.calls[0][1] as {
        action: { label: string; onClick: () => void }
      }
      toastArg.action.onClick()
      expect(mockPush).toHaveBeenCalledWith('/subscription')
    })
  })

  describe('cleanup effect', () => {
    it('resets isLoading to false when video is set to null', async () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenDialog(makeVideo()))
      expect(result.current.isLoading).toBe(true)
      act(() => result.current.setVideo(null))
      expect(result.current.isLoading).toBe(false)
    })

    it('resets transcription to empty string when video is set to null', async () => {
      const video = makeVideo({ transcription: 'ABCDEFGH' })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenDialog(video))
      act(() => jest.advanceTimersByTime(30))
      expect(result.current.transcription).toBe('ABCD')
      act(() => result.current.setVideo(null))
      expect(result.current.transcription).toBe('')
    })
  })
})
