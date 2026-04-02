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
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ITopVideosWithCategory } from '@/videos/types'
import { formatNumber } from '@/utils/number'

const VideoCard = ({
  handleToggleSave,
  setSelectedVideo,
  savedVideoIds,
  video,
}: {
  handleToggleSave: (videoId: string) => void
  setSelectedVideo: (video: ITopVideosWithCategory) => void
  savedVideoIds: string[]
  video: ITopVideosWithCategory
}) => {
  return (
    <Card
      key={video.video_id}
      className="p-0 m-0 glass-card border-border/50 overflow-hidden group hover:border-primary/30 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] overflow-hidden">
        {video.image && (
          <Image
            src={video.image}
            alt={video.description}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            fill
          />
        )}
        <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {video.duration}
        </div>
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300 flex items-center justify-center">
          <Play className="h-12 w-12 text-primary-foreground opacity-0 group-hover:opacity-80 transition-opacity duration-300 drop-shadow-lg" />
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight flex-1">
              {video.description}
            </h3>
            <button
              onClick={() => handleToggleSave(video.video_id!)}
              className="shrink-0 p-1 rounded-md hover:bg-secondary transition-colors"
              title={
                savedVideoIds?.includes(video.video_id!)
                  ? 'Remover dos salvos'
                  : 'Salvar vídeo'
              }
            >
              <Heart
                className={`h-6 w-6 transition-colors ${
                  savedVideoIds?.includes(video.video_id!)
                    ? 'text-primary fill-primary'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm mt-7 mb-17">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              <span>{formatNumber(video.views)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>{formatNumber(video.sales)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              <span>${formatNumber(video.revenue)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{video.duration}</span>
            </div>
          </div>
        </div>
        {video.transcription && (
          <div className="fixed bottom-3 left-[calc(50%-100px)]">
            <button
              onClick={() => setSelectedVideo(video)}
              className="flex justify-center items-center w-[200px] items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-primary hover:bg-primary/60 text-primary-foreground cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5" />
              Transcrição do vídeo
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default VideoCard
