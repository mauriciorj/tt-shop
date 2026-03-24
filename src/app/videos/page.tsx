'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Check, Copy } from 'lucide-react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Breadcrumb from '@/components/breadcrumb'
import Categories from '@/components/categories'
import CategoriesSkeleton from '@/components/categoriesSkeleton'
import TablePagination from '@/components/tablePagination'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import VideoCard from '@/videos/components/videoCard'
import VideoCardSkeleton from '@/videos/components/videoCardSkeleton'
import { ITopVideosWithCategory } from '@/videos/types'
import useVideos from '@/videos/hooks/useVideos'

const Videos = () => {
  const router = useRouter()
  const {
    categories,
    currentPage,
    data: videos,
    isFreeUser,
    isLoading,
    onPageChange,
    selectedCategory,
    setCurrentPage,
    setSelectedCategory,
    totalPages,
    userId,
  } = useVideos()

  const savedVideoIds = useQuery(
    api.savedVideos.getSavedVideoIds,
    userId ? { clerk_id: userId } : 'skip'
  )
  const toggleSaved = useMutation(api.savedVideos.toggleSavedVideo)
  const recordTranscription = useMutation(
    api.users.recordTranscriptionAndCheckLimit
  )

  const [selectedVideo, setSelectedVideo] =
    useState<ITopVideosWithCategory | null>(null)

  const [copied, setCopied] = useState(false)

  const handleToggleSave = async (videoKId: string) => {
    if (!userId) {
      toast.error('Faça login para salvar vídeos.')
      return
    }
    const result = await toggleSaved({
      clerk_id: userId,
      video_k_id: videoKId,
    })
    if (result.saved) {
      toast.success('Vídeo salvo!')
    } else {
      toast.success('Vídeo removido dos salvos.')
    }
  }

  const handleOpenTranscription = async (video: ITopVideosWithCategory) => {
    if (isFreeUser && userId) {
      const result = await recordTranscription({
        clerk_id: userId,
        video_k_id: video.video_id!,
      })
      if (!result.allowed) {
        toast.error(
          'Você atingiu o limite de 1 transcrição por dia. Faça upgrade para acessar sem limites.',
          {
            action: {
              label: 'Ver planos',
              onClick: () => router.push('/subscription'),
            },
            duration: 6000,
          }
        )
        return
      }
    }
    setSelectedVideo(video)
  }

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
        {isLoading ? (
          <CategoriesSkeleton />
        ) : (
          <Categories
            categories={categories}
            isFreeUser={isFreeUser}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setCurrentPage={setCurrentPage}
          />
        )}
        {isLoading ? (
          <VideoCardSkeleton cards={12} />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up"
            style={{ animationDelay: '300ms' }}
          >
            {videos.map((video: any) => (
              <VideoCard
                key={video.video_id}
                handleToggleSave={handleToggleSave}
                setSelectedVideo={handleOpenTranscription}
                savedVideoIds={savedVideoIds ?? []}
                video={video}
              />
            ))}
          </div>
        )}
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

export default Videos
