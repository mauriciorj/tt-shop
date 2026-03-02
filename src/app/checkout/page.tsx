'use client'

import { useEffect, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { startCheckoutSession } from '@/src/app/actions/stripe'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function ProductsPage({ productId }: { productId: string }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const secret = await startCheckoutSession('basic-plan')
        setClientSecret(secret)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[v0] Checkout error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load checkout')
      }
    }

    fetchClientSecret()
  }, [productId])

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading checkout...</p>
      </div>
    )
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
