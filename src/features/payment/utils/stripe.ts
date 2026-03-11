import Stripe from 'stripe'

export const stripe = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_SECRET) {
    throw new Error('Key is not defined')
  }
  return new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET, {
    apiVersion: '2025-12-15.clover',
    appInfo: {
      name: 'stripe-samples/checkout-one-time-payments',
      version: '0.0.1',
      url: 'https://github.com/stripe-samples/checkout-one-time-payments',
    },
  })
}
