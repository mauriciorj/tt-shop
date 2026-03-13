'use client'

import PricingCard from '@/payment/components/pricingCard'
import plansInfos from '@/payment/plansInfos'

const Pricing = () => {
  return (
    <section
      id="price"
      className="w-full relative flex items-center justify-center flex-col py-20 md:py-24 px-4"
    >
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Preço </span>
            Simples e transparente
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano que atende às suas necessidades. Comece grátis e
            suba conforme cresce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-10">
          <PricingCard {...plansInfos.free} isAuthFlow={false} />
          <PricingCard {...plansInfos.pro} isAuthFlow={false} />
        </div>
      </div>
    </section>
  )
}

export default Pricing
