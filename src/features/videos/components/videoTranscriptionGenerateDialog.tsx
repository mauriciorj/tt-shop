'use client'

import { Check, Copy } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ITopVideosWithCategory } from '@/videos/types'

const VideoTranscriptionGenerateDialog = ({
  isCopied,
  isLoading,
  selectedVideo,
  setTextToCopy,
  setVideo,
  transcription,
}: {
  isCopied: boolean
  isLoading: boolean
  selectedVideo: ITopVideosWithCategory | null
  setTextToCopy: (text: string) => void
  setVideo: (selectedVideo: ITopVideosWithCategory | null) => void
  transcription: string
}) => {
  return (
    <Dialog
      data-testid="selected-video-transcription-generate-dialog"
      open={!!selectedVideo}
      onOpenChange={() => setVideo(null)}
    >
      <DialogContent
        className="sm:max-w-lg bg-card border-border"
        data-testid="selected-video-transcription-generate-dialog-content"
      >
        <DialogHeader data-testid="selected-video-transcription-generate-dialog-header">
          <DialogTitle
            className="text-foreground"
            data-testid="selected-video-transcription-generate-dialog-title"
          >
            {selectedVideo?.description}
          </DialogTitle>
          <DialogDescription
            className="text-muted-foreground"
            data-testid="selected-video-transcription-generate-dialog-description"
          >
            Transcrição do vídeo
          </DialogDescription>
        </DialogHeader>
        <div
          className="mt-2 max-h-[400px] overflow-y-auto pr-2"
          data-testid="selected-video-transcription-generate-dialog-transcription"
        >
          <p className="text-sm text-foreground/80 leading-relaxed">
            {transcription}
            {isLoading && (
              <span className="inline-block w-0.5 h-[1em] bg-primary ml-0.5 align-middle animate-pulse" />
            )}
          </p>
        </div>
        <button
          className="flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-primary hover:bg-primary/60 text-primary-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="selected-video-transcription-generate-dialog-copy-button"
          disabled={isLoading}
          onClick={() => setTextToCopy(transcription)}
        >
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {isCopied ? 'Texto copiado' : 'Copiar texto'}
        </button>
      </DialogContent>
    </Dialog>
  )
}

export default VideoTranscriptionGenerateDialog
