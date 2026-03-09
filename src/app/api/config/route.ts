import { NextResponse } from 'next/server'
import { stripe } from '@/payment/utils/stripe'

export async function GET() {
  try {
    const price = await stripe.prices.retrieve(process.env.PRICE!)

    return NextResponse.json({
      publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      unitAmount: price.unit_amount,
      currency: price.currency,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    )
  }
}
