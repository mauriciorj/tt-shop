'use client'

import Breadcrumb from '@/components/breadcrumb'
import Categories from '@/components/categories'
import CategoriesSkeleton from '@/components/categoriesSkeleton'
import TablePagination from '@/components/tablePagination'
import VideoCard from '@/videos/components/videoCard'
import VideoCardSkeleton from '@/videos/components/videoCardSkeleton'
import VideoTranscriptionGenerate from '@/videos/components/videoTranscriptionGenerate'
import useVideos from '@/videos/hooks/useVideos'

const Videos = () => {
  const {
    categories,
    copied,
    currentPage,
    data: videos,
    displayedTranscription,
    handleCopy,
    handleOpenTranscription,
    handleToggleSave,
    isFreeUser,
    isLoading,
    isTranscribing,
    onPageChange,
    savedVideoIds,
    selectedCategory,
    setCurrentPage,
    setSelectedCategory,
    setSelectedVideo,
    selectedVideo,
    totalPages,
  } = useVideos()

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
        <TablePagination
          currentPage={currentPage}
          isFreeUser={isFreeUser}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      </main>
      <VideoTranscriptionGenerate
        copied={copied}
        handleCopy={handleCopy}
        isLoading={isTranscribing}
        setVideo={setSelectedVideo}
        video={selectedVideo}
        transcription={displayedTranscription}
      />
    </div>
  )
}

export default Videos
