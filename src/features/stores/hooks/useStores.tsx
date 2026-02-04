import { useState, useMemo, useEffect } from 'react'
import { api } from '@/convex/_generated/api'
import { usePaginatedQuery } from 'convex/react'
import { convexQuery } from '@convex-dev/react-query'
import useCategories from '@/hooks/useCategories'
import { useQuery } from '@tanstack/react-query'
import { IStoreWithCategory, TSortKey, TSortOrder } from '@/stores/types'

const useStores = () => {
  const ITEMS_PER_PAGE = 10
  const [currentPage, setCurrentPage] = useState(1)

  const [stores, setStores] = useState<IStoreWithCategory[]>([])

  const [selectedCategory, setSelectedCategory] = useState('all')

  const [sortKey, setSortKey] = useState<TSortKey>('revenue')
  const [sortOrder, setSortOrder] = useState<TSortOrder>('desc')

  // Get the total number of stores from the database
  // TODO: update to use aggregation
  const { data: getTotalStores, isLoading: isLoadingTotalStores } = useQuery({
    ...convexQuery(api.stores.getStoresCount),
  })

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
  const {
    results,
    isLoading: isLoadingStores,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.stores.getStores, // Reference to your Convex query function
    {
      // Optional initial arguments for your query
    },
    {
      initialNumItems: 100, // Initial number of items to load
    }
  )

  useEffect(() => {
    const resultWithCategories = results?.map((store) => {
      return {
        ...store,
        category: categories?.find((category) => category.id === store.category)
          ?.label,
      }
    })
    setStores(resultWithCategories)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results])

  // Function to get the stores for the current page
  const storesPaginated = useMemo(() => {
    let result = stores

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      const categoryByName = categories?.find(
        (category) => category.id === selectedCategory
      )?.label
      result = result.filter((store) => store.category === categoryByName)
    }

    // Sort by key and order
    result = [...result].sort((a, b) => {
      let aValue: number | number[] = 0
      let bValue: number | number[] = 0

      switch (sortKey) {
        case 'revenue':
          aValue = a.revenue
          bValue = b.revenue
          break
        case 'revenueHistory':
          // Assuming we want to sort by the latest revenue in the history
          aValue = a.revenue_history?.[a.revenue_history.length - 1] ?? 0
          bValue = b.revenue_history?.[b.revenue_history.length - 1] ?? 0
          break
        case 'revenueGrowthRate':
          aValue = a.revenue_growth_rate
          bValue = b.revenue_growth_rate
          break
        case 'sales':
          aValue = a.sales
          bValue = b.sales
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = currentPage * ITEMS_PER_PAGE

    return result.slice(start, end)
  }, [stores, currentPage, selectedCategory, sortKey, sortOrder, categories])

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
    isLoading: Boolean(isLoadingStores || isLoadingTotalStores),
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange,
    loadMore,
    selectedCategory,
    setCurrentPage,
    setSelectedCategory,
    setSortKey,
    setSortOrder,
    sortKey,
    sortOrder,
    status,
    totalPages,
    totalStores: getTotalStores?.length,
  }
}

export default useStores
