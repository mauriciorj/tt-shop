import { renderHook, act } from '@testing-library/react'
import { useQuery } from 'convex/react'
import UseUser from '@/hooks/useUser'
import useVideoTranscriptionEnhance from '../useVideoTranscriptionEnhance'
import { ITopVideosWithCategory } from '@/videos/types'

jest.mock('convex/react', () => ({ useQuery: jest.fn() }))
jest.mock('@/convex/_generated/api', () => ({
  api: { users: { getEnhancementUsage: 'users:getEnhancementUsage' } },
}))
jest.mock('@/hooks/useUser', () => ({ __esModule: true, default: jest.fn() }))

const mockUseQuery = useQuery as jest.Mock
const mockUseUser = UseUser as jest.Mock

const mockClipboard = { writeText: jest.fn() }
Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
})

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
})

afterEach(() => {
  jest.useRealTimers()
})

describe('useVideoTranscriptionEnhance', () => {
  describe('initial state', () => {
    it('starts with video as null', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      expect(result.current.video).toBeNull()
    })

    it('starts with instruction as empty string', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      expect(result.current.instruction).toBe('')
    })

    it('starts with status as "idle"', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      expect(result.current.status).toBe('idle')
    })

    it('starts with result as empty string', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      expect(result.current.result).toBe('')
    })

    it('starts with errorMessage as empty string', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      expect(result.current.errorMessage).toBe('')
    })

    it('starts with copied as false', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      expect(result.current.copied).toBe(false)
    })
  })

  describe('setVideo / setInstruction', () => {
    it('setVideo updates the video', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      const video = makeVideo()
      act(() => result.current.setVideo(video))
      expect(result.current.video).toEqual(video)
    })

    it('setVideo can reset video to null', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setVideo(makeVideo()))
      act(() => result.current.setVideo(null))
      expect(result.current.video).toBeNull()
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
      act(() => result.current.setVideo(makeVideo({ transcription: 'Original' })))
      act(() => result.current.setInstruction('Summarize'))
      await act(async () => result.current.handleEnhance())
      expect(mockFetch).toHaveBeenCalledWith('/api/enhance-transcription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcription: 'Original',
          instruction: 'Summarize',
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

    it('sets status to "success" and stores the result on ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ result: 'Enhanced text' }),
      })
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('Summarize'))
      await act(async () => result.current.handleEnhance())
      expect(result.current.status).toBe('success')
      expect(result.current.result).toBe('Enhanced text')
    })

    it('clears a previous result before fetching', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ result: 'First' }),
      })
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('First instruction'))
      await act(async () => result.current.handleEnhance())
      expect(result.current.result).toBe('First')

      mockFetch.mockReturnValue(new Promise(() => {})) // hangs
      act(() => result.current.setInstruction('Second instruction'))
      act(() => { result.current.handleEnhance() })
      expect(result.current.result).toBe('')
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

  describe('handleCopy', () => {
    const setupSuccess = async (result: string) => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ result }),
      })
    }

    it('copies the result to the clipboard', async () => {
      await setupSuccess('Enhanced output')
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('go'))
      await act(async () => result.current.handleEnhance())
      await act(async () => result.current.handleCopy())
      expect(mockClipboard.writeText).toHaveBeenCalledWith('Enhanced output')
    })

    it('sets copied to true after copying', async () => {
      await setupSuccess('text')
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('go'))
      await act(async () => result.current.handleEnhance())
      await act(async () => result.current.handleCopy())
      expect(result.current.copied).toBe(true)
    })

    it('resets copied to false after 2 seconds', async () => {
      await setupSuccess('text')
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('go'))
      await act(async () => result.current.handleEnhance())
      await act(async () => result.current.handleCopy())
      expect(result.current.copied).toBe(true)
      act(() => jest.advanceTimersByTime(2000))
      expect(result.current.copied).toBe(false)
    })
  })

  describe('handleOpenEnhanceDialog', () => {
    it('resets all state when called with false', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ result: 'Done' }),
      })
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setVideo(makeVideo()))
      act(() => result.current.setInstruction('Some instruction'))
      await act(async () => result.current.handleEnhance())

      act(() => result.current.handleOpenEnhanceDialog(false))

      expect(result.current.instruction).toBe('')
      expect(result.current.status).toBe('idle')
      expect(result.current.result).toBe('')
      expect(result.current.errorMessage).toBe('')
      expect(result.current.copied).toBe(false)
      expect(result.current.video).toBeNull()
    })

    it('does not reset state when called with true', () => {
      const { result } = renderHook(() => useVideoTranscriptionEnhance())
      act(() => result.current.setInstruction('Keep me'))
      act(() => result.current.handleOpenEnhanceDialog(true))
      expect(result.current.instruction).toBe('Keep me')
    })
  })
})
