import { renderHook, act } from '@testing-library/react'
import { useMutation } from 'convex/react'
import UseUser from '@/hooks/useUser'
import { toast } from 'sonner'
import useVideoTranscriptionGenerate from '../useVideoTranscriptionGenerate'
import { ITopVideosWithCategory } from '@/videos/types'

jest.mock('convex/react', () => ({ useMutation: jest.fn(), useQuery: jest.fn() }))
jest.mock('@/convex/_generated/api', () => ({
  api: {
    users: {
      recordTranscriptionAndCheckLimit:
        'users:recordTranscriptionAndCheckLimit',
    },
  },
}))
jest.mock('@/hooks/useUser', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }))

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

const mockUseMutation = useMutation as jest.Mock
const mockUseUser = UseUser as jest.Mock
const mockToast = toast as jest.Mocked<typeof toast>

const mockClipboard = { writeText: jest.fn() }
Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
})

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
  mockUseMutation.mockReturnValue(jest.fn().mockResolvedValue({ allowed: true }))
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

    it('starts with copied as false', () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      expect(result.current.copied).toBe(false)
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

  describe('handleOpenTranscription — paid user', () => {
    it('sets the video', async () => {
      const video = makeVideo()
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenTranscription(video))
      expect(result.current.video).toEqual(video)
    })

    it('does not call recordTranscription for paid users', async () => {
      const mockRecord = jest.fn().mockResolvedValue({ allowed: true })
      mockUseMutation.mockReturnValue(mockRecord)
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenTranscription(makeVideo()))
      expect(mockRecord).not.toHaveBeenCalled()
    })

    it('sets isLoading to true immediately after opening', async () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenTranscription(makeVideo()))
      expect(result.current.isLoading).toBe(true)
    })

    it('resets displayedTranscription to empty on open', async () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenTranscription(makeVideo()))
      // Before any ticks, transcription starts empty
      expect(result.current.transcription).toBe('')
    })

    it('builds transcription incrementally via interval (chunk=4, tick=30ms)', async () => {
      const video = makeVideo({ transcription: 'ABCDEFGH' })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenTranscription(video))

      act(() => jest.advanceTimersByTime(30))
      expect(result.current.transcription).toBe('ABCD')

      act(() => jest.advanceTimersByTime(30))
      expect(result.current.transcription).toBe('ABCDEFGH')
    })

    it('sets isLoading to false once animation completes', async () => {
      const video = makeVideo({ transcription: 'ABCDEFGH' })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenTranscription(video))

      act(() => jest.advanceTimersByTime(60)) // two ticks covers 8 chars
      expect(result.current.isLoading).toBe(false)
    })

    it('sets the full transcription text once animation completes', async () => {
      const video = makeVideo({ transcription: 'Hello' })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenTranscription(video))

      act(() => jest.advanceTimersByTime(30)) // one tick covers 4 chars → 'Hell'
      act(() => jest.advanceTimersByTime(30)) // second tick exceeds length → full text
      expect(result.current.transcription).toBe('Hello')
    })

    it('handles a video with no transcription (empty string)', async () => {
      const video = makeVideo({ transcription: '' })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenTranscription(video))
      act(() => jest.advanceTimersByTime(30))
      expect(result.current.transcription).toBe('')
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('handleOpenTranscription — free user', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({ ...defaultUser, isFreeUser: true })
    })

    it('calls recordTranscription with clerk_id and video_k_id', async () => {
      const mockRecord = jest.fn().mockResolvedValue({ allowed: true })
      mockUseMutation.mockReturnValue(mockRecord)
      const video = makeVideo()
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenTranscription(video))
      expect(mockRecord).toHaveBeenCalledWith({
        clerk_id: 'user_abc',
        video_k_id: 'vid-001',
      })
    })

    it('sets the video and starts animation when allowed', async () => {
      mockUseMutation.mockReturnValue(
        jest.fn().mockResolvedValue({ allowed: true })
      )
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () =>
        result.current.handleOpenTranscription(makeVideo())
      )
      expect(result.current.video).not.toBeNull()
      expect(result.current.isLoading).toBe(true)
    })

    it('shows a toast error and leaves video null when not allowed', async () => {
      mockUseMutation.mockReturnValue(
        jest.fn().mockResolvedValue({ allowed: false })
      )
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () =>
        result.current.handleOpenTranscription(makeVideo())
      )
      expect(result.current.video).toBeNull()
      expect(mockToast.error).toHaveBeenCalledTimes(1)
    })

    it('includes a "Ver planos" action in the toast that navigates to /subscription', async () => {
      mockUseMutation.mockReturnValue(
        jest.fn().mockResolvedValue({ allowed: false })
      )
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () =>
        result.current.handleOpenTranscription(makeVideo())
      )
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
      await act(async () =>
        result.current.handleOpenTranscription(makeVideo())
      )
      expect(result.current.isLoading).toBe(true)
      act(() => result.current.setVideo(null))
      expect(result.current.isLoading).toBe(false)
    })

    it('resets transcription to empty string when video is set to null', async () => {
      const video = makeVideo({ transcription: 'ABCDEFGH' })
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      await act(async () => result.current.handleOpenTranscription(video))
      act(() => jest.advanceTimersByTime(30))
      expect(result.current.transcription).toBe('ABCD')
      act(() => result.current.setVideo(null))
      expect(result.current.transcription).toBe('')
    })
  })

  describe('handleCopy', () => {
    it('does nothing when video has no transcription', async () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      act(() => result.current.setVideo(makeVideo({ transcription: undefined })))
      await act(async () => result.current.handleCopy())
      expect(mockClipboard.writeText).not.toHaveBeenCalled()
    })

    it('copies the video transcription to the clipboard', async () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      act(() =>
        result.current.setVideo(makeVideo({ transcription: 'Full text' }))
      )
      await act(async () => result.current.handleCopy())
      expect(mockClipboard.writeText).toHaveBeenCalledWith('Full text')
    })

    it('shows a success toast after copying', async () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      act(() => result.current.setVideo(makeVideo()))
      await act(async () => result.current.handleCopy())
      expect(mockToast.success).toHaveBeenCalledWith(
        'Transcrição copiada para a área de transferência.'
      )
    })

    it('sets copied to true after copying', async () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      act(() => result.current.setVideo(makeVideo()))
      await act(async () => result.current.handleCopy())
      expect(result.current.copied).toBe(true)
    })

    it('resets copied to false after 2 seconds', async () => {
      const { result } = renderHook(() => useVideoTranscriptionGenerate())
      act(() => result.current.setVideo(makeVideo()))
      await act(async () => result.current.handleCopy())
      expect(result.current.copied).toBe(true)
      act(() => jest.advanceTimersByTime(2000))
      expect(result.current.copied).toBe(false)
    })
  })
})
