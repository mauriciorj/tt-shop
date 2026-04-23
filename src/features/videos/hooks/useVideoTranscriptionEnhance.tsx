import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import { ITopVideosWithCategory, Status } from '@/videos/types'
import UseUser from '@/hooks/useUser'

const useVideoTranscriptionEnhance = () => {
  const { id: userId } = UseUser()

  // Filter states
  const { isCopied, setTextToCopy } = useCopyToClipboard()

  // Enhance video controls
  const [errorMessage, setErrorMessage] = useState('')
  const [instruction, setInstruction] = useState('')
  const [transcriptionEnhanced, setTranscriptionEnhanced] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [videoToGetTranscription, setVideoToGetTranscription] =
    useState<ITopVideosWithCategory | null>(null)
  const [video, setVideo] = useState<ITopVideosWithCategory | null>(null)

  const usage = useQuery(
    api.users.getEnhancementUsageTodayAndWeekly,
    userId ? { clerk_id: userId } : 'skip'
  )

  const handleEnhance = async () => {
    if (!instruction.trim()) return
    setStatus('loading')
    setTranscriptionEnhanced('')
    setErrorMessage('')

    try {
      const res = await fetch('/api/enhance-transcription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction: instruction.trim(),
          transcription: videoToGetTranscription?.transcription,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? 'Erro ao gerar transcrição')
      }

      setTranscriptionEnhanced(data.result)
      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro desconhecido')
      setStatus('error')
    }
  }

  const handleOpenDialog = (nextOpen: boolean) => {
    if (!nextOpen) {
      setInstruction('')
      setStatus('idle')
      setTranscriptionEnhanced('')
      setErrorMessage('')
      setVideoToGetTranscription(null)
    }
  }

  return {
    errorMessage,
    handleEnhance,
    handleOpenDialog,
    instruction,
    isCopied,
    setTextToCopy,
    transcriptionEnhanced,
    setInstruction,
    setVideoToGetTranscription,
    status,
    usage,
    videoToGetTranscription,
  }
}

export default useVideoTranscriptionEnhance
