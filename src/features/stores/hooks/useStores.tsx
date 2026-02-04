import { useState, useMemo, useCallback } from 'react'
import { api } from '@/convex/_generated/api'
import { usePaginatedQuery } from 'convex/react'
import { useConvexQuery } from '@convex-dev/react-query'
import useCategories from '@/hooks/useCategories'
import { IStoreWithCategory } from '../types'

const useStores = () => {
  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)

  const [stores, setStores] = useState<IStoreWithCategory[]>([])

  const [selectedCategory, setSelectedCategory] = useState('all')

  // Get the total number of stores from the database
  // TODO: update to use aggregation
  const getTotalStores = useConvexQuery(api.stores.getStoresCount)

  // Calculate the total number of pages loaded based on the number of stores and items per page
  const totalPages = useMemo(
    () =>
      getTotalStores?.length &&
      Math.ceil(getTotalStores?.length / ITEMS_PER_PAGE),
    [getTotalStores]
  )

  // const totalStores = 10

  // Get the categories from the database
  const { data: categories } = useCategories()

  // Get the stores from the database
  const { results, isLoading, status, loadMore } = usePaginatedQuery(
    api.stores.getStores, // Reference to your Convex query function
    {
      // Optional initial arguments for your query
    },
    {
      initialNumItems: ITEMS_PER_PAGE, // Initial number of items to load
    }
  )

  useCallback(() => {
    const resultWithCategories = results?.map((store) => {
      return {
        ...store,
        category: categories?.find((category) => category.id === store.category)
          ?.label,
      }
    })
    setStores(resultWithCategories)
  }, [results])

  // Function to get the stores for the current page
  const storesPaginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = currentPage * ITEMS_PER_PAGE

    return stores.slice(start, end)
  }, [stores, currentPage])

  // Function to load more stores when the user clicks on the next page
  // It should only load more stores if the user request a non fetched page
  const onPageChange = (page: number) => {
    if (page > currentPage) {
      loadMore(ITEMS_PER_PAGE)
    }
    setCurrentPage(page)
  }

  return {
    categories,
    currentPage,
    data: storesPaginated,
    isLoading,
    onPageChange,
    loadMore,
    selectedCategory,
    setCurrentPage,
    setSelectedCategory,
    status,
    totalPages,
    totalStores: getTotalStores?.length,
  }
}

export default useStores
