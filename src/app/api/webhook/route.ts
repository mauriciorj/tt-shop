import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/payment/utils/stripe'
import { clerkClient } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import Stripe from 'stripe'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

type SubscriptionStatus = 'active' | 'inactive' | 'canceled' | 'past_due'

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'active'
    case 'canceled':
      return 'canceled'
    case 'past_due':
    case 'unpaid':
      return 'past_due'
    default:
      return 'inactive'
  }
}

async function updateClerkMetadata(clerkId: string, subscriptionStatus: SubscriptionStatus) {
  try {
    const client = await clerkClient()
    await client.users.updateUserMetadata(clerkId, {
      publicMetadata: {
        subscriptionStatus,
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to update Clerk metadata:', error)
  }
}

async function getCustomerEmail(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId)
    if (customer.deleted) return null
    return customer.email || null
  } catch {
    return null
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const clerkId = session.metadata?.clerk_id
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription
  const status = mapStripeStatus(subscription.status)
  const plan = subscription.items.data[0]?.price?.nickname || 'Pro'
  const currentPeriodEnd = (subscription as { current_period_end?: number }).current_period_end
  const endDate = currentPeriodEnd
    ? new Date(currentPeriodEnd * 1000).toISOString()
    : undefined

  if (clerkId) {
    // Authenticated user - update existing client
    await convex.mutation(api.clients.updateClientSubscription, {
      clerk_id: clerkId,
      stripe_customer_id: customerId,
      subscription_status: status,
      subscription_plan: plan,
      subscription_end_date: endDate,
    })

    // Update Clerk metadata
    await updateClerkMetadata(clerkId, status)
  } else {
    // Guest checkout - create/update client by email
    const email = session.customer_email || (await getCustomerEmail(customerId))

    if (!email) {
      // eslint-disable-next-line no-console
      console.error('No email found for guest checkout')
      return
    }

    await convex.mutation(api.clients.upsertClientFromStripe, {
      email,
      stripe_customer_id: customerId,
      subscription_status: status,
      subscription_plan: plan,
      subscription_end_date: endDate,
    })
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const clerkId = subscription.metadata?.clerk_id
  const customerId = subscription.customer as string
  const status = mapStripeStatus(subscription.status)
  const plan = subscription.items.data[0]?.price?.nickname || 'Pro'
  const currentPeriodEnd = (subscription as { current_period_end?: number }).current_period_end
  const endDate = currentPeriodEnd
    ? new Date(currentPeriodEnd * 1000).toISOString()
    : undefined

  if (clerkId) {
    // Authenticated user
    await convex.mutation(api.clients.updateClientSubscription, {
      clerk_id: clerkId,
      stripe_customer_id: customerId,
      subscription_status: status,
      subscription_plan: plan,
      subscription_end_date: endDate,
    })

    await updateClerkMetadata(clerkId, status)
  } else {
    // Guest - need to get email from customer
    const email = await getCustomerEmail(customerId)

    if (!email) {
      // eslint-disable-next-line no-console
      console.error('No email found for subscription created event')
      return
    }

    await convex.mutation(api.clients.upsertClientFromStripe, {
      email,
      stripe_customer_id: customerId,
      subscription_status: status,
      subscription_plan: plan,
      subscription_end_date: endDate,
    })
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const clerkId = subscription.metadata?.clerk_id
  const customerId = subscription.customer as string
  const status = mapStripeStatus(subscription.status)
  const plan = subscription.items.data[0]?.price?.nickname || 'Pro'
  const currentPeriodEnd = (subscription as { current_period_end?: number }).current_period_end
  const endDate = currentPeriodEnd
    ? new Date(currentPeriodEnd * 1000).toISOString()
    : undefined

  // Get email for lookup if no clerk_id
  const email = !clerkId ? await getCustomerEmail(customerId) : undefined

  // Update Convex (will find by clerk_id, stripe_customer_id, or email)
  await convex.mutation(api.clients.updateClientSubscription, {
    clerk_id: clerkId || undefined,
    email: email || undefined,
    stripe_customer_id: customerId,
    subscription_status: status,
    subscription_plan: plan,
    subscription_end_date: endDate,
  })

  // Update Clerk if we have the clerk_id
  if (clerkId) {
    await updateClerkMetadata(clerkId, status)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const clerkId = subscription.metadata?.clerk_id
  const customerId = subscription.customer as string

  // Get email for lookup if no clerk_id
  const email = !clerkId ? await getCustomerEmail(customerId) : undefined

  // Update Convex
  await convex.mutation(api.clients.updateClientSubscription, {
    clerk_id: clerkId || undefined,
    email: email || undefined,
    stripe_customer_id: customerId,
    subscription_status: 'canceled',
  })

  // Update Clerk if we have the clerk_id
  if (clerkId) {
    await updateClerkMetadata(clerkId, 'canceled')
  }
}

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

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      }
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCreated(subscription)
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }
      default:
        // eslint-disable-next-line no-console
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
