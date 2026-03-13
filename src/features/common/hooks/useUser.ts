import { useUser as useClerkUser } from '@clerk/nextjs'
import { api } from '@/convex/_generated/api'
import { useConvexAuth } from 'convex/react'
import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'

const UseUser = () => {
  const { isAuthenticated, isLoading: isLoadingAuth } = useConvexAuth()
  const { user } = useClerkUser()
  const clerkId = user?.id ?? ''

  const { data: dbUser, isLoading: isLoadingDbUser } = useQuery({
    ...convexQuery(
      api.users.getUserByClerkId,
      clerkId ? { clerk_id: clerkId } : 'skip'
    ),
  })
  const userSubscriptionPlan = dbUser?.subscription_plan || null

  return {
    id: clerkId,
    isAuthenticated,
    isLoading: Boolean(isLoadingAuth || isLoadingDbUser),
    userSubscriptionPlan,
  }
}

export default UseUser
