import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { ITopVideosWithCategory, Status } from '@/videos/types'
import UseUser from '@/hooks/useUser'

const useVideoTranscriptionEnhance = () => {
  const { id: userId } = UseUser()

  const [video, setVideo] = useState<ITopVideosWithCategory | null>(null)

  const [instruction, setInstruction] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [copied, setCopied] = useState(false)

  const usage = useQuery(
    api.users.getEnhancementUsage,
    userId ? { clerk_id: userId } : 'skip'
  )

  const handleEnhance = async () => {
    if (!instruction.trim()) return
    setStatus('loading')
    setResult('')
    setErrorMessage('')

    try {
      const res = await fetch('/api/enhance-transcription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcription: video?.transcription,
          instruction: instruction.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? 'Erro ao gerar transcrição')
      }

      setResult(data.result)
      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Erro desconhecido')
      setStatus('error')
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenEnhanceDialog = (nextOpen: boolean) => {
    if (!nextOpen) {
      setInstruction('')
      setStatus('idle')
      setResult('')
      setErrorMessage('')
      setCopied(false)
      setVideo(null)
    }
  }

  return {
    copied,
    errorMessage,
    usage,
    handleCopy,
    handleEnhance,
    handleOpenEnhanceDialog,
    instruction,
    result,
    video,
    setInstruction,
    setVideo,
    status,
  }
}

export default useVideoTranscriptionEnhance
