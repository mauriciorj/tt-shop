const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 flex flex-col justify-center items-center py-8 px-10 mx-auto max-w-[1400px]">
        <section className="pt-24 pb-10">
          <div className="container">
            <div className="max-w-3xl mx-auto animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Produto em <span className="gradient-text">Beta</span>
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>Última atualização: 15 de março de 2026</p>
                <p>O UseShopRadar encontra-se atualmente em fase Beta.</p>
                <p>
                  Isso significa que o produto ainda está em desenvolvimento e
                  pode apresentar:
                </p>
                <ul className="list-disc ml-4 pl-4">
                  <li>bugs</li>
                  <li>falhas técnicas</li>
                  <li>dados incompletos</li>
                  <li>mudanças frequentes na interface</li>
                  <li>alterações de funcionalidades</li>
                </ul>
                <p>
                  Ao utilizar a plataforma, você reconhece que o serviço pode
                  sofrer atualizações ou modificações sem aviso prévio.
                </p>
                <p>
                  Seu feedback é bem-vindo e pode ajudar a melhorar o produto.
                </p>
              </div>
            </div>
          </div>
        </section>
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
