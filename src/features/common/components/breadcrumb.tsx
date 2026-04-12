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
    <div className="mb-8 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Top TikTok <span className="gradient-text">{title}</span>
          </h1>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
        <div className="shrink-0 mt-1">
          <div className="flex flex-col gap-2">
            {Boolean(
              transcriptionUsage !== null && transcriptionLimit !== null
            ) && (
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
                <FileVideo className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Transcrições:</span>
                <span
                  className={
                    transcriptionUsage! >= transcriptionLimit!
                      ? 'font-semibold text-destructive'
                      : 'font-semibold text-foreground'
                  }
                >
                  {transcriptionUsage} / {transcriptionLimit}
                </span>
                <span className="text-muted-foreground text-xs">/ dia</span>
              </div>
            )}
            {Boolean(
              enhancementUsage !== null &&
              enhancementLimit !== null &&
              enhancementPeriod !== null &&
              FEATURES_FLAG?.videoTranscriptionEnhance
            ) && (
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
                <Sparkles className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Melhoras:</span>
                <span
                  className={
                    enhancementUsage! >= enhancementLimit!
                      ? 'font-semibold text-destructive'
                      : 'font-semibold text-foreground'
                  }
                >
                  {enhancementUsage} / {enhancementLimit}
                </span>
                <span className="text-muted-foreground text-xs">
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
