import { useState } from 'react'
import { toast } from 'sonner'

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const setTextToCopy = async (text: string) => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setIsCopied(true)
    toast.success('Transcrição copiada para a área de transferência.')
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return { isCopied, setTextToCopy }
}

export default useCopyToClipboard
