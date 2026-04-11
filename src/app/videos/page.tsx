'use client'

import Breadcrumb from '@/components/breadcrumb'
import Categories from '@/components/categories'
import CategoriesSkeleton from '@/components/categoriesSkeleton'
import TablePagination from '@/components/tablePagination'
import VideoCard from '@/videos/components/videoCard'
import VideoCardSkeleton from '@/videos/components/videoCardSkeleton'
import VideoTranscriptionEnhanceDialog from '@/videos/components/videoTranscriptionEnhanceDialog'
import VideoTranscriptionGenerateDialog from '@/videos/components/videoTranscriptionGenerateDialog'
import useVideos from '@/videos/hooks/useVideos'
import useSaveVideo from '@/videos/hooks/useSaveVideo'
import useVideoTranscriptionEnhance from '@/videos/hooks/useVideoTranscriptionEnhance'
import useVideoTranscriptionGenerate from '@/videos/hooks/useVideoTranscriptionGenerate'

const Videos = () => {
  const {
    categories,
    currentPage,
    data: videos,
    isFreeUser,
    isLoading,
    onPageChange,
    selectedCategory,
    // selectedPeriod,
    setCurrentPage,
    setSelectedCategory,
    // setSelectedPeriod,
    totalPages,
  } = useVideos()

  const { handleToggleSave, savedVideoIds } = useSaveVideo()

  const {
    copied: videoTranscriptionGenerateCopied,
    handleCopy: handleVideoTranscriptionGenerateCopy,
    handleOpenTranscription,
    isLoading: isTranscribing,
    video: selectedVideoToTranscribe,
    setVideo: setSelectedVideoToTranscribe,
    transcription,
  } = useVideoTranscriptionGenerate()

  const {
    copied: videoTranscriptionEnhanceCopied,
    errorMessage,
    handleCopy: handleVideoTranscriptionEnhanceCopy,
    handleEnhance,
    handleOpenEnhanceDialog,
    instruction,
    result,
    video: selectedVideosTranscriptionToEnhance,
    setInstruction,
    setVideo: setSelectedVideosTranscriptionToEnhance,
    status,
  } = useVideoTranscriptionEnhance()

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
                setSelectedVideosTranscriptionToEnhance={
                  setSelectedVideosTranscriptionToEnhance
                }
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
      <VideoTranscriptionGenerateDialog
        copied={videoTranscriptionGenerateCopied}
        handleCopy={handleVideoTranscriptionGenerateCopy}
        isLoading={isTranscribing}
        setVideo={setSelectedVideoToTranscribe}
        video={selectedVideoToTranscribe}
        transcription={transcription}
      />
      <VideoTranscriptionEnhanceDialog
        copied={videoTranscriptionEnhanceCopied}
        errorMessage={errorMessage}
        handleCopy={handleVideoTranscriptionEnhanceCopy}
        handleEnhance={handleEnhance}
        handleOpenEnhanceDialog={handleOpenEnhanceDialog}
        instruction={instruction}
        result={result}
        selectedVideosTranscriptionToEnhance={
          selectedVideosTranscriptionToEnhance
        }
        setInstruction={setInstruction}
        status={status}
      />
    </div>
  )
}

export default Videos
