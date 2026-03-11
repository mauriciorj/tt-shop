import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/payment/utils/stripe'

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    )
  }

  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId)
    return NextResponse.json(session)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error retrieving checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}
