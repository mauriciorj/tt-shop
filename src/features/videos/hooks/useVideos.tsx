import { useState, useMemo } from 'react'
import { TCategory } from '@/categories/types'
import { TPeriod } from '@/components/periodFilter'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import UseUser from '@/hooks/useUser'

const useVideos = () => {
  const ITEMS_PER_PAGE = 12

  const {
    FREE_USER_ITEMS_PER_PAGE,
    isFreeUser,
    isLoading: isLoadingDbUser,
  } = UseUser()

  // Filter states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<TPeriod>('30')

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

  return {
    categories,
    currentPage,
    data: videosPaginated,
    isFreeUser,
    isLoading: Boolean(getAllVideos === null && isLoadingDbUser),
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
