import { useState, useMemo } from 'react'
import { api } from '@/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { TSortKey, TSortOrder } from '@/stores/types'
import { useQuery } from '@tanstack/react-query'

type TCategory = { id: string; label: string | null | undefined }

const useStores = () => {
  const ITEMS_PER_PAGE = 5

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [sortKey, setSortKey] = useState<TSortKey>('revenue')
  const [sortOrder, setSortOrder] = useState<TSortOrder>('desc')

  // Get ALL stores from the database
  // TODO: check if this is the best to fetch all information needed
  // maybe aggregation + pagination is better
  const { data: getAllStores, isLoading: isLoadingAllStores } = useQuery({
    ...convexQuery(api.stores.getAllStores),
  })

  // Show only unique categories from the stores
  const categories = useMemo(() => {
    if (getAllStores) {
      const getUniqueCategoriesFromStores: TCategory[] = Array.from(
        new Map(
          getAllStores
            .filter((store) => store.category_name && store.category_id)
            .map((store) => [
              store.category_id,
              { id: store.category_id, label: store.category_name },
            ])
        ).values()
      ).sort((a, b) => a.label!.localeCompare(b.label!))

      if (getUniqueCategoriesFromStores.length > 0) {
        return [
          {
            id: 'all',
            label: 'Todas as categorias',
          },
          ...getUniqueCategoriesFromStores,
        ]
      }
    }
  }, [getAllStores])

  // Calculate the total number of pages loaded based on the number of stores and items per page
  const totalPages = useMemo(
    () =>
      getAllStores?.length && Math.ceil(getAllStores?.length / ITEMS_PER_PAGE),
    [getAllStores]
  )

  // Function to get the stores for the current page
  const storesPaginated = useMemo(() => {
    if (!getAllStores) return []

    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = currentPage * ITEMS_PER_PAGE

    let result = getAllStores

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      const categoryByName = categories?.find(
        (category) => category.id === selectedCategory
      )?.label
      result = result?.filter((store) => store.category_name === categoryByName)
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

    result = result.map((store, index) => ({
      ...store,
      rank: index + 1,
    }))

    return result.slice(start, end)
  }, [
    getAllStores,
    categories,
    currentPage,
    selectedCategory,
    sortKey,
    sortOrder,
  ])

  // Function related to pagination
  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

  return {
    categories,
    currentPage,
    data: storesPaginated,
    isLoading: isLoadingAllStores,
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange,
    selectedCategory,
    setCurrentPage,
    setSelectedCategory,
    setSortKey,
    setSortOrder,
    sortKey,
    sortOrder,
    totalPages,
  }
}

export default useStores
