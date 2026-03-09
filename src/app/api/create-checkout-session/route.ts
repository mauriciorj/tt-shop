import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/payment/utils/stripe'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const quantity = parseInt(formData.get('quantity') as string) || 1

    const domainURL = process.env.DOMAIN || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // payment / subscription
      line_items: [
        {
          price: process.env.PRICE_FREE!,
          quantity: quantity,
        },
      ],
      success_url: `${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/canceled`,
    })

    return NextResponse.redirect(session.url!, 303)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
