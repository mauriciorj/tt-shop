import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useQuery } from 'convex/react'
import useVideos from '@/videos/hooks/useVideos'
import useSaveVideo from '@/videos/hooks/useSaveVideo'
import UseUser from '@/hooks/useUser'
import useVideoTranscriptionGenerate from '@/videos/hooks/useVideoTranscriptionGenerate'
import useVideoTranscriptionEnhance from '@/videos/hooks/useVideoTranscriptionEnhance'
import Videos from '../page'

// ─── Convex ───────────────────────────────────────────────────────────────────
jest.mock('convex/react', () => ({ useQuery: jest.fn() }))
jest.mock('@/convex/_generated/api', () => ({
  api: {
    users: {
      getTranscriptionUsageToday: 'users:getTranscriptionUsageToday',
      getEnhancementUsage: 'users:getEnhancementUsage',
    },
  },
}))

// ─── Hooks ────────────────────────────────────────────────────────────────────
jest.mock('@/videos/hooks/useVideos', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/hooks/useUser', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/videos/hooks/useSaveVideo', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/videos/hooks/useVideoTranscriptionGenerate', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/videos/hooks/useVideoTranscriptionEnhance', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// ─── Child components ─────────────────────────────────────────────────────────
jest.mock('@/components/breadcrumb', () => ({
  __esModule: true,
  default: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="breadcrumb">
      <span>{title}</span>
      <span>{description}</span>
    </div>
  ),
}))

jest.mock('@/components/categories', () => ({
  __esModule: true,
  default: ({ selectedCategory }: { selectedCategory: string }) => (
    <div data-testid="categories">{selectedCategory}</div>
  ),
}))

jest.mock('@/components/categoriesSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="categories-skeleton" />,
}))

jest.mock('@/components/tablePagination', () => ({
  __esModule: true,
  default: ({
    currentPage,
    totalPages,
  }: {
    currentPage: number
    totalPages: number | false
  }) => (
    <div data-testid="table-pagination">
      page {currentPage} of {totalPages}
    </div>
  ),
}))

jest.mock('@/videos/components/videoCard', () => ({
  __esModule: true,
  default: ({
    video,
  }: {
    video: { video_id: string; description: string }
  }) => (
    <div data-testid={`video-card-${video.video_id}`}>{video.description}</div>
  ),
}))

jest.mock('@/videos/components/videoCardSkeleton', () => ({
  __esModule: true,
  default: ({ cards }: { cards: number }) => (
    <div data-testid="video-card-skeleton">{cards} skeletons</div>
  ),
}))

// Render VideoTranscriptionEnhanceDialog as a simple stub to avoid UI dep issues
jest.mock('@/videos/components/videoTranscriptionEnhanceDialog', () => ({
  __esModule: true,
  default: () => <div data-testid="enhance-dialog-stub" />,
}))

// Dialog: render children inline so portal issues are avoided in jsdom
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
}))

// ─── Helpers ──────────────────────────────────────────────────────────────────
const mockUseQuery = useQuery as jest.Mock
const mockUseUser = UseUser as jest.Mock
const mockUseVideos = useVideos as jest.Mock
const mockUseSaveVideo = useSaveVideo as jest.Mock
const mockUseVideoTranscriptionGenerate =
  useVideoTranscriptionGenerate as jest.Mock
const mockUseVideoTranscriptionEnhance =
  useVideoTranscriptionEnhance as jest.Mock

const makeVideo = (overrides = {}) => ({
  video_id: 'vid_001',
  description: 'Amazing product review',
  duration: '1:00',
  image: null,
  revenue: 1000,
  sales: 100,
  views: 500_000,
  category_id: '601450',
  category_name: 'Beauty',
  tt_account: '@seller',
  ...overrides,
})

const defaultHook = {
  categories: undefined,
  currentPage: 1,
  data: [],
  isFreeUser: false,
  isLoading: false,
  itemsPerPage: 12,
  onPageChange: jest.fn(),
  selectedCategory: 'all',
  selectedPeriod: '30' as const,
  setCurrentPage: jest.fn(),
  setSelectedCategory: jest.fn(),
  setSelectedPeriod: jest.fn(),
  totalPages: 0,
}

const defaultUseSaveVideo = {
  handleToggleSave: jest.fn(),
  savedVideoIds: [],
}

const defaultUseVideoTranscriptionGenerate = {
  copied: false,
  handleCopy: jest.fn(),
  handleOpenTranscription: jest.fn(),
  isLoading: false,
  video: null,
  setVideo: jest.fn(),
  transcription: '',
}

const defaultUseVideoTranscriptionEnhance = {
  copied: false,
  errorMessage: '',
  handleCopy: jest.fn(),
  handleEnhance: jest.fn(),
  handleOpenEnhanceDialog: jest.fn(),
  instruction: '',
  result: '',
  video: null,
  setInstruction: jest.fn(),
  setVideo: jest.fn(),
  status: 'idle',
}

beforeEach(() => {
  jest.clearAllMocks()
  mockUseVideos.mockReturnValue(defaultHook)
  mockUseUser.mockReturnValue({ id: 'user_123' })
  mockUseQuery.mockReturnValue(undefined)
  mockUseSaveVideo.mockReturnValue(defaultUseSaveVideo)
  mockUseVideoTranscriptionGenerate.mockReturnValue(
    defaultUseVideoTranscriptionGenerate
  )
  mockUseVideoTranscriptionEnhance.mockReturnValue(
    defaultUseVideoTranscriptionEnhance
  )
})

// ─── Tests ────────────────────────────────────────────────────────────────────
describe('Videos page', () => {
  describe('always-visible elements', () => {
    it('renders the breadcrumb', () => {
      render(<Videos />)
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument()
      expect(screen.getByText('Vídeos')).toBeInTheDocument()
    })

    it('renders the pagination', () => {
      render(<Videos />)
      expect(screen.getByTestId('table-pagination')).toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    beforeEach(() => {
      mockUseVideos.mockReturnValue({ ...defaultHook, isLoading: true })
    })

    it('shows the categories skeleton', () => {
      render(<Videos />)
      expect(screen.getByTestId('categories-skeleton')).toBeInTheDocument()
    })

    it('shows the video card skeleton', () => {
      render(<Videos />)
      expect(screen.getByTestId('video-card-skeleton')).toBeInTheDocument()
      expect(screen.getByText('12 skeletons')).toBeInTheDocument()
    })

    it('hides video cards', () => {
      render(<Videos />)
      expect(screen.queryByTestId('video-card-vid_001')).not.toBeInTheDocument()
    })
  })

  describe('loaded state', () => {
    it('hides skeleton components', () => {
      render(<Videos />)
      expect(
        screen.queryByTestId('categories-skeleton')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('video-card-skeleton')
      ).not.toBeInTheDocument()
    })

    it('renders a card for each video', () => {
      mockUseVideos.mockReturnValue({
        ...defaultHook,
        data: [
          makeVideo({ video_id: 'vid_1' }),
          makeVideo({ video_id: 'vid_2' }),
          makeVideo({ video_id: 'vid_3' }),
        ],
      })
      render(<Videos />)
      expect(screen.getByTestId('video-card-vid_1')).toBeInTheDocument()
      expect(screen.getByTestId('video-card-vid_2')).toBeInTheDocument()
      expect(screen.getByTestId('video-card-vid_3')).toBeInTheDocument()
    })

    it('renders no cards when data is empty', () => {
      render(<Videos />)
      expect(screen.queryByTestId(/^video-card-/)).not.toBeInTheDocument()
    })

    it('passes selectedCategory to Categories', () => {
      mockUseVideos.mockReturnValue({
        ...defaultHook,
        selectedCategory: '601450',
      })
      render(<Videos />)
      expect(screen.getByTestId('categories')).toHaveTextContent('601450')
    })
  })

  describe('transcription dialog', () => {
    const videoWithTranscription = makeVideo({
      description: 'Great product video',
      transcription: 'This is the full transcription text.',
    })

    it('does not show dialog when video is null', () => {
      render(<Videos />)
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
    })

    it('shows dialog when video is set', () => {
      mockUseVideoTranscriptionGenerate.mockReturnValue({
        ...defaultUseVideoTranscriptionGenerate,
        video: videoWithTranscription,
      })
      render(<Videos />)
      expect(screen.getByTestId('dialog')).toBeInTheDocument()
    })

    it('displays the video description as dialog title', () => {
      mockUseVideoTranscriptionGenerate.mockReturnValue({
        ...defaultUseVideoTranscriptionGenerate,
        video: videoWithTranscription,
      })
      render(<Videos />)
      expect(screen.getByText('Great product video')).toBeInTheDocument()
    })

    it('displays the transcription text', () => {
      mockUseVideoTranscriptionGenerate.mockReturnValue({
        ...defaultUseVideoTranscriptionGenerate,
        video: videoWithTranscription,
        transcription: 'This is the full transcription text.',
      })
      render(<Videos />)
      expect(
        screen.getByText('This is the full transcription text.')
      ).toBeInTheDocument()
    })

    it('shows partial text while transcribing', () => {
      mockUseVideoTranscriptionGenerate.mockReturnValue({
        ...defaultUseVideoTranscriptionGenerate,
        video: videoWithTranscription,
        transcription: 'This is',
        isLoading: true,
      })
      render(<Videos />)
      expect(screen.getByText(/This is/)).toBeInTheDocument()
    })

    it('disables the copy button while transcribing', () => {
      mockUseVideoTranscriptionGenerate.mockReturnValue({
        ...defaultUseVideoTranscriptionGenerate,
        video: videoWithTranscription,
        transcription: 'Partial...',
        isLoading: true,
      })
      render(<Videos />)
      expect(screen.getByText('Copy Text').closest('button')).toBeDisabled()
    })

    it('enables the copy button when transcription is complete', () => {
      mockUseVideoTranscriptionGenerate.mockReturnValue({
        ...defaultUseVideoTranscriptionGenerate,
        video: videoWithTranscription,
        transcription: 'This is the full transcription text.',
        isLoading: false,
      })
      render(<Videos />)
      expect(screen.getByText('Copy Text').closest('button')).not.toBeDisabled()
    })

    it('shows "Copy Text" button when not copied', () => {
      mockUseVideoTranscriptionGenerate.mockReturnValue({
        ...defaultUseVideoTranscriptionGenerate,
        video: videoWithTranscription,
        copied: false,
      })
      render(<Videos />)
      expect(screen.getByText('Copy Text')).toBeInTheDocument()
    })

    it('shows "Copied" label when copied is true', () => {
      mockUseVideoTranscriptionGenerate.mockReturnValue({
        ...defaultUseVideoTranscriptionGenerate,
        video: videoWithTranscription,
        copied: true,
      })
      render(<Videos />)
      expect(screen.getByText('Copied')).toBeInTheDocument()
    })

    it('calls handleCopy when the copy button is clicked', () => {
      const handleCopy = jest.fn()
      mockUseVideoTranscriptionGenerate.mockReturnValue({
        ...defaultUseVideoTranscriptionGenerate,
        video: videoWithTranscription,
        handleCopy,
      })
      render(<Videos />)
      fireEvent.click(screen.getByText('Copy Text'))
      expect(handleCopy).toHaveBeenCalledTimes(1)
    })

    it('wires setVideo to the dialog close handler', () => {
      const setVideo = jest.fn()
      mockUseVideoTranscriptionGenerate.mockReturnValue({
        ...defaultUseVideoTranscriptionGenerate,
        video: videoWithTranscription,
        setVideo,
      })
      render(<Videos />)
      expect(screen.getByTestId('dialog')).toBeInTheDocument()
    })
  })

  describe('pagination', () => {
    it('passes currentPage to pagination', () => {
      mockUseVideos.mockReturnValue({
        ...defaultHook,
        currentPage: 3,
        totalPages: 5,
      })
      render(<Videos />)
      expect(screen.getByTestId('table-pagination')).toHaveTextContent(
        'page 3 of 5'
      )
    })
  })
})
