import { useState, useMemo } from 'react'
import { api } from '@/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import UseUser from '@/hooks/useUser'
import { TProductSortKey, TProductSortOrder } from '@/products/types'
import { useQuery } from '@tanstack/react-query'
import { TPeriod } from '@/components/periodFilter'
import { TCategory } from '@/categories/types'

const useProducts = () => {
  const ITEMS_PER_PAGE = 10
  const {
    FREE_USER_ITEMS_PER_PAGE,
    id,
    isFreeUser,
    isLoading: isLoadingDbUser,
    userSubscriptionPlan,
  } = UseUser()

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState<TPeriod>('30')

  const [sortKey, setSortKey] = useState<TProductSortKey>('revenue')
  const [sortOrder, setSortOrder] = useState<TProductSortOrder>('desc')

  // Get ALL products from the database
  // TODO: check if this is the best to fetch all information needed
  // maybe aggregation + pagination is better
  const { data: getAllProducts, isLoading: isLoadingAllProducts } = useQuery({
    ...convexQuery(api.products.getAllProducts),
  })

  // Show only unique categories from the products
  const categories = useMemo(() => {
    if (getAllProducts) {
      const getUniqueCategoriesFromProducts: TCategory[] = Array.from(
        new Map(
          getAllProducts
            .filter((product) => product.category_name)
            .map((product) => [
              product.category_id,
              { id: product.category_id, label: product.category_name },
            ])
        ).values()
      ).sort((a, b) => a.label!.localeCompare(b.label!))

      if (getUniqueCategoriesFromProducts.length > 0) {
        return [
          {
            id: 'all',
            label: 'Todas as categorias',
          },
          ...getUniqueCategoriesFromProducts,
        ]
      }
    }
  }, [getAllProducts])

  // Function to get the stores for the current page
  const productsPaginated = useMemo(() => {
    if (!getAllProducts) return []

    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = currentPage * ITEMS_PER_PAGE

    let result = getAllProducts

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      const categoryByName = categories?.find(
        (category) => category.id === selectedCategory
      )?.label
      result = result.filter(
        (product) => product.category_name === categoryByName
      )
    }

    result = isFreeUser ? result.slice(0, FREE_USER_ITEMS_PER_PAGE) : result

    // Sort by key and order
    result = [...result].sort((a, b) => {
      let aValue: number | number[] = 0
      let bValue: number | number[] = 0

      switch (sortKey) {
        case 'rating':
          aValue = a.product_rating
          bValue = b.product_rating
          break
        case 'revenue':
          aValue =
            selectedPeriod === '7'
              ? (a.revenue_7_days ?? a.revenue)
              : selectedPeriod === '14'
                ? (a.revenue_14_days ?? a.revenue)
                : a.revenue
          bValue =
            selectedPeriod === '7'
              ? (b.revenue_7_days ?? b.revenue)
              : selectedPeriod === '14'
                ? (b.revenue_14_days ?? b.revenue)
                : b.revenue
          break
        case 'revenueGrowthRate':
          aValue = a.revenue_growth_rate
          bValue = b.revenue_growth_rate
          break
        case 'revenueHistory':
          // Assuming we want to sort by the latest revenue in the history
          aValue = a.revenue_history?.[a.revenue_history.length - 1] ?? 0
          bValue = b.revenue_history?.[b.revenue_history.length - 1] ?? 0
          break
        case 'sales':
          aValue = a.sales
          bValue = b.sales
          break
        case 'unitPrice':
          aValue = a.unit_price
          bValue = b.unit_price
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

    result = result.map((product, index) => ({
      ...product,
      rank: index + 1,
      revenue:
        selectedPeriod === '7'
          ? (product.revenue_7_days ?? product.revenue)
          : selectedPeriod === '14'
            ? (product.revenue_14_days ?? product.revenue)
            : product.revenue,
    }))

    return result.slice(start, end)
  }, [
    getAllProducts,
    categories,
    currentPage,
    selectedCategory,
    selectedPeriod,
    sortKey,
    sortOrder,
  ])

  // Calculate the total number of pages loaded based on the number of stores and items per page
  const totalPages = useMemo(
    () =>
      productsPaginated?.length &&
      Math.ceil(productsPaginated?.length / ITEMS_PER_PAGE),
    [productsPaginated]
  )

  // Function to load more stores when the user clicks on the next page
  // It should only load more stores if the user request a non fetched page
  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

  return {
    categories,
    currentPage,
    data: productsPaginated,
    isFreeUser,
    isLoading: Boolean(isLoadingAllProducts || isLoadingDbUser),
    itemsPerPage: ITEMS_PER_PAGE,
    onPageChange,
    selectedCategory,
    selectedPeriod,
    setCurrentPage,
    setSelectedCategory,
    setSelectedPeriod,
    setSortKey,
    setSortOrder,
    sortKey,
    sortOrder,
    totalPages,
    userId: id,
    userSubscriptionPlan,
  }
}

export default useProducts
