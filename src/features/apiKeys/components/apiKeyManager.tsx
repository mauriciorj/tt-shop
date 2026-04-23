'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { KeyRound, Copy, Trash2, RefreshCw, CheckCheck } from 'lucide-react'
import { Button } from '@/ui/button'
import { Skeleton } from '@/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/alert-dialog'
import UseApiKey from '@/apiKeys/hooks/useApiKey'
import UseUser from '@/hooks/useUser'

const ApiKeyManager = () => {
  const { id } = UseUser()
  const { apiKey, isLoading } = UseApiKey()

  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [showKeyDialog, setShowKeyDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/generate-key', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Failed to generate key')

      setGeneratedKey(data.key)
      setShowKeyDialog(true)
    } catch (err) {
      toast.error('Falha ao gerar a chave de API')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    setIsDeleting(true)
    try {
      const res = await fetch('/api/delete-key', { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Chave de API removida com sucesso')
    } catch {
      toast.error('Falha ao remover a chave de API')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleCopy = async () => {
    if (!generatedKey) return
    await navigator.clipboard.writeText(generatedKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCloseKeyDialog = () => {
    setShowKeyDialog(false)
    setGeneratedKey(null)
  }

  const maskedKey = apiKey
    ? `usr_${'*'.repeat(20)}...${randomSuffix(apiKey.created_at)}`
    : null

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Chave de API</h2>
          </div>
          {apiKey && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Revogar
            </Button>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Use esta chave para autenticar suas requisições à API.
          </p>
        </div>

        {isLoading ? (
          <Skeleton className="h-14 w-full rounded-xl" />
        ) : apiKey ? (
          <div className="flex items-center gap-3 rounded-xl bg-secondary/50 border border-border px-4 py-3">
            <KeyRound className="h-4 w-4 text-muted-foreground shrink-0" />
            <code className="flex-1 text-sm font-mono text-muted-foreground truncate">
              {maskedKey}
            </code>
            <span className="text-xs text-muted-foreground shrink-0">
              Criada em{' '}
              {new Date(apiKey.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 gap-3">
            <KeyRound className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhuma chave de API gerada ainda.
            </p>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          variant={apiKey ? 'outline' : 'default'}
          className="w-full"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`}
          />
          {apiKey ? 'Gerar nova chave' : 'Gerar chave de API'}
        </Button>

        {apiKey && (
          <p className="text-xs text-muted-foreground text-center -mt-2">
            Gerar uma nova chave revogará a chave atual imediatamente.
          </p>
        )}
      </div>

      {/* Generated key dialog — shown once */}
      <Dialog open={showKeyDialog} onOpenChange={handleCloseKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sua nova chave de API</DialogTitle>
            <DialogDescription>
              Copie e guarde esta chave agora. Ela não será exibida novamente.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-xl bg-secondary/50 border border-border px-4 py-3 mt-2">
            <code className="flex-1 text-sm font-mono break-all">
              {generatedKey}
            </code>
            <Button size="icon" variant="ghost" onClick={handleCopy}>
              {copied ? (
                <CheckCheck className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button className="w-full mt-2" onClick={handleCloseKeyDialog}>
            Entendi, já copiei
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revogar chave de API?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Qualquer aplicação usando esta
              chave perderá acesso imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revogar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Generates a stable short suffix from the creation timestamp so the masked
// key looks consistent between renders without leaking the actual key.
function randomSuffix(createdAt: string): string {
  const hash = createdAt.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return ((hash % 9000) + 1000).toString()
}

export default ApiKeyManager
