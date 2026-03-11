import { Zap, BarChart3, Target, Brain, DollarSign } from 'lucide-react'

const benefits = [
  {
    icon: Zap,
    title: 'Descubra produtos antes de saturar',
    description:
      'Identifique oportunidades lucrativas antes que a concorrência descubra.',
    highlight: false,
  },
  {
    icon: BarChart3,
    title: 'Veja dados reais de faturamento',
    description:
      'Acesse métricas verificadas de receita, vendas e desempenho de lojas.',
    highlight: false,
  },
  {
    icon: Target,
    title: 'Inspire-se em vídeos que vendem',
    description:
      'Analise os criativos que estão gerando mais conversões agora.',
    highlight: false,
  },
  {
    icon: Brain,
    title: 'Economize tempo testando produtos errados',
    description:
      'Pare de desperdiçar tempo e dinheiro com produtos que não vendem.',
    highlight: false,
  },
  {
    icon: DollarSign,
    title: 'Aumente suas chances de ganhar dinheiro',
    description:
      'Use dados para tomar decisões mais inteligentes e escalar seus resultados.',
    highlight: true,
  },
]

const BenefitsSection = () => {
  return (
    <section className="w-full relative flex items-center justify-center flex-col py-20 md:py-24 bg-secondary/30 px-4">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-14 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Pare de adivinhar. Comece a usar{' '}
            <span className="gradient-text">dados.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`glass-card rounded-2xl p-6 group transition-all animate-slide-up ${
                benefit.highlight
                  ? 'border-primary/50 ring-1 ring-primary/20 sm:col-span-2 lg:col-span-1'
                  : 'hover:border-primary/30'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`p-3 rounded-xl w-fit mb-4 transition-colors ${
                  benefit.highlight
                    ? 'bg-primary/20 group-hover:bg-primary/30'
                    : 'bg-primary/10 group-hover:bg-primary/20'
                }`}
              >
                <benefit.icon
                  className={`h-6 w-6 ${
                    benefit.highlight ? 'text-primary' : 'text-primary'
                  }`}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12 max-w-2xl mx-auto animate-fade-in">
          Afiliados que usam dados tomam decisões mais rápidas e encontram
          produtos vencedores antes da maioria.
        </p>
      </div>
    </section>
  )
}

export default BenefitsSection
