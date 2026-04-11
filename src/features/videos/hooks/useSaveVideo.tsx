import { toast } from 'sonner'
import { api } from '@/convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import UseUser from '@/hooks/useUser'

const useSaveVideos = () => {
  const { id: userId } = UseUser()

  // Get saved videos from the database
  const savedVideoIds = useQuery(
    api.savedVideos.getSavedVideoIds,
    userId ? { clerk_id: userId } : 'skip'
  )

  const toggleSaved = useMutation(api.savedVideos.toggleSavedVideo)

  // Save or unsave a video
  const handleToggleSave = async (videoKId: string) => {
    if (!userId) {
      toast.error('Faça login para salvar vídeos.')
      return
    }
    const result = await toggleSaved({
      clerk_id: userId,
      video_k_id: videoKId,
    })
    if (result.saved) {
      toast.success('Vídeo salvo!')
    } else {
      toast.success('Vídeo removido dos salvos.')
    }
  }

  return {
    handleToggleSave,
    savedVideoIds,
  }
}

export default useSaveVideos
