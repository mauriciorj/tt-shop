'use client'

import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Check, Copy, FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useMutation } from '@tanstack/react-query'
import { useConvexMutation } from '@convex-dev/react-query'
import { api } from '@/convex/_generated/api'
import { IVideoDto } from '@/types/index'

const VideosTable = ({
  data,
  isBlog,
  isFreeUser,
  clerkId,
}: {
  data: IVideoDto[]
  isBlog?: boolean
  isFreeUser?: boolean
  clerkId?: string
}) => {
  const router = useRouter()
  const [selectedVideo, setSelectedVideo] = useState<IVideoDto | null>(null)
  const { mutateAsync: recordTranscription } = useMutation({
    mutationFn: useConvexMutation(api.users.updateTranscriptionLimit),
  })

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!selectedVideo?.transcription) {
      toast.error('Erro ao copiar transcrição.')
      return setSelectedVideo(null)
    }
    await navigator.clipboard.writeText(selectedVideo.transcription)
    setCopied(true)
    toast.success('Transcrição copiada para a área de transferência.')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!data) return null

  return (
    <>
      <div className="text-lg font-semibold text-foreground mt-10 mb-3">
        Top Videos
      </div>
      <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="w-full">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      #
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Conta TikTok
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Visualizações
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Duração
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Receita
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Vendas
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Transcrição
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr
                      key={item?.id}
                      className="table-row-hover border-b border-border/30 last:border-0"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="p-4">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                            index + 1 === 1
                              ? 'bg-primary text-primary-foreground'
                              : index + 1 === 2
                                ? 'bg-accent text-accent-foreground'
                                : index + 1 === 3
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          {index + 1}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-[50px]">
                            {isBlog && index < 7
                              ? 'n/a'
                              : item?.image && (
                                  <Image
                                    src={item?.image}
                                    alt={item?.id}
                                    width={40}
                                    height={40}
                                    style={{
                                      borderRadius: '10px',
                                    }}
                                  />
                                )}
                          </div>
                          <span className="font-semibold">
                            {isBlog && index < 7
                              ? 'n/a'
                              : `@${item?.tt_account}`}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {isBlog && index < 7
                          ? 'n/a'
                          : item?.views && (
                              <span className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground">
                                {new Intl.NumberFormat('pt-BR').format(
                                  item?.views
                                )}
                              </span>
                            )}
                      </td>
                      <td className="p-4 font-medium">
                        {isBlog && index < 7 ? 'n/a' : item?.duration}
                      </td>
                      <td className="p-4 font-medium">
                        {isBlog && index < 7
                          ? 'n/a'
                          : new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(item?.revenue)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {isBlog && index < 7
                            ? 'n/a'
                            : item?.sales && (
                                <span className="font-medium">
                                  {new Intl.NumberFormat('pt-BR').format(
                                    item?.sales
                                  )}
                                </span>
                              )}
                        </div>
                      </td>
                      <td className="p-4">
                        {isBlog && index < 7
                          ? 'n/a'
                          : item?.transcription && (
                              <button
                                onClick={async () => {
                                  if (isFreeUser && clerkId) {
                                    const result = await recordTranscription({
                                      clerk_id: clerkId,
                                      video_k_id: item.id,
                                    })
                                    if (!result.allowed) {
                                      toast.error(
                                        'Você atingiu o limite de 1 transcrição por dia. Faça upgrade para acessar sem limites.',
                                        {
                                          action: {
                                            label: 'Ver planos',
                                            onClick: () =>
                                              router.push('/subscription'),
                                          },
                                          duration: 6000,
                                        }
                                      )
                                      return
                                    }
                                  }
                                  setSelectedVideo(item)
                                }}
                                className="flex justify-center items-center w-[200px] items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-primary hover:bg-primary/60 text-primary-foreground cursor-pointer"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                Transcrição do vídeo
                              </button>
                            )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Transcription Dialog */}
      <Dialog
        open={!!selectedVideo}
        onOpenChange={() => setSelectedVideo(null)}
      >
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedVideo?.description}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Transcrição do vídeo
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 max-h-[400px] overflow-y-auto pr-2">
            <p className="text-sm text-foreground/80 leading-relaxed">
              {selectedVideo?.transcription}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex justify-center items-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-primary hover:bg-primary/60 text-primary-foreground cursor-pointer"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default VideosTable
