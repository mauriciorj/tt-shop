'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Home, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [session, setSession] = useState<object | null>(null)

  useEffect(() => {
    fetch('/api/clear-sub-cache', { method: 'POST' })
  }, [])

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout-session?sessionId=${sessionId}`)
        .then((res) => res.json())
        .then((data) => setSession(data))
        // eslint-disable-next-line no-console
        .catch((err) => console.error('Error fetching session:', err))
    }
  }, [sessionId])

  return (
    <main className="flex-1 flex items-center justify-center py-24">
      <div className="container max-w-2xl">
        <div className="glass-card rounded-3xl p-12 text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Muito <span className="gradient-text">obrigado!</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-2">
            Sua compra foi concluida com sucesso.
          </p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Bem-vindo! Sua conta já está ativa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="glow-effect rounded-xl px-8">
              <Link href="/stores">
                <Store className="h-4 w-4 mr-2" />
                Explore Stores
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="rounded-xl px-8"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Voltar para Home
              </Link>
            </Button>
          </div>

          <div className="mt-10 pt-8 border-t border-border/40">
            <p className="text-sm text-muted-foreground">
              Um email de confirmação foi enviado para sua caixa de entrada.{' '}
              <Link href="/suporte" className="text-primary hover:underline">
                Precisa de ajuda?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

function Loading() {
  return (
    <main className="flex-1 flex items-center justify-center py-24">
      <div className="container max-w-2xl">
        <div className="glass-card rounded-3xl p-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Carregando...</span>
          </h1>
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SuccessContent />
    </Suspense>
  )
}
