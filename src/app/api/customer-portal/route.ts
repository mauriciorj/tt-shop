import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { stripe } from '@/payment/utils/stripe'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    const user = await convex.query(api.users.getUserByClerkId, {
      clerk_id: userId,
    })

    if (!user?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found for this user' },
        { status: 404 }
      )
    }

    const domainURL = process.env.DOMAIN || 'http://localhost:3000'

    const portalSession = await stripe().billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${domainURL}/subscription`,
    })

    return NextResponse.redirect(portalSession.url)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating customer portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    )
  }
}
