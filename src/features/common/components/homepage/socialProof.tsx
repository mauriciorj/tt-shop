'use client'

import { Quote } from 'lucide-react'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'

const testimonials = [
  {
    quote:
      'Encontrei um produto no ShopRadar e fiz minhas primeiras vendas no TikTok.',
    author: 'João',
    role: 'Afiliado iniciante',
    initials: 'JO',
  },
  {
    quote: 'Agora eu só crio vídeo baseado em dados.',
    author: 'Mariana',
    role: 'Criadora de conteúdo',
    initials: 'MA',
  },
  {
    quote:
      'O ShopRadar me ajudou a encontrar nichos lucrativos que ninguém estava explorando.',
    author: 'Carlos',
    role: 'Empreendedor digital',
    initials: 'CA',
  },
  {
    quote:
      'Triplicou minhas vendas em menos de um mês usando os dados da plataforma.',
    author: 'Ana',
    role: 'Afiliada profissional',
    initials: 'AN',
  },
]

const SocialProof = () => {
  return (
    <section className="w-full relative flex items-center justify-center flex-col py-20 md:py-24 bg-secondary/30 px-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-14 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Afiliados já estão usando{' '}
            <span className="gradient-text">ShopRadar</span>
          </h2>
        </div>

        <Carousel
          opts={{ align: 'start', loop: true }}
          plugins={[Autoplay({ delay: 3000, stopOnInteraction: true })]}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((t) => (
              <CarouselItem key={t.author} className="sm:basis-1/2">
                <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 h-full">
                  <Quote className="h-6 w-6 text-primary/60" />
                  <p className="text-foreground/90 text-base leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-auto pt-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="text-center mt-12 animate-fade-in">
          <p className="text-sm text-muted-foreground mb-6">
            Seja um dos primeiros afiliados a usar o ShopRadar.
          </p>
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all glow-effect"
          >
            Começar agora
          </Link>
        </div>
      </div>
    </section>
  )
}

export default SocialProof
