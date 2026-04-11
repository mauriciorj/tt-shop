'use client'

import { KeyRound, Lock } from 'lucide-react'
import Link from 'next/link'
import ApiKeyManager from '../../features/api-keys/components/apiKeyManager'
import UseUser from '@/hooks/useUser'
import { Button } from '@/ui/button'

const ApiPage = () => {
  const { isFreeUser, isLoading } = UseUser()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8 px-10 justify-center items-center mx-auto max-w-[1400px]">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">
              Chaves de <span className="gradient-text">API</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Gerencie suas chaves de acesso à API do UseShopRadar
          </p>
        </div>

        <div className="max-w-2xl animate-slide-up">
          {!isLoading && isFreeUser ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 gap-4 text-center">
              <div className="p-3 rounded-xl bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">
                  Recurso exclusivo para assinantes
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Faça upgrade do seu plano para acessar a API do UseShopRadar.
                </p>
              </div>
              <Button asChild>
                <Link href="/subscription">Fazer upgrade</Link>
              </Button>
            </div>
          ) : (
            <>
              <ApiKeyManager />
              <div className="mt-6 rounded-2xl border border-border bg-card p-6 space-y-3">
                <h3 className="font-semibold text-sm">Como usar</h3>
                <p className="text-sm text-muted-foreground">
                  Inclua sua chave no cabeçalho de cada requisição:
                </p>
                <pre className="rounded-xl bg-secondary/50 border border-border px-4 py-3 text-xs font-mono overflow-x-auto">
                  {`GET /api/videos\nAuthorization: Bearer usr_sua_chave_aqui`}
                </pre>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default ApiPage
