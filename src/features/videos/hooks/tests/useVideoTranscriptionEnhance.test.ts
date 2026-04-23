import { renderHook, act } from '@testing-library/react'
import { useQuery } from 'convex/react'
import UseUser from '@/hooks/useUser'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import useVideoTranscriptionEnhance from '../useVideoTranscriptionEnhance'
import { ITopVideosWithCategory } from '@/videos/types'

jest.mock('convex/react', () => ({ useQuery: jest.fn() }))
jest.mock('@/convex/_generated/api', () => ({
  api: {
    users: {
      getEnhancementUsageTodayAndWeekly:
        'users:getEnhancementUsageTodayAndWeekly',
    },
  },
}))
jest.mock('@/hooks/useUser', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('@/hooks/useCopyToClipboard', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const mockUseQuery = useQuery as jest.Mock
const mockUseUser = UseUser as jest.Mock
const mockUseCopyToClipboard = useCopyToClipboard as jest.Mock

global.fetch = jest.fn()

const makeVideo = (overrides = {}): ITopVideosWithCategory => ({
  video_id: 'vid-001',
  description: 'Test video',
  duration: '1:00',
  image: null,
  revenue: 1000,
  sales: 100,
  views: 500_000,
  transcription: 'Original transcription.',
  tt_account: '@seller',
  ...overrides,
})

const mockFetch = global.fetch as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers()
  mockUseUser.mockReturnValue({ id: 'user_123' })
  mockUseQuery.mockReturnValue({ used: 0, limit: 1, period: 'day' })
  mockUseCopyToClipboard.mockReturnValue({
    isCopied: false,
    setTextToCopy: jest.fn(),
  })
})

afterEach(() => {
  jest.useRealTimers()
})

describe('useVideoTranscriptionEnhance', () => {
  describe('initial state', () => {
    it('starts with videoToGetTranscription as null', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      expect(result.current.videoToGetTranscription).toBeNull()
    })

    it('starts with instruction as empty string', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      expect(result.current.instruction).toBe('')
    })

    it('starts with status as "idle"', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      expect(result.current.status).toBe('idle')
    })

    it('starts with transcriptionEnhanced as empty string', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      expect(result.current.transcriptionEnhanced).toBe('')
    })

    it('starts with errorMessage as empty string', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      expect(result.current.errorMessage).toBe('')
    })

    it('returns isCopied from useCopyToClipboard', () => {
      mockUseCopyToClipboard.mockReturnValue({
        isCopied: true,
        setTextToCopy: jest.fn(),
      })
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      expect(result.current.isCopied).toBe(true)
    })

    it('returns setTextToCopy from useCopyToClipboard', () => {
      const mockSetTextToCopy = jest.fn()
      mockUseCopyToClipboard.mockReturnValue({
        isCopied: false,
        setTextToCopy: mockSetTextToCopy,
      })
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      expect(result.current.setTextToCopy).toBe(mockSetTextToCopy)
    })
  })

  describe('setVideoToGetTranscription / setInstruction', () => {
    it('setVideoToGetTranscription updates the video', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      const video = makeVideo()
      act(() => result.current.setVideoToGetTranscription(video))
      expect(result.current.videoToGetTranscription).toEqual(video)
    })

    it('setVideoToGetTranscription can reset to null', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setVideoToGetTranscription(makeVideo()))
      act(() => result.current.setVideoToGetTranscription(null))
      expect(result.current.videoToGetTranscription).toBeNull()
    })

    it('setInstruction updates the instruction', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('Summarize in 3 lines'))
      expect(result.current.instruction).toBe('Summarize in 3 lines')
    })
  })

  describe('handleEnhance', () => {
    it('does nothing when instruction is empty', async () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      await act(async () => result.current.handleEnhance())
      expect(mockFetch).not.toHaveBeenCalled()
      expect(result.current.status).toBe('idle')
    })

    it('does nothing when instruction is only whitespace', async () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('   '))
      await act(async () => result.current.handleEnhance())
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('calls fetch with the correct endpoint and body', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ result: 'Enhanced text' }),
      })
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() =>
        result.current.setVideoToGetTranscription(
          makeVideo({ transcription: 'Original' })
        )
      )
      act(() => result.current.setInstruction('Summarize'))
      await act(async () => result.current.handleEnhance())
      expect(mockFetch).toHaveBeenCalledWith('/api/enhance-transcription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction: 'Summarize',
          transcription: 'Original',
        }),
      })
    })

    it('trims the instruction before sending', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ result: 'ok' }),
      })
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('  Summarize  '))
      await act(async () => result.current.handleEnhance())
      const body = JSON.parse(
        (mockFetch.mock.calls[0][1] as { body: string }).body
      )
      expect(body.instruction).toBe('Summarize')
    })

    it('sets status to "success" and stores transcriptionEnhanced on ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ result: 'Enhanced text' }),
      })
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('Summarize'))
      await act(async () => result.current.handleEnhance())
      expect(result.current.status).toBe('success')
      expect(result.current.transcriptionEnhanced).toBe('Enhanced text')
    })

    it('clears a previous transcriptionEnhanced before fetching', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ result: 'First' }),
      })
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('First instruction'))
      await act(async () => result.current.handleEnhance())
      expect(result.current.transcriptionEnhanced).toBe('First')

      mockFetch.mockReturnValue(new Promise(() => {}))
      act(() => result.current.setInstruction('Second instruction'))
      act(() => {
        result.current.handleEnhance()
      })
      expect(result.current.transcriptionEnhanced).toBe('')
    })

    it('sets status to "error" and errorMessage when response is not ok', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Server error' }),
      })
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('Summarize'))
      await act(async () => result.current.handleEnhance())
      expect(result.current.status).toBe('error')
      expect(result.current.errorMessage).toBe('Server error')
    })

    it('falls back to a default error message when the error field is absent', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({}),
      })
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('Summarize'))
      await act(async () => result.current.handleEnhance())
      expect(result.current.errorMessage).toBe('Erro ao gerar transcrição')
    })

    it('sets status to "error" on a network failure', async () => {
      mockFetch.mockRejectedValue(new Error('Network failure'))
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('Summarize'))
      await act(async () => result.current.handleEnhance())
      expect(result.current.status).toBe('error')
      expect(result.current.errorMessage).toBe('Network failure')
    })

    it('uses "Erro desconhecido" for non-Error thrown values', async () => {
      mockFetch.mockRejectedValue('unexpected string error')
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('Summarize'))
      await act(async () => result.current.handleEnhance())
      expect(result.current.errorMessage).toBe('Erro desconhecido')
    })
  })

  describe('handleOpenDialog', () => {
    it('resets instruction, status, transcriptionEnhanced, errorMessage, and videoToGetTranscription when called with false', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ result: 'Done' }),
      })
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setVideoToGetTranscription(makeVideo()))
      act(() => result.current.setInstruction('Some instruction'))
      await act(async () => result.current.handleEnhance())

      act(() => result.current.handleOpenDialog(false))

      expect(result.current.instruction).toBe('')
      expect(result.current.status).toBe('idle')
      expect(result.current.transcriptionEnhanced).toBe('')
      expect(result.current.errorMessage).toBe('')
      expect(result.current.videoToGetTranscription).toBeNull()
    })

    it('does not reset state when called with true', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('Keep me'))
      act(() => result.current.handleOpenDialog(true))
      expect(result.current.instruction).toBe('Keep me')
    })
  })
})
