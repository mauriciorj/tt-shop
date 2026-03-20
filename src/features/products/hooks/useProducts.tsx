import { useState, useMemo } from 'react'
import { api } from '@/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import UseUser from '@/hooks/useUser'
import { TSortKey, TSortOrder } from '@/products/types'
import { useQuery } from '@tanstack/react-query'

type TCategory = { id: string; label: string | null | undefined }

const useProducts = () => {
  const ITEMS_PER_PAGE = 10
  const {
    FREE_USER_ITEMS_PER_PAGE,
    id,
    isLoading: isLoadingDbUser,
    userSubscriptionPlan,
  } = UseUser()

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [sortKey, setSortKey] = useState<TSortKey>('revenue')
  const [sortOrder, setSortOrder] = useState<TSortOrder>('desc')

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

  // Calculate the total number of pages loaded based on the number of stores and items per page
  const totalPages = useMemo(
    () =>
      getAllProducts?.length &&
      Math.ceil(getAllProducts?.length / ITEMS_PER_PAGE),
    [getAllProducts]
  )

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

    result =
      userSubscriptionPlan === 'free'
        ? result.slice(0, FREE_USER_ITEMS_PER_PAGE)
        : result

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
          aValue = a.revenue
          bValue = b.revenue
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
    }))

    return result.slice(start, end)
  }, [
    getAllProducts,
    categories,
    currentPage,
    selectedCategory,
    sortKey,
    sortOrder,
  ])

  // Function to load more stores when the user clicks on the next page
  // It should only load more stores if the user request a non fetched page
  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }

  return {
    categories,
    currentPage,
    data: productsPaginated,
    isLoading: Boolean(isLoadingAllProducts || isLoadingDbUser),
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
    userId: id,
    userSubscriptionPlan,
  }
}

export default useProducts
