import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import VideoTranscriptionGenerate from '../videoTranscriptionGenerate'
import { ITopVideosWithCategory } from '@/videos/types'

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    open,
    onOpenChange,
    children,
  }: {
    open: boolean
    onOpenChange: () => void
    children: React.ReactNode
  }) =>
    open ? (
      <div data-testid="video-transcription-generate-dialog">
        <button data-testid="dialog-close" onClick={onOpenChange} />
        {children}
      </div>
    ) : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="video-transcription-generate-dialog-content">
      {children}
    </div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="video-transcription-generate-dialog-header">
      {children}
    </div>
  ),
  DialogTitle: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <h2 data-testid="video-transcription-generate-dialog-title" {...props}>
      {children}
    </h2>
  ),
  DialogDescription: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <p data-testid="video-transcription-generate-dialog-description" {...props}>
      {children}
    </p>
  ),
}))

jest.mock('lucide-react', () => ({
  Check: () => <svg data-testid="icon-check" />,
  Copy: () => <svg data-testid="icon-copy" />,
}))

const makeVideo = (overrides = {}): ITopVideosWithCategory => ({
  video_id: 'vid-001',
  description: 'Amazing product review',
  duration: '1:00',
  image: null,
  revenue: 1000,
  sales: 100,
  views: 500_000,
  transcription: 'This is the full transcription text.',
  tt_account: '@seller',
  ...overrides,
})

const defaultProps = {
  copied: false,
  handleCopy: jest.fn(),
  isLoading: false,
  setVideo: jest.fn(),
  video: null as ITopVideosWithCategory | null,
  transcription: '',
}

beforeEach(() => jest.clearAllMocks())

describe('VideoTranscriptionGenerate', () => {
  describe('dialog visibility', () => {
    it('does not render the dialog when video is null', () => {
      render(<VideoTranscriptionGenerate {...defaultProps} video={null} />)
      expect(
        screen.queryByTestId('video-transcription-generate-dialog')
      ).not.toBeInTheDocument()
    })

    it('renders the dialog when video is set', () => {
      render(
        <VideoTranscriptionGenerate {...defaultProps} video={makeVideo()} />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog')
      ).toBeInTheDocument()
    })

    it('renders dialog content when video is set', () => {
      render(
        <VideoTranscriptionGenerate {...defaultProps} video={makeVideo()} />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog-content')
      ).toBeInTheDocument()
    })
  })

  describe('dialog header', () => {
    it('renders the header', () => {
      render(
        <VideoTranscriptionGenerate {...defaultProps} video={makeVideo()} />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog-header')
      ).toBeInTheDocument()
    })

    it('renders the video description as the dialog title', () => {
      render(
        <VideoTranscriptionGenerate
          {...defaultProps}
          video={makeVideo({ description: 'Best seller unboxing' })}
        />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog-title')
      ).toHaveTextContent('Best seller unboxing')
    })

    it('renders "Transcrição do vídeo" as the dialog description', () => {
      render(
        <VideoTranscriptionGenerate {...defaultProps} video={makeVideo()} />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog-description')
      ).toHaveTextContent('Transcrição do vídeo')
    })
  })

  describe('transcription text', () => {
    it('renders the transcription body', () => {
      render(
        <VideoTranscriptionGenerate {...defaultProps} video={makeVideo()} />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog-transcription')
      ).toBeInTheDocument()
    })

    it('displays the transcription text', () => {
      render(
        <VideoTranscriptionGenerate
          {...defaultProps}
          video={makeVideo()}
          transcription="Live transcription content."
        />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog-transcription')
      ).toHaveTextContent('Live transcription content.')
    })

    it('shows the pulsing cursor while isLoading is true', () => {
      render(
        <VideoTranscriptionGenerate
          {...defaultProps}
          video={makeVideo()}
          isLoading={true}
          transcription="Partial..."
        />
      )
      const transcriptionEl = screen.getByTestId(
        'video-transcription-generate-dialog-transcription'
      )
      // The pulsing cursor is a <span> inside the transcription container
      expect(transcriptionEl.querySelector('span')).toBeInTheDocument()
    })

    it('does not show the pulsing cursor when isLoading is false', () => {
      render(
        <VideoTranscriptionGenerate
          {...defaultProps}
          video={makeVideo()}
          isLoading={false}
          transcription="Full text."
        />
      )
      const transcriptionEl = screen.getByTestId(
        'video-transcription-generate-dialog-transcription'
      )
      expect(transcriptionEl.querySelector('span')).not.toBeInTheDocument()
    })
  })

  describe('copy button', () => {
    it('renders the copy button', () => {
      render(
        <VideoTranscriptionGenerate {...defaultProps} video={makeVideo()} />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog-copy-button')
      ).toBeInTheDocument()
    })

    it('shows "Copy Text" label when not copied', () => {
      render(
        <VideoTranscriptionGenerate
          {...defaultProps}
          video={makeVideo()}
          copied={false}
        />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog-copy-button')
      ).toHaveTextContent('Copy Text')
    })

    it('shows "Copied" label when copied is true', () => {
      render(
        <VideoTranscriptionGenerate
          {...defaultProps}
          video={makeVideo()}
          copied={true}
        />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog-copy-button')
      ).toHaveTextContent('Copied')
    })

    it('shows the Copy icon when not copied', () => {
      render(
        <VideoTranscriptionGenerate
          {...defaultProps}
          video={makeVideo()}
          copied={false}
        />
      )
      expect(screen.getByTestId('icon-copy')).toBeInTheDocument()
    })

    it('shows the Check icon when copied', () => {
      render(
        <VideoTranscriptionGenerate
          {...defaultProps}
          video={makeVideo()}
          copied={true}
        />
      )
      expect(screen.getByTestId('icon-check')).toBeInTheDocument()
    })

    it('is disabled while isLoading is true', () => {
      render(
        <VideoTranscriptionGenerate
          {...defaultProps}
          video={makeVideo()}
          isLoading={true}
        />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog-copy-button')
      ).toBeDisabled()
    })

    it('is enabled when isLoading is false', () => {
      render(
        <VideoTranscriptionGenerate
          {...defaultProps}
          video={makeVideo()}
          isLoading={false}
        />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog-copy-button')
      ).not.toBeDisabled()
    })

    it('calls handleCopy when clicked', () => {
      const handleCopy = jest.fn()
      render(
        <VideoTranscriptionGenerate
          {...defaultProps}
          video={makeVideo()}
          handleCopy={handleCopy}
        />
      )
      fireEvent.click(
        screen.getByTestId('video-transcription-generate-dialog-copy-button')
      )
      expect(handleCopy).toHaveBeenCalledTimes(1)
    })
  })

  describe('dialog close', () => {
    it('calls setVideo(null) when the dialog is closed', () => {
      const setVideo = jest.fn()
      render(
        <VideoTranscriptionGenerate
          {...defaultProps}
          video={makeVideo()}
          setVideo={setVideo}
        />
      )
      fireEvent.click(screen.getByTestId('dialog-close'))
      expect(setVideo).toHaveBeenCalledWith(null)
    })
  })
})
