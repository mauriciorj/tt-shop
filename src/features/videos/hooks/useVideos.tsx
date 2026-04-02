import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { TCategory } from '@/categories/types'
import { TPeriod } from '@/components/periodFilter'
import { api } from '@/convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import UseUser from '@/hooks/useUser'
import { ITopVideosWithCategory } from '@/videos/types'

const useVideos = () => {
  const router = useRouter()

  const ITEMS_PER_PAGE = 12

  const {
    FREE_USER_ITEMS_PER_PAGE,
    id: userId,
    isFreeUser,
    isLoading: isLoadingDbUser,
    userSubscriptionPlan,
  } = UseUser()

  const [copied, setCopied] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<TPeriod>('30')
  const [selectedVideo, setSelectedVideo] =
    useState<ITopVideosWithCategory | null>(null)

  // Get saved videos from the database
  const savedVideoIds = useQuery(
    api.savedVideos.getSavedVideoIds,
    userId ? { clerk_id: userId } : 'skip'
  )

  const toggleSaved = useMutation(api.savedVideos.toggleSavedVideo)

  // Increase transcription count in the database
  const recordTranscription = useMutation(
    api.users.recordTranscriptionAndCheckLimit
  )

  // Get ALL videos from the database
  const getAllVideos = useQuery(api.videos.getAllVideos)

  // Show only unique categories from videos
  const categories = useMemo(() => {
    if (getAllVideos) {
      const getUniqueCategoriesFromVideos: TCategory[] = Array.from(
        new Map(
          getAllVideos
            .filter((video) => video?.category_name && video?.category_id)
            .map((video) => [
              video.category_id,
              { id: video.category_id, label: video.category_name },
            ])
        ).values()
      ).sort((a, b) => a.label!.localeCompare(b.label!))

      if (getUniqueCategoriesFromVideos.length > 0) {
        return [
          {
            id: 'all',
            label: 'Todas as categorias',
          },
          ...getUniqueCategoriesFromVideos,
        ]
      }
    }
  }, [getAllVideos])

  // Paginate videos
  const videosPaginated = useMemo(() => {
    if (!getAllVideos) return []

    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = currentPage * ITEMS_PER_PAGE

    let result = getAllVideos

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      const categoryByName = categories?.find(
        (category) => category.id === selectedCategory
      )?.label
      result = result?.filter((video) => video.category_name === categoryByName)
    }

    // Add the correct revenue to the result
    result = result.map((video, index) => ({
      ...video,
      rank: index + 1,
      revenue:
        selectedPeriod === '7'
          ? (video.revenue_7_days ?? video.revenue)
          : selectedPeriod === '14'
            ? (video.revenue_14_days ?? video.revenue)
            : video.revenue,
    }))

    // Limit the number of videos if it's free user
    result = isFreeUser ? result.slice(0, FREE_USER_ITEMS_PER_PAGE) : result

    return result.slice(start, end)
  }, [getAllVideos, categories, currentPage, selectedCategory, selectedPeriod])

  // Calculate the total number of pages loaded based on the number of stores and items per page
  const totalPages = useMemo(
    () =>
      videosPaginated?.length &&
      Math.ceil(videosPaginated?.length / ITEMS_PER_PAGE),
    [videosPaginated]
  )

  // Function related to pagination
  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Save or unsave a video
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

  // Open transcription modal
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

  // Copy transcription to clipboard
  const handleCopy = async () => {
    if (!selectedVideo?.transcription) return
    await navigator.clipboard.writeText(selectedVideo.transcription)
    setCopied(true)
    toast.success('Transcrição copiada para a área de transferência.')
    setTimeout(() => setCopied(false), 2000)
  }

  return {
    categories,
    copied,
    currentPage,
    data: videosPaginated,
    handleCopy,
    handleOpenTranscription,
    handleToggleSave,
    isFreeUser,
    isLoading: Boolean(getAllVideos === null && isLoadingDbUser),
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange,
    recordTranscription,
    selectedVideo,
    savedVideoIds,
    selectedCategory,
    selectedPeriod,
    setCopied,
    setCurrentPage,
    setSelectedCategory,
    setSelectedPeriod,
    setSelectedVideo,
    toggleSaved,
    totalPages,
    userSubscriptionPlan,
  }
}

export default useVideos
