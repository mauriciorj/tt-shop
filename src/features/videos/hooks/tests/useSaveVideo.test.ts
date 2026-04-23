import { renderHook, act } from '@testing-library/react'
import { useMutation } from 'convex/react'
import UseUser from '@/hooks/useUser'
import { toast } from 'sonner'
import useSaveVideo from '../useSaveVideo'

jest.mock('convex/react', () => ({
  useMutation: jest.fn(),
}))
jest.mock('@/convex/_generated/api', () => ({
  api: {
    videos: {
      updateSavedVideo: 'videos:updateSavedVideo',
    },
  },
}))
jest.mock('@/hooks/useUser', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }))

const mockUseMutation = useMutation as jest.Mock
const mockUseUser = UseUser as jest.Mock
const mockToast = toast as jest.Mocked<typeof toast>

const defaultUser = { id: 'user_abc', isFreeUser: false, isLoading: false }

beforeEach(() => {
  jest.clearAllMocks()
  mockUseUser.mockReturnValue(defaultUser)
  mockUseMutation.mockReturnValue(jest.fn().mockResolvedValue({ saved: true }))
})

describe('useSaveVideo', () => {
  describe('handleToggleSave', () => {
    it('shows a toast error and does not call the mutation when userId is empty', async () => {
      const mockToggle = jest.fn()
      mockUseMutation.mockReturnValue(mockToggle)
      mockUseUser.mockReturnValue({ ...defaultUser, id: '' })
      const { result } = renderHook(() => useSaveVideo())
      await act(() => result.current.handleToggleSave('vid_001'))
      expect(mockToast.error).toHaveBeenCalledWith(
        'Faça login para salvar vídeos.'
      )
      expect(mockToggle).not.toHaveBeenCalled()
    })

    it('calls the mutation with the correct args', async () => {
      const mockToggle = jest.fn().mockResolvedValue({ saved: true })
      mockUseMutation.mockReturnValue(mockToggle)
      const { result } = renderHook(() => useSaveVideo())
      await act(() => result.current.handleToggleSave('vid_001'))
      expect(mockToggle).toHaveBeenCalledWith({
        clerk_id: 'user_abc',
        video_k_id: 'vid_001',
      })
    })

    it('shows "Vídeo salvo!" when the mutation returns saved=true', async () => {
      mockUseMutation.mockReturnValue(
        jest.fn().mockResolvedValue({ saved: true })
      )
      const { result } = renderHook(() => useSaveVideo())
      await act(() => result.current.handleToggleSave('vid_001'))
      expect(mockToast.success).toHaveBeenCalledWith('Vídeo salvo!')
    })

    it('shows "Vídeo removido dos salvos." when the mutation returns saved=false', async () => {
      mockUseMutation.mockReturnValue(
        jest.fn().mockResolvedValue({ saved: false })
      )
      const { result } = renderHook(() => useSaveVideo())
      await act(() => result.current.handleToggleSave('vid_001'))
      expect(mockToast.success).toHaveBeenCalledWith(
        'Vídeo removido dos salvos.'
      )
    })
  })
})
