import { api } from '@/convex/_generated/api'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import UseUser from '@/hooks/useUser'

const UseApiKey = () => {
  const { id } = UseUser()

  const { data: apiKey, isLoading } = useQuery({
    ...convexQuery(
      api.userApiKeys.getApiKey,
      id ? { clerk_id: id } : 'skip'
    ),
  })

  return {
    apiKey: apiKey ?? null,
    isLoading,
  }
}

export default UseApiKey
