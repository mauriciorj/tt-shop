import { api } from '@/convex/_generated/api'
import { useConvexPaginatedQuery } from '@convex-dev/react-query'

const useProducts = () => {
  const { results, isLoading, status, loadMore } = useConvexPaginatedQuery(
    api.products.getProducts, // Reference to your Convex query function
    {
      // Optional initial arguments for your query
    },
    {
      initialNumItems: 10, // Initial number of items to load
    },
  )

  const totalProducts = 10

  return {
    data: results || [],
    isLoading,
    totalProducts,
  }
}

export default useProducts
