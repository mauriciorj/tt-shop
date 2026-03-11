import {
  Search,
  Play,
  TrendingUp,
  DollarSign,
} from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: Search,
    title: 'Encontre produtos lucrativos',
    description:
      'Veja quais produtos estão gerando mais vendas no TikTok Shop.',
  },
  {
    number: 2,
    icon: Play,
    title: 'Analise os vídeos que vendem',
    description: 'Descubra quais criativos estão convertendo.',
  },
  {
    number: 3,
    icon: TrendingUp,
    title: 'Replique o padrão',
    description: 'Crie seu conteúdo baseado no que já funciona.',
  },
  {
    number: 4,
    icon: DollarSign,
    title: 'Escale suas vendas',
    description: 'Publique mais vídeos vencedores.',
  },
]

const HowItWorksSection = () => {
  return (
    <section className="w-full relative flex items-center justify-center flex-col py-20 md:py-24 bg-secondary/30 px-4">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Como afiliados usam o ShopRadar para encontrar produtos{' '}
            <span className="gradient-text">vencedores</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center"
            >
              <div
                className="glass-card h-full rounded-2xl p-6 text-center w-full animate-slide-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {/* Step number */}
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center text-2xl font-bold text-primary">
                  {step.number}
                </div>

                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom wave divider */}
      <div className="absolute -bottom-px left-0 right-0 overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 md:h-10"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40V20C240 0 480 0 720 20C960 40 1200 40 1440 20V40H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  )
}

export default HowItWorksSection
