import { createCipheriv, randomBytes } from 'crypto'
import { NextRequest } from 'next/server'

// ── Convex mock ───────────────────────────────────────────────────────────────
// verifyApiKey.ts creates `const convex = new ConvexHttpClient(url)` at module
// scope. With SWC's jest transform, mock-prefixed variables cannot be referenced
// inside jest.mock factories (no babel hoisting). Instead we store the query
// mock on globalThis inside the factory, where it is accessible from tests.

jest.mock('convex/browser', () => {
  const mockQuery = jest.fn()
  ;(globalThis as any).__mockConvexQuery = mockQuery
  return {
    ConvexHttpClient: jest.fn().mockImplementation(() => ({ query: mockQuery })),
  }
})

jest.mock('@/convex/_generated/api', () => ({
  api: { userApiKeys: { getApiKey: 'userApiKeys:getApiKey' } },
}))

import { verifyApiKey } from '../verifyApiKey'

const getQueryMock = (): jest.Mock => (globalThis as any).__mockConvexQuery

// ── Constants ─────────────────────────────────────────────────────────────────

// 64 hex chars = 32 bytes — valid AES-256 key
const TEST_SECRET_HEX =
  'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'
const TEST_CLERK_ID = 'user_clerk_test123'
// 64 lowercase hex chars — valid random suffix
const TEST_SUFFIX = 'deadbeef'.repeat(8)
const VALID_TOKEN = `usr_${TEST_CLERK_ID}_${TEST_SUFFIX}`

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Encrypt `plaintext` with AES-256-GCM using the given hex secret. */
function encryptToken(plaintext: string, secretHex: string) {
  const secret = Buffer.from(secretHex, 'hex')
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', secret, iv)
  let content = cipher.update(plaintext, 'utf8', 'base64')
  content += cipher.final('base64')
  const tag = cipher.getAuthTag()
  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    content,
  }
}

/** Build a minimal NextRequest-shaped object with the given Authorization value. */
function makeRequest(authorization?: string): NextRequest {
  return {
    headers: {
      get: (key: string) =>
        key === 'authorization' ? (authorization ?? null) : null,
    },
  } as unknown as NextRequest
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  getQueryMock().mockReset()
  process.env.API_KEY_ENCRYPTION_SECRET = TEST_SECRET_HEX
})

afterEach(() => {
  delete process.env.API_KEY_ENCRYPTION_SECRET
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('verifyApiKey', () => {
  describe('Authorization header validation', () => {
    it('returns null when Authorization header is missing', async () => {
      expect(await verifyApiKey(makeRequest())).toBeNull()
    })

    it('returns null when Authorization does not start with "Bearer "', async () => {
      expect(await verifyApiKey(makeRequest('Basic abc123'))).toBeNull()
    })

    it('returns null when Authorization is just "Bearer " with no token', async () => {
      // token = '' → doesn't start with 'usr_'
      expect(await verifyApiKey(makeRequest('Bearer '))).toBeNull()
    })
  })

  describe('token format validation', () => {
    it('returns null when token does not start with "usr_"', async () => {
      expect(
        await verifyApiKey(makeRequest('Bearer invalid_token_here'))
      ).toBeNull()
    })

    it('returns null when the rest segment is shorter than 66 chars', async () => {
      // 'usr_' + 65 chars: 1 clerkId char + '_' + 63 hex → suffix too short
      const shortToken = `usr_${'a'.repeat(65)}`
      expect(
        await verifyApiKey(makeRequest(`Bearer ${shortToken}`))
      ).toBeNull()
    })

    it('returns null when the 64-char suffix contains non-hex characters', async () => {
      const badSuffix = 'z'.repeat(64) // 'z' is not valid hex
      const token = `usr_${TEST_CLERK_ID}_${badSuffix}`
      expect(await verifyApiKey(makeRequest(`Bearer ${token}`))).toBeNull()
    })

    it('returns null when the clerkId segment is empty', async () => {
      // rest = '_' + 64 hex → clerkId extracted = '' (length 0)
      const token = `usr__${'deadbeef'.repeat(8)}`
      expect(await verifyApiKey(makeRequest(`Bearer ${token}`))).toBeNull()
    })
  })

  describe('encryption secret validation', () => {
    it('returns null when API_KEY_ENCRYPTION_SECRET is not set', async () => {
      delete process.env.API_KEY_ENCRYPTION_SECRET
      expect(
        await verifyApiKey(makeRequest(`Bearer ${VALID_TOKEN}`))
      ).toBeNull()
    })

    it('returns null when API_KEY_ENCRYPTION_SECRET is the wrong length', async () => {
      process.env.API_KEY_ENCRYPTION_SECRET = 'tooshort'
      expect(
        await verifyApiKey(makeRequest(`Bearer ${VALID_TOKEN}`))
      ).toBeNull()
    })
  })

  describe('Convex record lookup', () => {
    it('returns null when no record is found for the clerk_id', async () => {
      getQueryMock().mockResolvedValue(null)
      expect(
        await verifyApiKey(makeRequest(`Bearer ${VALID_TOKEN}`))
      ).toBeNull()
    })

    it('queries Convex with the clerk_id extracted from the token', async () => {
      getQueryMock().mockResolvedValue(null)
      await verifyApiKey(makeRequest(`Bearer ${VALID_TOKEN}`))
      expect(getQueryMock()).toHaveBeenCalledWith('userApiKeys:getApiKey', {
        clerk_id: TEST_CLERK_ID,
      })
    })
  })

  describe('decryption and comparison', () => {
    it('returns the clerk_id when the token matches the decrypted record', async () => {
      const encryptedKey = encryptToken(VALID_TOKEN, TEST_SECRET_HEX)
      getQueryMock().mockResolvedValue({ api_key: encryptedKey })

      const result = await verifyApiKey(makeRequest(`Bearer ${VALID_TOKEN}`))
      expect(result).toBe(TEST_CLERK_ID)
    })

    it('returns null when the decrypted value does not match the token', async () => {
      // Encrypt a *different* plaintext — decryption succeeds but comparison fails
      const encryptedKey = encryptToken('usr_different_token', TEST_SECRET_HEX)
      getQueryMock().mockResolvedValue({ api_key: encryptedKey })

      expect(
        await verifyApiKey(makeRequest(`Bearer ${VALID_TOKEN}`))
      ).toBeNull()
    })

    it('returns null when decryption fails due to a corrupted auth tag', async () => {
      const encryptedKey = encryptToken(VALID_TOKEN, TEST_SECRET_HEX)
      // Corrupt the tag so GCM auth verification throws
      encryptedKey.tag = Buffer.alloc(16).toString('base64')
      getQueryMock().mockResolvedValue({ api_key: encryptedKey })

      expect(
        await verifyApiKey(makeRequest(`Bearer ${VALID_TOKEN}`))
      ).toBeNull()
    })

    it('returns null when decryption fails due to corrupted ciphertext', async () => {
      const encryptedKey = encryptToken(VALID_TOKEN, TEST_SECRET_HEX)
      encryptedKey.content = 'bm90YmFzZTY0YXRhbGw=' // valid base64, wrong data
      getQueryMock().mockResolvedValue({ api_key: encryptedKey })

      expect(
        await verifyApiKey(makeRequest(`Bearer ${VALID_TOKEN}`))
      ).toBeNull()
    })
  })
})
