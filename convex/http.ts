import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { internal } from './_generated/api'
import { Webhook } from 'svix'

const http = httpRouter()

http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

    if (!webhookSecret) {
      // eslint-disable-next-line no-console
      console.error('Missing CLERK_WEBHOOK_SECRET environment variable')
      return new Response('Server configuration error', { status: 500 })
    }

    const svixId = request.headers.get('svix-id')
    const svixTimestamp = request.headers.get('svix-timestamp')
    const svixSignature = request.headers.get('svix-signature')

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response('Missing svix headers', { status: 400 })
    }

    const body = await request.text()

    const wh = new Webhook(webhookSecret)
    let evt: WebhookEvent

    try {
      evt = wh.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Webhook verification failed:', err)
      return new Response('Invalid signature', { status: 400 })
    }

    const eventType = evt.type

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data

      const primaryEmail = email_addresses?.find(
        (email) => email.id === evt.data.primary_email_address_id
      )

      const result = await ctx.runMutation(internal.clients.upsertClient, {
        clerk_id: id,
        email: primaryEmail?.email_address ?? '',
        first_name: first_name ?? undefined,
        last_name: last_name ?? undefined,
        image_url: image_url ?? undefined,
      })

      // If we linked a Stripe customer to a new Clerk account, sync subscription status to Clerk
      if (result.status === 'linked' && result.subscription_status) {
        const clerkSecretKey = process.env.CLERK_SECRET_KEY
        if (clerkSecretKey) {
          try {
            await fetch(`https://api.clerk.com/v1/users/${id}/metadata`, {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${clerkSecretKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                public_metadata: {
                  subscriptionStatus: result.subscription_status,
                },
              }),
            })
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to sync subscription status to Clerk:', err)
          }
        }
      }
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data

      if (id) {
        await ctx.runMutation(internal.clients.deleteClient, {
          clerk_id: id,
        })
      }
    }

    return new Response('Webhook processed', { status: 200 })
  }),
})

type WebhookEvent = {
  type: 'user.created' | 'user.updated' | 'user.deleted'
  data: {
    id: string
    email_addresses?: Array<{
      id: string
      email_address: string
    }>
    primary_email_address_id?: string
    first_name?: string | null
    last_name?: string | null
    image_url?: string | null
  }
}

export default http
