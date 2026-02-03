import { useState, useMemo } from 'react'
import { api } from '@/convex/_generated/api'
import { useConvexPaginatedQuery } from '@convex-dev/react-query'
import useCategories from '@/hooks/useCategories'

import { mockProducts } from './mockProducts'

const useProducts = () => {
  const ITEMS_PER_PAGE = 10

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { data: categories } = useCategories()

  const { results, isLoading, status, loadMore } = useConvexPaginatedQuery(
    api.products.getProducts, // Reference to your Convex query function
    {
      // Optional initial arguments for your query
    },
    {
      initialNumItems: 10, // Initial number of items to load
    },
  )

  const resultWithCategories = results?.map((product) => {
    return {
      ...product,
      category: categories?.find((category) => category.id === product.category)
        ?.label,
    }
  })

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product: any) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      return matchesCategory
    })
  }, [selectedCategory])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)

  const totalProducts = 10

  return {
    categories,
    currentPage,
    data: resultWithCategories || [],
    isLoading,
    selectedCategory,
    setCurrentPage,
    setSelectedCategory,
    status,
    loadMore,
    totalPages,
    totalProducts,
  }
}

export default useProducts
