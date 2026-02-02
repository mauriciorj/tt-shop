import { useState, useMemo } from 'react'
import { api } from '@/convex/_generated/api'
import { useConvexPaginatedQuery } from '@convex-dev/react-query'

import { mockStores } from './mockStores'
import useCategories from '@/hooks/useCategories'

const useStores = () => {
  const ITEMS_PER_PAGE = 10

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  )

  const { data: categories } = useCategories()

  const { results, isLoading, status, loadMore } = useConvexPaginatedQuery(
    api.stores.getStores, // Reference to your Convex query function
    {
      // Optional initial arguments for your query
    },
    {
      initialNumItems: 10, // Initial number of items to load
    },
  )

  const resultWithCategories = results?.map((store) => {
    return {
      ...store,
      category: categories?.find((category) => category.id === store.category)
        ?.label,
    }
  })

  const filteredStores = useMemo(() => {
    return mockStores.filter((store) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        store.category.toLowerCase() === selectedCategory.toLowerCase()
      return matchesCategory
    })
  }, [selectedCategory])

  const totalPages = Math.ceil(filteredStores.length / ITEMS_PER_PAGE)
  const paginatedStores = filteredStores.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const totalStores = 10

  return {
    categories,
    currentPage,
    data: resultWithCategories,
    isLoading,
    loadMore,
    paginatedStores,
    selectedCategory,
    selectedSubcategory,
    setSelectedCategory,
    setCurrentPage,
    setSelectedSubcategory,
    status,
    totalPages,
    totalStores,
  }
}

export default useStores
