import React from 'react'
import { FileVideo, Sparkles } from 'lucide-react'
import FEATURES_FLAG from '@/featuresFlag/index'

const Breadcrumb = ({
  title,
  description,
  enhancementUsage,
  enhancementLimit,
  enhancementPeriod,
  transcriptionUsage,
  transcriptionLimit,
}: {
  title: string
  description: string
  enhancementUsage?: number
  enhancementLimit?: number
  enhancementPeriod?: string
  transcriptionUsage?: number
  transcriptionLimit?: number
}) => {
  return (
    <div className="mb-8 animate-fade-in" data-testid="breadcrumb-component">
      <div
        className="flex items-start justify-between gap-4"
        data-testid="breadcrumb-component-container"
      >
        <div data-testid="breadcrumb-info">
          <h1
            className="text-4xl font-bold mb-2"
            data-testid="breadcrumb-title"
          >
            Top TikTok <span className="gradient-text">{title}</span>
          </h1>
          <p
            className="text-muted-foreground text-lg"
            data-testid="breadcrumb-description"
          >
            {description}
          </p>
        </div>
        <div className="shrink-0 mt-1" data-testid="breadcrumb-limits">
          <div className="flex flex-col gap-2">
            {Boolean(
              transcriptionUsage !== null && transcriptionLimit !== null
            ) && (
              <div
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm"
                data-testid="breadcrumb-limits-transcription"
              >
                <FileVideo className="h-4 w-4 text-muted-foreground shrink-0" />
                <span
                  className="text-muted-foreground"
                  data-testid="breadcrumb-limits-transcription-label"
                >
                  Transcrições:
                </span>
                <span
                  className={
                    transcriptionUsage! >= transcriptionLimit!
                      ? 'font-semibold text-destructive'
                      : 'font-semibold text-foreground'
                  }
                  data-testid="breadcrumb-limits-transcription-value"
                >
                  {transcriptionUsage} / {transcriptionLimit}
                </span>
                <span
                  className="text-muted-foreground text-xs"
                  data-testid="breadcrumb-limits-transcription-period"
                >
                  / dia
                </span>
              </div>
            )}
            {Boolean(
              enhancementUsage !== null &&
              enhancementLimit !== null &&
              enhancementPeriod !== null &&
              FEATURES_FLAG?.videoTranscriptionEnhance
            ) && (
              <div
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm"
                data-testid="breadcrumb-limits-enhance"
              >
                <Sparkles className="h-4 w-4 text-muted-foreground shrink-0" />
                <span
                  className="text-muted-foreground"
                  data-testid="breadcrumb-limits-enhance-label"
                >
                  Melhoras:
                </span>
                <span
                  className={
                    enhancementUsage! >= enhancementLimit!
                      ? 'font-semibold text-destructive'
                      : 'font-semibold text-foreground'
                  }
                  data-testid="breadcrumb-limits-enhance-value"
                >
                  {enhancementUsage} / {enhancementLimit}
                </span>
                <span
                  className="text-muted-foreground text-xs"
                  data-testid="breadcrumb-limits-enhance-period"
                >
                  / {enhancementPeriod === 'day' ? 'dia' : 'semana'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb
