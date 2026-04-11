import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import UseUser from '@/hooks/useUser'
import { ITopVideosWithCategory } from '@/videos/types'

const useVideoTranscriptionGenerate = () => {
  const router = useRouter()

  const { id: userId, isFreeUser } = UseUser()

  // Filter states
  const [copied, setCopied] = useState<boolean>(false)

  // Transcribe video controls
  const [video, setVideo] = useState<ITopVideosWithCategory | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [transcription, setTranscription] = useState<string>('')
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

  // Increase transcription count in the database
  const recordTranscription = useMutation(
    api.users.recordTranscriptionAndCheckLimit
  )

  // Open transcription modal
  const handleOpenTranscription = async (video: ITopVideosWithCategory) => {
    if (isFreeUser && userId) {
      const result = await recordTranscription({
        clerk_id: userId,
        video_k_id: video.video_id!,
      })
      if (!result.allowed) {
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

  // Copy transcription to clipboard
  const handleCopy = async () => {
    if (!video?.transcription) return
    await navigator.clipboard.writeText(video.transcription)
    setCopied(true)
    toast.success('Transcrição copiada para a área de transferência.')
    setTimeout(() => setCopied(false), 2000)
  }

  return {
    copied,
    handleCopy,
    handleOpenTranscription,
    isLoading,
    video,
    setVideo,
    transcription,
  }
}

export default useVideoTranscriptionGenerate
