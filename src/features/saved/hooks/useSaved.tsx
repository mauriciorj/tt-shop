import { useRouter } from 'next/navigation'
import { api } from '@/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import UseUser from '@/hooks/useUser'
import { useQuery } from '@tanstack/react-query'

const UseSaved = () => {
  const router = useRouter()
  const { id } = UseUser()

  const { data: savedVideosQuery, isLoading: savedVideosIsLoading } = useQuery({
    ...convexQuery(
      api.savedVideos.getSavedVideos,
      id ? { clerk_id: id } : 'skip'
    ),
  })
  const savedVideos = savedVideosQuery ?? []

  const { data: savedProductsQuery, isLoading: savedProductsIsLoading } =
    useQuery({
      ...convexQuery(
        api.savedProducts.getSavedProducts,
        id ? { clerk_id: id } : 'skip'
      ),
    })
  const savedProducts = savedProductsQuery ?? []

  const { data: savedStoresQuery, isLoading: savedStoresIsLoading } = useQuery({
    ...convexQuery(
      api.savedStores.getSavedStores,
      id ? { clerk_id: id } : 'skip'
    ),
  })
  const savedStores = savedStoresQuery ?? []

  return {
    savedVideos,
    savedVideosIsLoading,
    savedProducts,
    savedProductsIsLoading,
    savedStores,
    savedStoresIsLoading,
  }
}

export default UseSaved
