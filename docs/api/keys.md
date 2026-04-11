# API Keys API

The external API key system lets users call `GET /api/videos` (and future endpoints) from their own apps.

See also: [[../features]] → API Keys feature, [[../database]] → `userApiKeys` table.

---

## Key Format

```
usr_<clerkId>_<64 random hex chars>
```

The `clerkId` is embedded in the token itself, enabling O(1) lookup during validation without an index scan.

## Storage

Keys are never stored in plaintext. The raw key is encrypted with **AES-256-GCM** using `API_KEY_ENCRYPTION_SECRET` (a 64-char hex string = 32 bytes) and the ciphertext, IV, and GCM auth tag are stored separately in the `userApiKeys` table.

## Validation — `verifyApiKey`

`src/features/api-keys/lib/verifyApiKey.ts`

1. Parse `clerkId` from the `usr_<clerkId>_<hex>` token format
2. Fetch the encrypted key record from Convex by `clerk_id`
3. Decrypt with AES-256-GCM and compare against the provided token

Usage in an API route:

```ts
import { verifyApiKey } from '@/api-keys/lib/verifyApiKey'

const clerkId = await verifyApiKey(request)
if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
```

---

## POST /api/generate-key

Generates a new API key for the authenticated user. Replaces any existing key.

**Auth:** Required (Clerk)

### Request

```
POST /api/generate-key
```

No body or parameters.

### Response

```json
{ "key": "usr_<clerkId>_<64hex>" }
```

The key is shown **once**. Store it securely — it cannot be retrieved again.

### Errors

| Status | Reason |
|---|---|
| `401` | Not authenticated |
| `500` | `API_KEY_ENCRYPTION_SECRET` misconfigured or Convex error |

---

## DELETE /api/delete-key

Deletes the authenticated user's API key.

**Auth:** Required (Clerk)

### Request

```
DELETE /api/delete-key
```

No body or parameters.

### Response

```json
{ "status": "deleted" }
```

### Errors

| Status | Reason |
|---|---|
| `401` | Not authenticated |
| `500` | Convex error |

---

## Environment Variables

```bash
API_KEY_ENCRYPTION_SECRET   # 64-char hex string (32 bytes) — used for AES-256-GCM
```
