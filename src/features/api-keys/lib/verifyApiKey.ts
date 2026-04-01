import { createDecipheriv } from 'crypto'
import { NextRequest } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

/**
 * Validates the Bearer token from the Authorization header.
 *
 * Flow:
 *  1. Parse the clerk_id embedded in the token (format: usr_<clerkId>_<64hex>)
 *  2. Fetch the user's encrypted key record from Convex by clerk_id
 *  3. Decrypt content using AES-256-GCM and compare with the provided token
 *
 * Returns the clerk_id when valid, or null when invalid / missing.
 *
 * Usage:
 *   const clerkId = await verifyApiKey(request)
 *   if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 */
export async function verifyApiKey(
  request: NextRequest
): Promise<string | null> {
  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return null

  const token = authorization.slice(7).trim()

  // Format: usr_<clerkId>_<64 hex chars>
  // The random suffix is always exactly 64 chars (32 bytes hex-encoded).
  const prefix = 'usr_'
  if (!token.startsWith(prefix)) return null

  const rest = token.slice(prefix.length) // "<clerkId>_<64hex>"
  if (rest.length < 66) return null // minimum: 1-char clerkId + "_" + 64 hex

  const randomSuffix = rest.slice(-64)
  const clerkId = rest.slice(0, rest.length - 65) // strip "_<64hex>"

  if (!clerkId || !/^[0-9a-f]{64}$/.test(randomSuffix)) return null

  const secretHex = process.env.API_KEY_ENCRYPTION_SECRET
  if (!secretHex || secretHex.length !== 64) return null

  const record = await convex.query(api.userApiKeys.getApiKey, { clerk_id: clerkId })
  if (!record) return null

  try {
    const secret = Buffer.from(secretHex, 'hex')
    const iv = Buffer.from(record.api_key.iv, 'base64')
    const tag = Buffer.from(record.api_key.tag, 'base64')
    const decipher = createDecipheriv('aes-256-gcm', secret, iv)
    decipher.setAuthTag(tag)
    let decrypted = decipher.update(record.api_key.content, 'base64', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted === token ? clerkId : null
  } catch {
    // Decryption failure means the token is invalid or the secret changed
    return null
  }
}
