'use client'

import React, { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

const ProductDisplay = () => {
  return (
    <section
      id="price"
      className="py-24 border-t border-border/40 flex justify-center"
    >
      <div className="container">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Comece o seu plano Pro
            <span className="gradient-text"> agora !</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra os vídeos e produtos que realemnte vão colocar dinheiro no
            seu bolso.
          </p>
        </div>
        <div className="max-w-lg mx-auto">
          <div className="product">
            <div
              className="glass-card rounded-2xl p-8 relative border-primary/50 animate-slide-up"
              style={{ animationDelay: '200ms' }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                Mais Popular
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-muted-foreground">Tudo que você precisa</p>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-extrabold">$47</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-4 mb-5">
                {[
                  'Top lojas',
                  'Top produtos',
                  'Top vídeos',
                  'Transcrição de vídeos',
                  'Filtros avançados',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-16">
                <span className="italic gradient-text">Sem limites</span>
              </div>
              <div className="w-[180px] absolute bottom-5 left-[calc(50%-90px)]">
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
                    Pagar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const SuccessDisplay = ({ sessionId }: { sessionId: string }) => {
  return (
    <section>
      <div className="product Box-root">
        <Logo />
        <div className="description Box-root">
          <h3>Subscription to Starter Plan successful!</h3>
        </div>
      </div>
      <form action="/create-portal-session" method="POST">
        <input
          type="hidden"
          id="session-id"
          name="session_id"
          value={sessionId}
        />
        <button id="checkout-and-portal-button" type="submit">
          Manage your billing information
        </button>
      </form>
    </section>
  )
}

const Message = ({ message }: { message: string }) => (
  <section>
    <p>{message}</p>
  </section>
)

export default function App() {
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)

    if (query.get('success')) {
      // eslint-disable-next-line
      setSuccess(true)
      setSessionId(query.get('session_id'))
    }

    if (query.get('canceled')) {
      setSuccess(false)
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      )
    }
  }, [sessionId])

  if (!success && message === '') {
    return <ProductDisplay />
  } else if (success && sessionId) {
    return <SuccessDisplay sessionId={sessionId} />
  } else {
    return <Message message={message} />
  }
}

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="14px"
    height="16px"
    viewBox="0 0 14 16"
    version="1.1"
  >
    <defs />
    <g id="Flow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        id="0-Default"
        transform="translate(-121.000000, -40.000000)"
        fill="#E184DF"
      >
        <path
          d="M127,50 L126,50 C123.238576,50 121,47.7614237 121,45 C121,42.2385763 123.238576,40 126,40 L135,40 L135,56 L133,56 L133,42 L129,42 L129,56 L127,56 L127,50 Z M127,48 L127,42 L126,42 C124.343146,42 123,43.3431458 123,45 C123,46.6568542 124.343146,48 126,48 L127,48 Z"
          id="Pilcrow"
        />
      </g>
    </g>
  </svg>
)
