import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/payment/utils/stripe'
import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    // Auth is optional - allow guest checkout
    const { userId } = await auth()

    const formData = await request.formData()
    const quantity = parseInt(formData.get('quantity') as string) || 1

    const domainURL = process.env.DOMAIN || 'http://localhost:3000'

    // Build session options
    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      line_items: [
        {
          price: process.env.PRICE!,
          quantity: quantity,
        },
      ],
      success_url: `${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/canceled`,
    }

    // If user is authenticated, include clerk_id in metadata
    if (userId) {
      sessionOptions.metadata = { clerk_id: userId }
      sessionOptions.subscription_data = {
        metadata: { clerk_id: userId },
      }
    }

    const session = await stripe().checkout.sessions.create(sessionOptions)

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
