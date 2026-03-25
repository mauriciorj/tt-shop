import type { Metadata } from 'next'
import Link from 'next/link'
import { SearchX } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Página não encontrada – UseShopRadar',
  description: 'A página que você está procurando não existe.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center py-24">
      <div className="container max-w-2xl">
        <div className="glass-card rounded-3xl p-12 text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <SearchX className="h-10 w-10 text-primary" />
            </div>
          </div>

          <p className="text-8xl font-extrabold gradient-text mb-4">404</p>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            Página não encontrada
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            A página que você está procurando não existe ou foi removida.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </main>
  )
}
