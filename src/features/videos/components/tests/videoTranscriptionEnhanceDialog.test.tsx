import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import VideoTranscriptionEnhanceDialog from '../videoTranscriptionEnhanceDialog'
import { ITopVideosWithCategory, Status } from '@/videos/types'

jest.mock('@/ui/dialog', () => ({
  Dialog: ({
    open,
    onOpenChange,
    children,
  }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
  }) =>
    open ? (
      <div data-testid="video-transcription-enhance-dialog">
        <button
          data-testid="dialog-close"
          onClick={() => onOpenChange(false)}
        />
        {children}
      </div>
    ) : null,
  DialogContent: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <div data-testid="video-transcription-enhance-dialog-content" {...props}>
      {children}
    </div>
  ),
  DialogHeader: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <div data-testid="video-transcription-enhance-dialog-header" {...props}>
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
    <h2 data-testid="video-transcription-enhance-dialog-title" {...props}>
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
    <p data-testid="video-transcription-enhance-dialog-description" {...props}>
      {children}
    </p>
  ),
}))

jest.mock('@/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    [key: string]: unknown
  }) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/ui/textarea', () => ({
  Textarea: ({
    value,
    onChange,
    disabled,
    placeholder,
    ...props
  }: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    disabled?: boolean
    placeholder?: string
    [key: string]: unknown
  }) => (
    <textarea
      data-testid="enhance-instruction-textarea"
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  ),
}))

jest.mock('lucide-react', () => ({
  AlertCircle: () => <svg data-testid="icon-alert-circle" />,
  CheckCheck: () => <svg data-testid="icon-check-check" />,
  Copy: () => <svg data-testid="icon-copy" />,
  Loader2: () => <svg data-testid="icon-loader" />,
  Sparkles: () => <svg data-testid="icon-sparkles" />,
}))

const makeVideo = (overrides = {}): ITopVideosWithCategory => ({
  video_id: 'vid-001',
  description: 'Amazing product review',
  duration: '1:00',
  image: null,
  revenue: 1000,
  sales: 100,
  views: 500_000,
  transcription: 'Original transcription text.',
  tt_account: '@seller',
  ...overrides,
})

const defaultProps = {
  copied: false,
  errorMessage: '',
  handleCopy: jest.fn(),
  handleEnhance: jest.fn(),
  handleOpenEnhanceDialog: jest.fn(),
  instruction: '',
  result: '',
  selectedVideosTranscriptionToEnhance: null as ITopVideosWithCategory | null,
  setInstruction: jest.fn(),
  status: 'idle' as Status,
}

beforeEach(() => jest.clearAllMocks())

describe('VideoTranscriptionEnhanceDialog', () => {
  describe('dialog visibility', () => {
    it('does not render the dialog when selectedVideosTranscriptionToEnhance is null', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={null}
        />
      )
      expect(
        screen.queryByTestId('video-transcription-enhance-dialog')
      ).not.toBeInTheDocument()
    })

    it('renders the dialog when selectedVideosTranscriptionToEnhance is set', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog')
      ).toBeInTheDocument()
    })

    it('renders dialog content when open', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-content')
      ).toBeInTheDocument()
    })

    it('calls handleOpenEnhanceDialog(false) when the dialog is closed', () => {
      const handleOpenEnhanceDialog = jest.fn()
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          handleOpenEnhanceDialog={handleOpenEnhanceDialog}
        />
      )
      fireEvent.click(screen.getByTestId('dialog-close'))
      expect(handleOpenEnhanceDialog).toHaveBeenCalledWith(false)
    })
  })

  describe('dialog header', () => {
    it('renders the header', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-header')
      ).toBeInTheDocument()
    })

    it('renders "Melhorar transcrição com IA" as the title', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-title')
      ).toHaveTextContent('Melhorar transcrição com IA')
    })

    it('renders the correct description', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-description')
      ).toHaveTextContent(
        'Insira uma instrução para transformar a transcrição do vídeo usando o Gemini.'
      )
    })
  })

  describe('instruction textarea', () => {
    it('renders the textarea with the current instruction value', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          instruction="Traduzir para inglês"
        />
      )
      expect(screen.getByTestId('enhance-instruction-textarea')).toHaveValue(
        'Traduzir para inglês'
      )
    })

    it('calls setInstruction when the textarea changes', () => {
      const setInstruction = jest.fn()
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          setInstruction={setInstruction}
        />
      )
      fireEvent.change(screen.getByTestId('enhance-instruction-textarea'), {
        target: { value: 'Resumir em 3 frases' },
      })
      expect(setInstruction).toHaveBeenCalledWith('Resumir em 3 frases')
    })

    it('disables the textarea while status is "loading"', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="loading"
        />
      )
      expect(screen.getByTestId('enhance-instruction-textarea')).toBeDisabled()
    })

    it('enables the textarea when status is not "loading"', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="idle"
        />
      )
      expect(
        screen.getByTestId('enhance-instruction-textarea')
      ).not.toBeDisabled()
    })
  })

  describe('generate button', () => {
    it('renders the generate button', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-generate-button')
      ).toBeInTheDocument()
    })

    it('shows "Gerar com Gemini" when status is not "loading"', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          instruction="Some instruction"
          status="idle"
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-generate-button')
      ).toHaveTextContent('Gerar com Gemini')
    })

    it('shows "Gerando..." when status is "loading"', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          instruction="Some instruction"
          status="loading"
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-generate-button')
      ).toHaveTextContent('Gerando...')
    })

    it('shows the Loader2 icon while loading', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="loading"
        />
      )
      expect(screen.getByTestId('icon-loader')).toBeInTheDocument()
    })

    it('is disabled when instruction is empty', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          instruction=""
          status="idle"
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-generate-button')
      ).toBeDisabled()
    })

    it('is disabled when instruction is only whitespace', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          instruction="   "
          status="idle"
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-generate-button')
      ).toBeDisabled()
    })

    it('is disabled while status is "loading"', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          instruction="Some instruction"
          status="loading"
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-generate-button')
      ).toBeDisabled()
    })

    it('is enabled when instruction has content and status is "idle"', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          instruction="Resumir"
          status="idle"
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-generate-button')
      ).not.toBeDisabled()
    })

    it('calls handleEnhance when clicked', () => {
      const handleEnhance = jest.fn()
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          instruction="Resumir"
          handleEnhance={handleEnhance}
        />
      )
      fireEvent.click(
        screen.getByTestId('video-transcription-enhance-dialog-generate-button')
      )
      expect(handleEnhance).toHaveBeenCalledTimes(1)
    })
  })

  describe('error state', () => {
    it('renders the error message when status is "error"', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="error"
          errorMessage="Something went wrong."
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-error-message')
      ).toBeInTheDocument()
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-error-message')
      ).toHaveTextContent('Something went wrong.')
    })

    it('shows the AlertCircle icon in the error state', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="error"
          errorMessage="Error occurred."
        />
      )
      expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument()
    })

    it('does not render the error message when status is not "error"', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="idle"
          errorMessage="Should not appear"
        />
      )
      expect(
        screen.queryByTestId('video-transcription-enhance-dialog-error-message')
      ).not.toBeInTheDocument()
    })
  })

  describe('success state', () => {
    it('renders the success state when status is "success" and result is set', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="success"
          result="Enhanced transcription result."
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-success-state')
      ).toBeInTheDocument()
    })

    it('displays the result text in the success state', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="success"
          result="Enhanced transcription result."
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-success-state')
      ).toHaveTextContent('Enhanced transcription result.')
    })

    it('does not render the success state when status is "success" but result is empty', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="success"
          result=""
        />
      )
      expect(
        screen.queryByTestId('video-transcription-enhance-dialog-success-state')
      ).not.toBeInTheDocument()
    })

    it('does not render the success state when status is not "success"', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="idle"
          result="Some result"
        />
      )
      expect(
        screen.queryByTestId('video-transcription-enhance-dialog-success-state')
      ).not.toBeInTheDocument()
    })

    it('renders the copy button in the success state', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="success"
          result="Result text."
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-copy-button')
      ).toBeInTheDocument()
    })

    it('shows "Copiar texto" on the copy button when not copied', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="success"
          result="Result text."
          copied={false}
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-copy-button')
      ).toHaveTextContent('Copiar texto')
    })

    it('shows "Copiado!" on the copy button when copied is true', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="success"
          result="Result text."
          copied={true}
        />
      )
      expect(
        screen.getByTestId('video-transcription-enhance-dialog-copy-button')
      ).toHaveTextContent('Copiado!')
    })

    it('shows the Copy icon when not copied', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="success"
          result="Result text."
          copied={false}
        />
      )
      expect(screen.getByTestId('icon-copy')).toBeInTheDocument()
    })

    it('shows the CheckCheck icon when copied', () => {
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="success"
          result="Result text."
          copied={true}
        />
      )
      expect(screen.getByTestId('icon-check-check')).toBeInTheDocument()
    })

    it('calls handleCopy when the copy button is clicked', () => {
      const handleCopy = jest.fn()
      render(
        <VideoTranscriptionEnhanceDialog
          {...defaultProps}
          selectedVideosTranscriptionToEnhance={makeVideo()}
          status="success"
          result="Result text."
          handleCopy={handleCopy}
        />
      )
      fireEvent.click(
        screen.getByTestId('video-transcription-enhance-dialog-copy-button')
      )
      expect(handleCopy).toHaveBeenCalledTimes(1)
    })
  })
})
