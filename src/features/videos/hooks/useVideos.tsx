import { useState, useMemo } from 'react'
import { useQuery } from 'convex/react'
import { LIMITS } from '@/businessRules/index'
import { TCategory } from '@/categories/types'
import { TPeriod } from '@/components/periodFilter'
import { api } from '@/convex/_generated/api'
import UseUser from '@/hooks/useUser'

const useVideos = () => {
  // Business rules
  const ITEMS_PER_PAGE = LIMITS.VIDEOS_PER_PAGE
  const ITEMS_MAX_FOR_FREE_USER = LIMITS.VIDEOS_MAX_TO_SHOW_TO_FREE_USER

  const { id, isFreeUser, isLoading: isLoadingDbUser } = UseUser()

  // Filter states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<TPeriod>('30')

  // Get ALL videos from the database
  const getVideos = useQuery(
    api.videos.getVideos,
    id ? { clerk_id: id } : 'skip'
  )

  // Show only unique categories from videos
  // This is being done on client side to avoid extra Convex resources as the categories
  // is a static list for now
  const categories = useMemo(() => {
    if (getVideos) {
      const getUniqueCategoriesFromVideos: TCategory[] = Array.from(
        new Map(
          getVideos
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
  }, [getVideos])

  // Handle Video Pagination
  const videosPaginated = useMemo(() => {
    if (!getVideos) return []

    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = currentPage * ITEMS_PER_PAGE

    let result = getVideos

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
    result = isFreeUser ? result.slice(0, ITEMS_MAX_FOR_FREE_USER) : result

    return result.slice(start, end)
  }, [getVideos, categories, currentPage, selectedCategory, selectedPeriod])

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

  return {
    categories,
    currentPage,
    data: videosPaginated,
    isFreeUser,
    isLoading: Boolean(getVideos === null && isLoadingDbUser),
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange,
    selectedCategory,
    selectedPeriod,
    setCurrentPage,
    setSelectedCategory,
    setSelectedPeriod,
    totalPages,
  }
}

export default useVideos
