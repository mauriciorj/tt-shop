'use client'

import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  Check,
  Clock,
  Copy,
  DollarSign,
  Eye,
  FileText,
  Heart,
  Play,
  ShoppingCart,
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Breadcrumb from '@/components/breadcrumb'
import Categories from '@/components/categories'
import TablePagination from '@/components/tablePagination'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ITopVideosWithCategory } from '@/videos/types'
import useVideos from '@/videos/hooks/useVideos'

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

const VideosContainer = () => {
  const { user } = useUser()
  const clerkId = user?.id ?? ''

  const savedVideoIds = useQuery(
    api.savedVideos.getSavedVideoIds,
    clerkId ? { clerk_id: clerkId } : 'skip'
  )
  const toggleSaved = useMutation(api.savedVideos.toggleSavedVideo)

  const [selectedVideo, setSelectedVideo] =
    useState<ITopVideosWithCategory | null>(null)

  const [copied, setCopied] = useState(false)

  const handleToggleSave = async (videoKId: string) => {
    if (!clerkId) {
      toast.error('Faça login para salvar vídeos.')
      return
    }
    const result = await toggleSaved({
      clerk_id: clerkId,
      video_k_id: videoKId,
    })
    if (result.saved) {
      toast.success('Vídeo salvo!')
    } else {
      toast.success('Vídeo removido dos salvos.')
    }
  }

  const {
    categories,
    currentPage,
    data: videos,
    isLoading: isLoadingAllVideos,
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange,
    selectedCategory,
    setCurrentPage,
    setSelectedCategory,
    totalPages,
  } = useVideos()

  const handleCopy = async () => {
    if (!selectedVideo?.transcription) return
    await navigator.clipboard.writeText(selectedVideo.transcription)
    setCopied(true)
    toast.success('Transcrição copiada para a área de transferência.')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <Breadcrumb
          description="Descubra os melhores vídeos no TikTok Shop"
          title="Vídeos"
        />

        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setCurrentPage={setCurrentPage}
        />

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          {videos.map((video: any) => (
            <Card
              key={video.video_id}
              className="p-0 m-0 glass-card border-border/50 overflow-hidden group hover:border-primary/30 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[9/16] overflow-hidden">
                <Image
                  src={video.image}
                  alt={video.description}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  fill
                />
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
                      onClick={() => handleToggleSave(video.video_id)}
                      className="shrink-0 p-1 rounded-md hover:bg-secondary transition-colors"
                      title={
                        savedVideoIds?.includes(video.video_id)
                          ? 'Remover dos salvos'
                          : 'Salvar vídeo'
                      }
                    >
                      <Heart
                        className={`h-6 w-6 transition-colors ${
                          savedVideoIds?.includes(video.video_id)
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
          ))}
        </div>
        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      </main>
      {/* Transcription Dialog */}
      <Dialog
        open={!!selectedVideo}
        onOpenChange={() => setSelectedVideo(null)}
      >
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedVideo?.description}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Transcrição do vídeo
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 max-h-[400px] overflow-y-auto pr-2">
            <p className="text-sm text-foreground/80 leading-relaxed">
              {selectedVideo?.transcription}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex justify-center items-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-primary hover:bg-primary/60 text-primary-foreground cursor-pointer"
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
    </div>
  )
}

export default VideosContainer
