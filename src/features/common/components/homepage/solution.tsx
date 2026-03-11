import { Package, Play, Store, TrendingUp, ShoppingBag } from 'lucide-react'

const features = [
  { icon: Package, text: 'Produtos que estão gerando vendas agora' },
  { icon: Play, text: 'Vídeos que realmente convertem' },
  { icon: Store, text: 'Lojas que mais faturam' },
  { icon: TrendingUp, text: 'Tendências antes de viralizar' },
]

const mockProducts = [
  { name: 'Luminária LED Smart', revenue: 'R$56.800', growth: '+210%' },
  { name: 'Cinta Modeladora', revenue: 'R$134.500', growth: '+185%' },
  { name: 'Organizador Maquiagem', revenue: 'R$41.200', growth: '+160%' },
]

const SolutionSection = () => {
  return (
    <section className="w-full relative flex items-center justify-center flex-col py-20 md:py-24 px-4">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            O ShopRadar mostra exatamente o que está{' '}
            <span className="gradient-text">vendendo.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Com o ShopRadar você descobre:
          </p>
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* Left — Features */}
          <div className="space-y-5 animate-fade-in">
            {features.map((feature, i) => (
              <div
                key={feature.text}
                className="flex items-center gap-4 glass-card rounded-xl p-5 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="shrink-0 h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm md:text-base font-medium">
                  {feature.text}
                </p>
              </div>
            ))}

            <p className="text-center lg:text-left text-sm font-semibold text-muted-foreground pt-4">
              Tudo em um único painel{' '}
              <span className="gradient-text">simples.</span>
            </p>
          </div>

          {/* Right — Dashboard mockup */}
          <div
            className="animate-slide-up lg:pl-2"
            style={{ animationDelay: '200ms' }}
          >
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">
                  Oportunidades Encontradas
                </span>
                <span className="text-xs text-muted-foreground">
                  Atualizado agora
                </span>
              </div>

              {mockProducts.map((product, i) => (
                <div
                  key={product.name}
                  className="rounded-xl bg-secondary/60 border border-border/40 p-4 flex items-center gap-4 animate-slide-up"
                  style={{ animationDelay: `${300 + i * 100}ms` }}
                >
                  <div className="shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.revenue} receita
                    </p>
                  </div>
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
    </section>
  )
}

export default SolutionSection
