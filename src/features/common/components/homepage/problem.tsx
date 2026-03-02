import { ShieldOff, Shuffle, UserX } from 'lucide-react'

const problems = [
  {
    icon: ShieldOff,
    title: 'Escolher um produto que não vende',
    description:
      'Você escolhe um produto baseado em feeling e descobre tarde demais que ele não vende.',
  },
  {
    icon: Shuffle,
    title: 'Copiar um vídeo que não converte',
    description:
      'Você copia um vídeo que viralizou, mas não sabe por que ele funcionou — então seu vídeo não vende.',
  },
  {
    icon: UserX,
    title: 'Entrar em uma tendência quando ela já morreu',
    description:
      'Você entra em uma tendência tarde demais e vê seu vídeo flopar.',
  },
]

const ProblemSection = () => {
  return (
    <section className="w-full relative flex items-center justify-center flex-col py-20 md:py-24 bg-secondary/30 px-4">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            A maioria dos afiliados falha porque posta no{' '}
            <span className="gradient-text">escuro.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Sem dados, você está apenas tentando adivinhar o que pode vender.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {problems.map((problem, i) => (
            <div
              key={problem.title}
              className="glass-card rounded-2xl p-6 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                <problem.icon className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-base font-semibold mb-2">{problem.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:max-w-[1024px]">
        <div className="flex items-center justify-center mt-10">
          <div
            className="glass-card rounded-2xl p-6 animate-slide-up w-full flex flex-col items-center justify-center"
            style={{ animationDelay: `100ms` }}
          >
            {/* <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                <problem.icon className="h-5 w-5 text-destructive" />
              </div> */}
            <h3 className="text-2xl font-semibold mb-2">
              <span className="gradient-text">Resultado</span>
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              👉<span className="pl-3">vídeos sem vendas.</span>
            </p>
          </div>
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

export default ProblemSection
