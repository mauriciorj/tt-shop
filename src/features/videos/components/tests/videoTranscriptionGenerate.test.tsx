import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import VideoTranscriptionGenerateDialog from '../videoTranscriptionGenerateDialog'
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
    <p
      data-testid="video-transcription-generate-dialog-description"
      {...props}
    >
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
  isCopied: false,
  isLoading: false,
  selectedVideo: null as ITopVideosWithCategory | null,
  setTextToCopy: jest.fn(),
  setVideo: jest.fn(),
  transcription: '',
}

beforeEach(() => jest.clearAllMocks())

describe('VideoTranscriptionGenerateDialog', () => {
  describe('dialog visibility', () => {
    it('does not render the dialog when selectedVideo is null', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={null}
        />
      )
      expect(
        screen.queryByTestId('video-transcription-generate-dialog')
      ).not.toBeInTheDocument()
    })

    it('renders the dialog when selectedVideo is set', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
        />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog')
      ).toBeInTheDocument()
    })

    it('renders dialog content when selectedVideo is set', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
        />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog-content')
      ).toBeInTheDocument()
    })
  })

  describe('dialog header', () => {
    it('renders the header', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
        />
      )
      expect(
        screen.getByTestId('video-transcription-generate-dialog-header')
      ).toBeInTheDocument()
    })

    it('renders the video description as the dialog title', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo({ description: 'Best seller unboxing' })}
        />
      )
      expect(
        screen.getByTestId(
          'selected-video-transcription-generate-dialog-title'
        )
      ).toHaveTextContent('Best seller unboxing')
    })

    it('renders "Transcrição do vídeo" as the dialog description', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
        />
      )
      expect(
        screen.getByTestId(
          'selected-video-transcription-generate-dialog-description'
        )
      ).toHaveTextContent('Transcrição do vídeo')
    })
  })

  describe('transcription text', () => {
    it('renders the transcription body', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
        />
      )
      expect(
        screen.getByTestId(
          'selected-video-transcription-generate-dialog-transcription'
        )
      ).toBeInTheDocument()
    })

    it('displays the transcription text', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
          transcription="Live transcription content."
        />
      )
      expect(
        screen.getByTestId(
          'selected-video-transcription-generate-dialog-transcription'
        )
      ).toHaveTextContent('Live transcription content.')
    })

    it('shows the pulsing cursor while isLoading is true', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
          isLoading={true}
          transcription="Partial..."
        />
      )
      const transcriptionEl = screen.getByTestId(
        'selected-video-transcription-generate-dialog-transcription'
      )
      expect(transcriptionEl.querySelector('span')).toBeInTheDocument()
    })

    it('does not show the pulsing cursor when isLoading is false', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
          isLoading={false}
          transcription="Full text."
        />
      )
      const transcriptionEl = screen.getByTestId(
        'selected-video-transcription-generate-dialog-transcription'
      )
      expect(transcriptionEl.querySelector('span')).not.toBeInTheDocument()
    })
  })

  describe('copy button', () => {
    it('renders the copy button', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
        />
      )
      expect(
        screen.getByTestId(
          'selected-video-transcription-generate-dialog-copy-button'
        )
      ).toBeInTheDocument()
    })

    it('shows "Copiar texto" label when not copied', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
          isCopied={false}
        />
      )
      expect(
        screen.getByTestId(
          'selected-video-transcription-generate-dialog-copy-button'
        )
      ).toHaveTextContent('Copiar texto')
    })

    it('shows "Texto copiado" label when isCopied is true', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
          isCopied={true}
        />
      )
      expect(
        screen.getByTestId(
          'selected-video-transcription-generate-dialog-copy-button'
        )
      ).toHaveTextContent('Texto copiado')
    })

    it('shows the Copy icon when not copied', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
          isCopied={false}
        />
      )
      expect(screen.getByTestId('icon-copy')).toBeInTheDocument()
    })

    it('shows the Check icon when isCopied', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
          isCopied={true}
        />
      )
      expect(screen.getByTestId('icon-check')).toBeInTheDocument()
    })

    it('is disabled while isLoading is true', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
          isLoading={true}
        />
      )
      expect(
        screen.getByTestId(
          'selected-video-transcription-generate-dialog-copy-button'
        )
      ).toBeDisabled()
    })

    it('is enabled when isLoading is false', () => {
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
          isLoading={false}
        />
      )
      expect(
        screen.getByTestId(
          'selected-video-transcription-generate-dialog-copy-button'
        )
      ).not.toBeDisabled()
    })

    it('calls setTextToCopy with transcription when clicked', () => {
      const setTextToCopy = jest.fn()
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
          transcription="Full transcript"
          setTextToCopy={setTextToCopy}
        />
      )
      fireEvent.click(
        screen.getByTestId(
          'selected-video-transcription-generate-dialog-copy-button'
        )
      )
      expect(setTextToCopy).toHaveBeenCalledWith('Full transcript')
    })
  })

  describe('dialog close', () => {
    it('calls setVideo(null) when the dialog is closed', () => {
      const setVideo = jest.fn()
      render(
        <VideoTranscriptionGenerateDialog
          {...defaultProps}
          selectedVideo={makeVideo()}
          setVideo={setVideo}
        />
      )
      fireEvent.click(screen.getByTestId('dialog-close'))
      expect(setVideo).toHaveBeenCalledWith(null)
    })
  })
})
