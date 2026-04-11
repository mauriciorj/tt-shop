# Config & Cache API

---

## GET /api/config

Generic config endpoint. Returns Stripe publishable key for client-side Stripe.js initialization.

**Auth:** Not required

### Request

```
GET /api/config
```

### Response

```json
{
  "publishableKey": "pk_live_..."
}
```

---

## POST /api/clear-sub-cache

Clears the `x-sub-status` cookie that caches subscription status on the client. Call this after a subscription change (e.g., after returning from the Stripe billing portal) to force a fresh status check.

**Auth:** Not required

### Request

```
POST /api/clear-sub-cache
```

No body.

### Response

```json
{ "cleared": true }
```

Sets the `x-sub-status` cookie with `maxAge: 0` (immediate expiry), `httpOnly: true`, `sameSite: strict`, `path: /`.
