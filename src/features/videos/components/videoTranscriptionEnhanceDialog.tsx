'use client'

import { AlertCircle, CheckCheck, Copy, Loader2, Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog'
import { Button } from '@/ui/button'
import { Textarea } from '@/ui/textarea'
import { ITopVideosWithCategory, Status } from '@/videos/types'

const VideoTranscriptionEnhanceDialog = ({
  copied,
  errorMessage,
  handleCopy,
  handleEnhance,
  handleOpenEnhanceDialog,
  instruction,
  result,
  selectedVideosTranscriptionToEnhance,
  setInstruction,
  status,
}: {
  copied: boolean
  errorMessage: string
  handleCopy: () => void
  handleEnhance: () => void
  handleOpenEnhanceDialog: (nextOpen: boolean) => void
  instruction: string
  result: string
  selectedVideosTranscriptionToEnhance: ITopVideosWithCategory | null
  setInstruction: (instruction: string) => void
  status: Status
}) => {
  return (
    <>
      <Dialog
        data-testid="video-transcription-enhance-dialog"
        open={!!selectedVideosTranscriptionToEnhance}
        onOpenChange={handleOpenEnhanceDialog}
      >
        <DialogContent
          className="sm:max-w-lg bg-card border-border"
          data-testid="video-transcription-enhance-dialog-content"
        >
          <DialogHeader data-testid="video-transcription-enhance-dialog-header">
            <DialogTitle
              className="flex items-center gap-2 text-foreground"
              data-testid="video-transcription-enhance-dialog-title"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              Melhorar transcrição com IA
            </DialogTitle>
            <DialogDescription
              className="text-muted-foreground"
              data-testid="video-transcription-enhance-dialog-description"
            >
              Insira uma instrução para transformar a transcrição do vídeo
              usando o Gemini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Instruction input */}
            <Textarea
              placeholder='Ex: "Mude o tom para formal", "Resuma em 3 frases", "Traduza para inglês"'
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={3}
              className="resize-none"
              disabled={status === 'loading'}
            />

            {/* Generate button */}
            <Button
              data-testid="video-transcription-enhance-dialog-generate-button"
              onClick={handleEnhance}
              disabled={!instruction.trim() || status === 'loading'}
              className="w-full"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar com Gemini
                </>
              )}
            </Button>

            {/* Error state */}
            {status === 'error' && (
              <div
                className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
                data-testid="video-transcription-enhance-dialog-error-message"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success state */}
            {status === 'success' && result && (
              <div
                className="space-y-2"
                data-testid="video-transcription-enhance-dialog-success-state"
              >
                <div className="rounded-xl border border-border bg-secondary/30 p-4 max-h-[240px] overflow-y-auto">
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {result}
                  </p>
                </div>
                <Button
                  data-testid="video-transcription-enhance-dialog-copy-button"
                  variant="outline"
                  className="w-full"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <CheckCheck className="h-4 w-4 mr-2 text-green-500" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar texto
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default VideoTranscriptionEnhanceDialog
