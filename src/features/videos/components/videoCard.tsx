'use client'

import Image from 'next/image'
import {
  Clock,
  DollarSign,
  Eye,
  FileText,
  Heart,
  Play,
  ShoppingCart,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ITopVideosWithCategory } from '@/videos/types'
import { formatNumber } from '@/utils/number'
import FEATURES_FLAG from '@/featuresFlag/index'

const VideoCard = ({
  handleToggleSave,
  setSelectedVideoToEnhance,
  setSelectedVideoToTranscribe,
  video,
}: {
  handleToggleSave: (videoId: string) => void
  setSelectedVideoToEnhance?: (video: ITopVideosWithCategory) => void
  setSelectedVideoToTranscribe: (video: ITopVideosWithCategory) => void
  video: ITopVideosWithCategory
}) => {
  return (
    <Card
      className="p-0 m-0 glass-card border-border/50 overflow-hidden group hover:border-primary/30 transition-all duration-300"
      data-testid="video-card"
      key={video.video_id}
    >
      {/* Thumbnail */}
      <div
        className="relative aspect-[9/16] overflow-hidden"
        data-testid="video-card-thumbnail"
      >
        {video.image && (
          <Image
            alt={video.description}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid="video-card-thumbnail-image"
            fill
            loading="lazy"
            src={video.image}
          />
        )}
        <div
          className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1"
          data-testid="video-card-duration"
        >
          <Clock className="h-3 w-3" />
          {video.duration}
        </div>
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300 flex items-center justify-center">
          <Play
            className="h-12 w-12 text-primary-foreground opacity-0 group-hover:opacity-80 transition-opacity duration-300 drop-shadow-lg"
            data-testid="video-card-play"
          />
        </div>
      </div>

      <CardContent className="p-4 space-y-3" data-testid="video-card-content">
        <div>
          <div
            className="flex items-start justify-between gap-2"
            data-testid="video-card-header"
          >
            <h3
              className="font-semibold text-sm text-foreground line-clamp-2 leading-tight flex-1"
              data-testid="video-card-description"
            >
              {video.description}
            </h3>
            <button
              className="shrink-0 p-1 rounded-md hover:bg-secondary transition-colors"
              data-testid="video-card-save-button"
              onClick={() => handleToggleSave(video.video_id!)}
              title={video.saved ? 'Remover dos salvos' : 'Salvar vídeo'}
            >
              <Heart
                className={`h-6 w-6 transition-colors ${
                  video.saved
                    ? 'text-primary fill-primary'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          </div>
          <div
            className="grid grid-cols-2 gap-2 text-sm mt-7 mb-17"
            data-testid="video-card-metrics"
          >
            <div
              className="flex items-center gap-1.5 text-muted-foreground"
              data-testid="video-card-metrics-views"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{formatNumber(video.views)}</span>
            </div>
            <div
              className="flex items-center gap-1.5 text-muted-foreground"
              data-testid="video-card-metrics-sales"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>{formatNumber(video.sales)}</span>
            </div>
            <div
              className="flex items-center gap-1.5 text-muted-foreground"
              data-testid="video-card-metrics-revenue"
            >
              <DollarSign className="h-3.5 w-3.5" />
              <span>${formatNumber(video.revenue)}</span>
            </div>
            <div
              className="flex items-center gap-1.5 text-muted-foreground"
              data-testid="video-card-metrics-duration"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{video.duration}</span>
            </div>
          </div>
        </div>
        {video.transcription && (
          <div
            className={`${FEATURES_FLAG?.videoTranscriptionEnhance ? 'pt-10' : 'pt-1'} h-full`}
            data-testid="video-card-actions"
          >
            <div
              className={`fixed ${FEATURES_FLAG?.videoTranscriptionEnhance ? 'bottom-16' : 'bottom-3'} left-[calc(50%-100px)]`}
              data-testid="video-card-action"
            >
              <button
                className="flex justify-center items-center w-[200px] items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-primary hover:bg-primary/60 text-primary-foreground cursor-pointer"
                data-testid="video-card-action-transcribe"
                onClick={() => setSelectedVideoToTranscribe(video)}
              >
                <FileText className="h-3.5 w-3.5" />
                Transcrição do vídeo
              </button>
            </div>
            {FEATURES_FLAG?.videoTranscriptionEnhance && (
              <div className="fixed bottom-3 left-[calc(50%-100px)]">
                <button
                  className="flex justify-center items-center w-[200px] gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-secondary hover:bg-secondary/60 text-secondary-foreground cursor-pointer"
                  data-testid="video-card-action-enhance"
                  onClick={() => setSelectedVideoToEnhance?.(video)}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Melhorar com IA
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default VideoCard
