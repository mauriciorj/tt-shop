import { useState, useMemo } from 'react'
import { api } from '@/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import UseUser from '@/hooks/useUser'
import { useQuery } from '@tanstack/react-query'

type TCategory = { id: string | null; label: string | null | undefined }

const useVideos = () => {
  const ITEMS_PER_PAGE = 12
  const { id } = UseUser()

  const { data: dbUser } = useQuery({
    ...convexQuery(api.users.getUserByClerkId, id ? { clerk_id: id } : 'skip'),
  })
  const userSubscriptionPlan = dbUser?.subscription_plan

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Get ALL stores from the database
  // TODO: check if this is the best to fetch all information needed
  // maybe aggregation + pagination is better
  const { data: getAllVideos, isLoading: isLoadingAllVideos } = useQuery({
    ...convexQuery(api.videos.getAllVideos),
  })

  // Show only unique categories from the stores
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

  // Calculate the total number of pages loaded based on the number of stores and items per page
  const totalPages = useMemo(
    () =>
      getAllVideos?.length && Math.ceil(getAllVideos?.length / ITEMS_PER_PAGE),
    [getAllVideos]
  )

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
      result = result?.filter((store) => store.category_name === categoryByName)
    }

    result = result.map((store, index) => ({
      ...store,
      rank: index + 1,
    }))

    return result.slice(start, end)
  }, [getAllVideos, categories, currentPage, selectedCategory])

  // Function related to pagination
  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

  return {
    categories,
    currentPage,
    data: videosPaginated,
    isLoading: isLoadingAllVideos,
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange,
    selectedCategory,
    setCurrentPage,
    setSelectedCategory,
    totalPages,
    userId: id,
    userSubscriptionPlan,
  }
}

export default useVideos
