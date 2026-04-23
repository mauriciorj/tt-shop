import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@/convex/_generated/api'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import UseUser from '@/hooks/useUser'
import { ITopVideosWithCategory } from '@/videos/types'

const useVideoTranscriptionGenerate = () => {
  const router = useRouter()
  const { id: userId, isFreeUser } = UseUser()

  // Filter states
  const { isCopied, setTextToCopy } = useCopyToClipboard()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [transcription, setTranscription] = useState<string>('')
  const [video, setVideo] = useState<ITopVideosWithCategory | null>(null)

  const transcribeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  )

  // Clean up animation when dialog closes
  useEffect(() => {
    if (!video) {
      if (transcribeIntervalRef.current) {
        clearInterval(transcribeIntervalRef.current)
        transcribeIntervalRef.current = null
      }
      setIsLoading(false)
      setTranscription('')
    }
  }, [video])

  // Get transcription usage today
  const getTranscriptionUsageToday = useQuery(
    api.users.getTranscriptionUsageToday,
    isFreeUser && userId ? { clerk_id: userId } : 'skip'
  )

  // Open transcription modal
  const handleOpenDialog = async (video: ITopVideosWithCategory) => {
    if (isFreeUser && userId) {
      if (!getTranscriptionUsageToday?.isAllowed) {
        toast.error(
          'Você atingiu o limite de 1 transcrição por dia. Faça upgrade para acessar sem limites.',
          {
            action: {
              label: 'Ver planos',
              onClick: () => router.push('/subscription'),
            },
            duration: 6000,
          }
        )
        return
      }
    }
    setVideo(video)

    // Typewriter animation — reveals text in chunks to simulate live transcription
    const fullText = video.transcription ?? ''
    const CHUNK = 4
    const TICK_MS = 30
    let i = 0
    setIsLoading(true)
    setTranscription('')
    transcribeIntervalRef.current = setInterval(() => {
      i += CHUNK
      if (i >= fullText.length) {
        setTranscription(fullText)
        setIsLoading(false)
        clearInterval(transcribeIntervalRef.current!)
        transcribeIntervalRef.current = null
      } else {
        setTranscription(fullText.slice(0, i))
      }
    }, TICK_MS)
  }

  return {
    handleOpenDialog,
    isCopied,
    isLoading,
    setTextToCopy,
    setVideo,
    transcription,
    usage: getTranscriptionUsageToday,
    video,
  }
}

export default useVideoTranscriptionGenerate
