import { toast } from 'sonner'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import UseUser from '@/hooks/useUser'

const useSaveVideo = () => {
  const { id: userId } = UseUser()

  // Save or unsave a video
  const toggleSaved = useMutation(api.videos.updateSavedVideo)

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
  }
}

export default useSaveVideo
