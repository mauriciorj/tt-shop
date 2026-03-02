import Link from 'next/link'
import { ArrowRight, TrendingUp, ShoppingBag, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const products = [
  {
    name: 'Mini Impressora Portátil',
    revenue: 'R$184.320',
    sales: '2.430',
    growth: '+320%',
  },
  {
    name: 'Escova Secadora',
    revenue: 'R$98.000',
    sales: '1.100',
    growth: '+180%',
  },
  {
    name: 'Fone Bluetooth',
    revenue: 'R$72.000',
    sales: '830',
    growth: '+140%',
  },
]

const Hero = () => {
  return (
    <section className="w-full relative flex items-center justify-center flex-col py-20 md:py-28 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-3xl opacity-30" />
      <div className="container relative px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              <BarChart3 className="h-3.5 w-3.5" />
              Inteligência para afiliados TikTok Shop
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] font-extrabold leading-[1.12] mb-6 tracking-tight">
              Descubra quais produtos estão faturando no TikTok Shop —{' '}
              <span className="gradient-text">
                e copie o que já está funcionando.
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Veja produtos virais, vídeos que geram vendas e lojas que mais
              faturam. Pare de postar no escuro e comece a criar conteúdo que
              vende.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              <Button
                asChild
                size="lg"
                className="rounded-xl px-8 py-6 text-base font-semibold glow-effect"
              >
                <Link href="/stores">
                  Começar agora
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="rounded-xl px-6 py-6 text-base text-muted-foreground hover:text-foreground"
              >
                <Link href="/stores">
                  Ver produtos lucrativos
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5 text-primary" />
              Dados baseados em tendências reais do TikTok Shop
            </p>
          </div>

          {/* Right — Dashboard mockup */}
          <div className="animate-slide-up lg:pl-4">
            <div className="glass-card rounded-2xl p-5 space-y-4">
              {/* Mini header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Produtos em Alta</span>
                <span className="text-xs text-muted-foreground">
                  Últimas 24h
                </span>
              </div>

              {products.map((product, i) => (
                <div
                  key={product.name}
                  className="rounded-xl bg-secondary/60 border border-border/40 p-4 flex items-center gap-4 animate-slide-up"
                  style={{ animationDelay: `${200 + i * 120}ms` }}
                >
                  {/* Icon */}
                  <div className="shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} vendas · {product.revenue}
                    </p>
                  </div>

                  {/* Growth badge */}
                  <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3" />
                    {product.growth}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Micro-benefits strip */}
      <div className="container relative mt-16 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { emoji: '📈', text: 'Descubra produtos virais' },
            { emoji: '🎥', text: 'Analise vídeos que vendem' },
            {
              emoji: '💰',
              text: 'Encontre oportunidades antes da concorrência',
            },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 rounded-xl bg-secondary/50 border border-border/40 px-5 py-3.5"
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
