const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 flex flex-col justify-center items-center py-8 px-10 mx-auto max-w-[1400px]">
        <section className="pt-24 pb-10">
          <div className="container">
            <div className="max-w-3xl mx-auto animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Disclaimer sobre{' '}
                <span className="gradient-text">Dados e Informações</span>
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  O UseShopRadar coleta e analisa informações provenientes de
                  diversas fontes públicas disponíveis na internet.
                </p>
                <p>
                  Os dados apresentados na plataforma são utilizados apenas para
                  fins informativos e analíticos.
                </p>
                <p>O UseShopRadar:</p>
                <ul className="list-disc ml-4 pl-4">
                  <li>não é afiliado</li>
                  <li>não é endossado</li>
                  <li>
                    não é operado por nenhuma plataforma de terceiros mencionada
                    no site.
                  </li>
                </ul>
                <p>
                  Todas as marcas e plataformas citadas pertencem aos seus
                  respectivos proprietários.
                </p>
                <p>
                  As informações exibidas podem ser estimativas e não
                  representam necessariamente valores oficiais.
                </p>
                <p>
                  O UseShopRadar não garante precisão absoluta dos dados
                  apresentados.
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

export default Disclaimer
