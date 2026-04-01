import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createCipheriv, randomBytes } from 'crypto'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const secretHex = process.env.API_KEY_ENCRYPTION_SECRET
    if (!secretHex || secretHex.length !== 64) {
      // eslint-disable-next-line no-console
      console.error('API_KEY_ENCRYPTION_SECRET must be a 64-char hex string (32 bytes)')
      return NextResponse.json(
        { error: 'Server misconfiguration' },
        { status: 500 }
      )
    }

    const rawKey = `usr_${randomBytes(32).toString('hex')}`
    const secret = Buffer.from(secretHex, 'hex')
    const iv = randomBytes(12)
    const cipher = createCipheriv('aes-256-gcm', secret, iv)
    let content = cipher.update(rawKey, 'utf8', 'base64')
    content += cipher.final('base64')
    const tag = cipher.getAuthTag().toString('base64')

    await convex.mutation(api.userApiKeys.createApiKey, {
      clerk_id: userId,
      api_key: {
        content,
        iv: iv.toString('base64'),
        tag,
      },
    })

    return NextResponse.json({ key: rawKey })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating API key:', error)
    return NextResponse.json(
      { error: 'Failed to generate API key' },
      { status: 500 }
    )
  }
}
