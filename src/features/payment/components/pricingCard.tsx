'use client'

import Link from 'next/link'
import { Check, X } from 'lucide-react'

const PricingCard = ({
  cta,
  description,
  featuresAvailables,
  featuresNotAvailables,
  isAuthFlow,
  isCurrentPlan,
  isMostPopular,
  isPaid,
  price,
  setShowCancelDialog,
  title,
}: {
  cta: string
  description: string
  featuresAvailables: string[]
  featuresNotAvailables: string[] | null
  isAuthFlow?: boolean
  isCurrentPlan?: boolean
  isMostPopular?: boolean
  isPaid?: boolean
  price: string
  setShowCancelDialog?: (show: boolean) => void
  title: string
}) => {
  return (
    <div
      className={`glass-card rounded-2xl p-8 animate-slide-up ${isMostPopular || (isAuthFlow && !isCurrentPlan && isPaid) ? 'border-primary border-3' : ''} ${isAuthFlow && isCurrentPlan && isPaid ? 'border-primary/50 border-1' : ''}`}
      style={{ animationDelay: '100ms' }}
    >
      {isMostPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
          Mais Popular
        </div>
      )}
      {isAuthFlow && isCurrentPlan && !isPaid && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-secondary text-secondary-foreground text-xl font-medium">
          Plano Atual
        </div>
      )}
      {isAuthFlow && isCurrentPlan && isPaid && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xl font-medium">
          Plano Atual
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="mb-6">
        <span className="text-5xl font-extrabold">{price}</span>
        <span className="text-muted-foreground">/mês</span>
      </div>
      <ul className="space-y-4 mb-8">
        {featuresAvailables.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-3 w-3 text-green-500" />
            </div>
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
        {featuresNotAvailables?.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
              <X className="h-3 w-3 text-primary" />
            </div>
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      {!featuresNotAvailables && <div className="mb-16" />}
      {isMostPopular && (
        <div className="mb-16">
          <span className="italic gradient-text">Sem limites</span>
        </div>
      )}
      {isPaid && (
        <div
          className={`${isAuthFlow ? 'w-[340px] left-[calc(50%-170px)]' : 'w-[180px] left-[calc(50%-90px)]'} absolute bottom-5`}
        >
          {isAuthFlow && isCurrentPlan && (
            <div className="block w-full text-center px-6 py-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/50 cursor-not-allowed font-semibold">
              Seu Plano - A melhor opção!
            </div>
          )}
          {isAuthFlow && !isCurrentPlan && (
            <form action="/api/create-checkout-session" method="POST">
              <input
                type="hidden"
                name="lookup_key"
                value="{{PRICE_LOOKUP_KEY}}"
              />
              <button
                className="block w-full text-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all glow-effect cursor-pointer"
                type="submit"
              >
                Destrave todas as funcionalidades!
              </button>
            </form>
          )}
          {!isAuthFlow && (
            <form action="/api/create-checkout-session" method="POST">
              <input
                type="hidden"
                name="lookup_key"
                value="{{PRICE_LOOKUP_KEY}}"
              />
              <button
                className="block w-full text-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all glow-effect"
                type="submit"
              >
                {cta}
              </button>
            </form>
          )}
        </div>
      )}
      {!isPaid && (
        <div
          className={`${isAuthFlow && !isCurrentPlan ? 'w-[340px] left-[calc(50%-170px)]' : 'w-[180px] left-[calc(50%-90px)]'} absolute bottom-5`}
        >
          {isAuthFlow && isCurrentPlan && (
            <div className="block w-full text-center px-6 py-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/50 cursor-not-allowed font-semibold">
              Seu Plano
            </div>
          )}
          {isAuthFlow && !isCurrentPlan && (
            <div
              onClick={() => setShowCancelDialog && setShowCancelDialog(true)}
              className="block w-full text-center px-6 py-3 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/50 font-semibold cursor-pointer"
            >
              Perder todas as funcionalidades :(
            </div>
          )}
          {!isAuthFlow && (
            <Link
              href="/stores"
              className={`block w-full text-center px-6 py-3 rounded-xl ${isMostPopular ? 'bg-primary text-primary-foreground hover:opacity-80' : 'bg-secondary text-secondary-foreground hover:bg-secondary/50'} font-semibold transition-colors`}
            >
              {cta}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default PricingCard
