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

const VideoTranscriptionGenerate = ({
  copied,
  handleCopy,
  isLoading,
  setVideo,
  video,
  transcription,
}: {
  copied: boolean
  transcription: string
  handleCopy: () => void
  isLoading: boolean
  video: ITopVideosWithCategory | null
  setVideo: (video: ITopVideosWithCategory | null) => void
}) => {
  return (
    <Dialog
      open={!!video}
      onOpenChange={() => setVideo(null)}
      data-testid="video-transcription-generate-dialog"
    >
      <DialogContent
        className="sm:max-w-lg bg-card border-border"
        data-testid="video-transcription-generate-dialog-content"
      >
        <DialogHeader data-testid="video-transcription-generate-dialog-header">
          <DialogTitle
            className="text-foreground"
            data-testid="video-transcription-generate-dialog-title"
          >
            {video?.description}
          </DialogTitle>
          <DialogDescription
            className="text-muted-foreground"
            data-testid="video-transcription-generate-dialog-description"
          >
            Transcrição do vídeo
          </DialogDescription>
        </DialogHeader>
        <div
          className="mt-2 max-h-[400px] overflow-y-auto pr-2"
          data-testid="video-transcription-generate-dialog-transcription"
        >
          <p className="text-sm text-foreground/80 leading-relaxed">
            {transcription}
            {isLoading && (
              <span className="inline-block w-0.5 h-[1em] bg-primary ml-0.5 align-middle animate-pulse" />
            )}
          </p>
        </div>
        <button
          data-testid="video-transcription-generate-dialog-copy-button"
          disabled={isLoading}
          onClick={handleCopy}
          className="flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-primary hover:bg-primary/60 text-primary-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? 'Copied' : 'Copy Text'}
        </button>
      </DialogContent>
    </Dialog>
  )
}

export default VideoTranscriptionGenerate
