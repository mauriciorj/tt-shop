import { Target, TrendingUp, Users, Zap } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 flex flex-col justify-center items-center py-8 px-10 mx-auto max-w-[1400px]">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Sobre o <span className="gradient-text">ShopRadar</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Somos a plataforma líder de inteligência de mercado para
                afiliados do TikTok Shop. Nossa missão é democratizar o acesso
                aos dados e ajudar criadores a encontrar as melhores
                oportunidades.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 border-y border-border/40 bg-card/50">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Nossa <span className="gradient-text">Missão</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Acreditamos que todos os criadores de conteúdo merecem acesso
                  às mesmas ferramentas e dados que os grandes players do
                  mercado. Por isso, desenvolvemos o ShopRadar.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Nossa tecnologia analisa milhões de dados em tempo real para
                  revelar quais produtos estão vendendo mais, quais nichos estão
                  em alta e onde estão as maiores oportunidades de comissão.
                  Tudo isso em uma interface simples e intuitiva.
                </p>
              </div>
              <div
                className="grid grid-cols-2 gap-4 animate-slide-up"
                style={{ animationDelay: '200ms' }}
              >
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Dados em Tempo Real</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitoramento 24/7 de tendências e vendas
                  </p>
                </div>
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-4">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Precisão</h3>
                  <p className="text-sm text-muted-foreground">
                    Algoritmos avançados de análise
                  </p>
                </div>
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Comunidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Milhares de afiliados confiando em nós
                  </p>
                </div>
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-4">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Velocidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Fique à frente das tendências
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Como <span className="gradient-text">Começamos</span>
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  O ShopRadar nasceu da frustração de dois criadores de conteúdo
                  que passavam horas tentando descobrir quais produtos promover
                  no TikTok Shop. Testávamos dezenas de produtos diferentes,
                  muitas vezes sem sucesso, desperdiçando tempo e dinheiro.
                </p>
                <p>
                  Foi então que percebemos: se tivéssemos acesso aos dados
                  certos, poderíamos tomar decisões muito melhores sobre quais
                  produtos promover. Mas essas ferramentas não existiam ou eram
                  extremamente caras.
                </p>
                <p>
                  Decidimos criar a ferramenta que gostaríamos de ter tido desde
                  o início. Hoje, o ShopRadar ajuda milhares de afiliados a
                  encontrar produtos vencedores, economizar tempo e multiplicar
                  suas comissões no TikTok Shop.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-card/50 border-y border-border/40">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Nossos <span className="gradient-text">Valores</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Transparência',
                  description:
                    'Dados claros e honestos. Sem promessas vazias ou números inflados. Você vê exatamente o que está acontecendo no mercado.',
                },
                {
                  title: 'Acessibilidade',
                  description:
                    'Ferramentas poderosas devem estar ao alcance de todos. Por isso mantemos preços justos e uma versão gratuita funcional.',
                },
                {
                  title: 'Inovação',
                  description:
                    'Sempre buscando novas formas de entregar insights valiosos. Ouvimos nossa comunidade e evoluímos constantemente.',
                },
              ].map((value, index) => (
                <div
                  key={value.title}
                  className="glass-card p-8 rounded-xl text-center animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container">
            <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
              <div className="relative">
                <h2 className="text-4xl font-bold mb-4">Junte-se a Nós</h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Faça parte da comunidade de afiliados que está revolucionando
                  o TikTok Shop
                </p>
                <a
                  href="/stores"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all glow-effect"
                >
                  Começar Agora
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default About
