'use client'

import Breadcrumb from '@/components/breadcrumb'
import Categories from '@/components/categories'
import CategoriesSkeleton from '@/components/categoriesSkeleton'
import TablePagination from '@/components/tablePagination'
import VideoCard from '@/videos/components/videoCard'
import VideoCardSkeleton from '@/videos/components/videoCardSkeleton'
import VideoTranscriptionEnhanceDialog from '@/videos/components/videoTranscriptionEnhanceDialog'
import VideoTranscriptionGenerateDialog from '@/videos/components/videoTranscriptionGenerateDialog'
import useSaveVideo from '@/videos/hooks/useSaveVideo'
import useVideos from '@/videos/hooks/useVideos'
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

  const { handleToggleSave } = useSaveVideo()

  const {
    handleOpenDialog: handleOpenDialogTranscription,
    isCopied: isVideoTranscriptionGenerateCopied,
    isLoading: isTranscribingVideoLoading,
    setTextToCopy: setVideoTranscriptionToCopy,
    setVideo: setSelectedVideoToTranscribe,
    transcription,
    usage: transcriptionUsage,
    video: selectedVideoToTranscribe,
  } = useVideoTranscriptionGenerate()

  const {
    errorMessage,
    handleEnhance,
    handleOpenDialog: handleOpenDialogEnhance,
    instruction,
    isCopied: videoTranscriptionEnhanceCopied,
    setTextToCopy: setVideoTranscriptionEnhancedToCopy,
    transcriptionEnhanced,
    setInstruction,
    setVideoToGetTranscription: setSelectedVideosTranscriptionToEnhance,
    status,
    usage: enhancementUsage,
    videoToGetTranscription: selectedVideosTranscriptionToEnhance,
  } = useVideoTranscriptionEnhance()

  return (
    <div className="min-h-screen flex flex-col" data-testid="videos-page">
      <main
        className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]"
        data-testid="videos-page-main"
      >
        <Breadcrumb
          description="Descubra os melhores vídeos no TikTok Shop"
          title="Vídeos"
          enhancementLimit={enhancementUsage?.limit}
          enhancementPeriod={enhancementUsage?.period}
          enhancementUsage={enhancementUsage?.used}
          transcriptionLimit={transcriptionUsage?.limit}
          transcriptionUsage={transcriptionUsage?.used}
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
                setSelectedVideoToEnhance={
                  setSelectedVideosTranscriptionToEnhance
                }
                setSelectedVideoToTranscribe={handleOpenDialogTranscription}
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
        isCopied={isVideoTranscriptionGenerateCopied}
        isLoading={isTranscribingVideoLoading}
        selectedVideo={selectedVideoToTranscribe}
        setTextToCopy={setVideoTranscriptionToCopy}
        setVideo={setSelectedVideoToTranscribe}
        transcription={transcription}
      />
      <VideoTranscriptionEnhanceDialog
        copied={videoTranscriptionEnhanceCopied}
        errorMessage={errorMessage}
        handleEnhance={handleEnhance}
        handleOpenDialog={handleOpenDialogEnhance}
        instruction={instruction}
        result={transcriptionEnhanced}
        selectedVideo={selectedVideosTranscriptionToEnhance}
        setInstruction={setInstruction}
        setTextToCopy={setVideoTranscriptionEnhancedToCopy}
        status={status}
      />
    </div>
  )
}

export default Videos
