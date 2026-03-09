import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/payment/utils/stripe'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event: Stripe.Event

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && signature) {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } else {
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {
    // eslint-disable-next-line no-console
    console.log('Payment received!')
  }

  return NextResponse.json({ received: true })
}
