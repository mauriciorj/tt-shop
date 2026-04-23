import { render, screen, fireEvent } from '@testing-library/react'
import VideoCard from '../videoCard'
import { ITopVideosWithCategory } from '@/videos/types'

jest.mock('@/featuresFlag/index', () => ({
  __esModule: true,
  default: { videoTranscriptionEnhance: false },
}))

import FEATURES_FLAG from '@/featuresFlag/index'

const mockFeaturesFlag = FEATURES_FLAG as { videoTranscriptionEnhance: boolean }

const mockVideo: ITopVideosWithCategory = {
  video_id: 'vid-123',
  description: 'Amazing TikTok product review',
  duration: '0:45',
  image: 'https://example.com/thumbnail.jpg',
  views: 1_250_000,
  sales: 3_400,
  revenue: 85_000,
  category_id: 'cat-1',
  category_name: 'Beauty',
  transcription: undefined,
  tt_account: '@tiktokshop',
  saved: false,
}

const mockVideoWithTranscription: ITopVideosWithCategory = {
  ...mockVideo,
  video_id: 'vid-456',
  transcription: 'This is a full video transcription text.',
}

describe('VideoCard', () => {
  const handleToggleSave = jest.fn()
  const setSelectedVideoToTranscribe = jest.fn()
  const setSelectedVideoToEnhance = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockFeaturesFlag.videoTranscriptionEnhance = false
  })

  it('renders video description', () => {
    render(
      <VideoCard
        video={mockVideo}
        handleToggleSave={handleToggleSave}
        setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
      />
    )
    expect(
      screen.getByText('Amazing TikTok product review')
    ).toBeInTheDocument()
  })

  it('renders formatted views, sales, and revenue', () => {
    render(
      <VideoCard
        video={mockVideo}
        handleToggleSave={handleToggleSave}
        setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
      />
    )
    expect(screen.getByText('1.3M')).toBeInTheDocument()
    expect(screen.getByText('3.4K')).toBeInTheDocument()
    expect(screen.getByText('$85.0K')).toBeInTheDocument()
  })

  it('renders video duration', () => {
    render(
      <VideoCard
        video={mockVideo}
        handleToggleSave={handleToggleSave}
        setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
      />
    )
    const durations = screen.getAllByText('0:45')
    expect(durations.length).toBeGreaterThanOrEqual(1)
  })

  it('shows save button with unsaved state when video.saved is false', () => {
    render(
      <VideoCard
        video={mockVideo}
        handleToggleSave={handleToggleSave}
        setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
      />
    )
    expect(screen.getByTitle('Salvar vídeo')).toBeInTheDocument()
  })

  it('shows save button with saved state when video.saved is true', () => {
    render(
      <VideoCard
        video={{ ...mockVideo, saved: true }}
        handleToggleSave={handleToggleSave}
        setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
      />
    )
    expect(screen.getByTitle('Remover dos salvos')).toBeInTheDocument()
  })

  it('calls handleToggleSave with video_id when save button is clicked', () => {
    render(
      <VideoCard
        video={mockVideo}
        handleToggleSave={handleToggleSave}
        setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
      />
    )
    fireEvent.click(screen.getByTitle('Salvar vídeo'))
    expect(handleToggleSave).toHaveBeenCalledTimes(1)
    expect(handleToggleSave).toHaveBeenCalledWith('vid-123')
  })

  it('does not render transcription button when transcription is absent', () => {
    render(
      <VideoCard
        video={mockVideo}
        handleToggleSave={handleToggleSave}
        setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
      />
    )
    expect(screen.queryByText('Transcrição do vídeo')).not.toBeInTheDocument()
  })

  it('renders transcription button when transcription is present', () => {
    render(
      <VideoCard
        video={mockVideoWithTranscription}
        handleToggleSave={handleToggleSave}
        setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
      />
    )
    expect(screen.getByText('Transcrição do vídeo')).toBeInTheDocument()
  })

  it('calls setSelectedVideoToTranscribe with the video when transcription button is clicked', () => {
    render(
      <VideoCard
        video={mockVideoWithTranscription}
        handleToggleSave={handleToggleSave}
        setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
      />
    )
    fireEvent.click(screen.getByText('Transcrição do vídeo'))
    expect(setSelectedVideoToTranscribe).toHaveBeenCalledTimes(1)
    expect(setSelectedVideoToTranscribe).toHaveBeenCalledWith(
      mockVideoWithTranscription
    )
  })

  it('renders thumbnail image when image url is provided', () => {
    render(
      <VideoCard
        video={mockVideo}
        handleToggleSave={handleToggleSave}
        setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
      />
    )
    const img = screen.getByAltText('Amazing TikTok product review')
    expect(img).toBeInTheDocument()
  })

  it('does not render thumbnail image when image is null', () => {
    render(
      <VideoCard
        video={{ ...mockVideo, image: null }}
        handleToggleSave={handleToggleSave}
        setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
      />
    )
    expect(
      screen.queryByAltText('Amazing TikTok product review')
    ).not.toBeInTheDocument()
  })

  describe('FEATURES_FLAG.videoTranscriptionEnhance = false', () => {
    beforeEach(() => {
      mockFeaturesFlag.videoTranscriptionEnhance = false
    })

    it('does not render the "Melhorar com IA" button', () => {
      render(
        <VideoCard
          video={mockVideoWithTranscription}
          handleToggleSave={handleToggleSave}
          setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
          setSelectedVideoToEnhance={setSelectedVideoToEnhance}
        />
      )
      expect(screen.queryByText('Melhorar com IA')).not.toBeInTheDocument()
    })

    it('applies bottom-3 positioning to the transcription button', () => {
      render(
        <VideoCard
          video={mockVideoWithTranscription}
          handleToggleSave={handleToggleSave}
          setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
        />
      )
      const btn = screen
        .getByText('Transcrição do vídeo')
        .closest('div[class*="fixed"]')
      expect(btn?.className).toContain('bottom-3')
    })
  })

  describe('FEATURES_FLAG.videoTranscriptionEnhance = true', () => {
    beforeEach(() => {
      mockFeaturesFlag.videoTranscriptionEnhance = true
    })

    it('renders the "Melhorar com IA" button when transcription is present', () => {
      render(
        <VideoCard
          video={mockVideoWithTranscription}
          handleToggleSave={handleToggleSave}
          setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
          setSelectedVideoToEnhance={setSelectedVideoToEnhance}
        />
      )
      expect(screen.getByText('Melhorar com IA')).toBeInTheDocument()
    })

    it('does not render the "Melhorar com IA" button when transcription is absent', () => {
      render(
        <VideoCard
          video={mockVideo}
          handleToggleSave={handleToggleSave}
          setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
          setSelectedVideoToEnhance={setSelectedVideoToEnhance}
        />
      )
      expect(screen.queryByText('Melhorar com IA')).not.toBeInTheDocument()
    })

    it('calls setSelectedVideoToEnhance with the video when "Melhorar com IA" is clicked', () => {
      render(
        <VideoCard
          video={mockVideoWithTranscription}
          handleToggleSave={handleToggleSave}
          setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
          setSelectedVideoToEnhance={setSelectedVideoToEnhance}
        />
      )
      fireEvent.click(screen.getByText('Melhorar com IA'))
      expect(setSelectedVideoToEnhance).toHaveBeenCalledTimes(1)
      expect(setSelectedVideoToEnhance).toHaveBeenCalledWith(
        mockVideoWithTranscription
      )
    })

    it('applies bottom-16 positioning to the transcription button', () => {
      render(
        <VideoCard
          video={mockVideoWithTranscription}
          handleToggleSave={handleToggleSave}
          setSelectedVideoToTranscribe={setSelectedVideoToTranscribe}
        />
      )
      const btn = screen
        .getByText('Transcrição do vídeo')
        .closest('div[class*="fixed"]')
      expect(btn?.className).toContain('bottom-16')
    })
  })
})
