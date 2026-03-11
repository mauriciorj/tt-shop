'use client'

import Link from 'next/link'
import { Check, X } from 'lucide-react'

const Pricing = () => {
  return (
    <section
      id="price"
      className="w-full relative flex items-center justify-center flex-col py-20 md:py-24 px-4"
    >
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Preço </span>
            Simples e transparente
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano que atende às suas necessidades. Comece grátis e
            suba conforme cresce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div
            className="glass-card rounded-2xl p-8 animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Grátis</h3>
              <p className="text-muted-foreground">Perfeito para começar</p>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-extrabold">$0</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Top 10 lojas', 'Top 10 produtos', 'Top 10 vídeos'].map(
                (feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                )
              )}
              <li className="flex items-center gap-3 mb-16">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <X className="h-3 w-3 text-primary" />
                </div>
                <span className="text-muted-foreground">
                  Transcrição de vídeos
                </span>
              </li>
            </ul>
            <div className="w-[180px] absolute bottom-5 left-[calc(50%-90px)]">
              <Link
                href="/stores"
                className="block w-full text-center px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
              >
                Acesse Agora
              </Link>
            </div>
          </div>

          {/* Pro Plan */}
          <div
            className="glass-card rounded-2xl p-8 relative border-primary/50 animate-slide-up"
            style={{ animationDelay: '200ms' }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              Mais Popular
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-muted-foreground">Tudo que você precisa</p>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-extrabold">$47</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <ul className="space-y-4 mb-5">
              {[
                'Top lojas',
                'Top produtos',
                'Top vídeos',
                'Transcrição de vídeos',
                'Filtros avançados',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-500" />
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mb-16">
              <span className="italic gradient-text">Sem limites</span>
            </div>
            <div className="w-[180px] absolute bottom-5 left-[calc(50%-90px)]">
              <Link
                href="/stores"
                className="block w-full text-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all glow-effect"
              >
                Test Grátis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
