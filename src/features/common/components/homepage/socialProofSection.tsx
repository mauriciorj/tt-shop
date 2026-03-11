import { Quote } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

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
]

const SocialProofSection = () => {
  return (
    <section className="w-full relative flex items-center justify-center flex-col py-20 md:py-24 px-4">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container max-w-4xl">
        <div className="text-center mb-14 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Afiliados já estão usando{' '}
            <span className="gradient-text">ShopRadar</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={t.author}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
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
          ))}
        </div>

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

export default SocialProofSection
