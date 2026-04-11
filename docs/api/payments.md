# Payments API

See also [[../auth-subscriptions]] for the full subscription flow.

---

## POST /api/create-checkout-session

Creates a Stripe Checkout session and redirects the user to the hosted payment page.

**Auth:** Optional (supports both authenticated and guest users)

### Request

```
POST /api/create-checkout-session
Content-Type: multipart/form-data
```

| Form field | Type | Default | Description |
|---|---|---|---|
| `quantity` | number | `1` | Number of seats |

### Behavior

- Creates a Stripe Checkout session in `subscription` mode using the `PRICE` env var
- If authenticated, stores `clerk_id` in session metadata for webhook linking
- Redirects to `{DOMAIN}/success?session_id=...` on success
- Redirects to `{DOMAIN}/canceled` on cancel

### Response

`303 Redirect` → Stripe Checkout URL

### Errors

| Status | Reason |
|---|---|
| `500` | Failed to create Stripe session |

---

## GET /api/checkout-session

Retrieves a Stripe Checkout session by ID. Used by the `/success` page to confirm the purchase.

**Auth:** Not required

### Request

```
GET /api/checkout-session?sessionId=<stripe_session_id>
```

| Query param | Required | Description |
|---|---|---|
| `sessionId` | Yes | Stripe session ID from success redirect |

### Response

Returns the raw Stripe `Checkout.Session` object.

### Errors

| Status | Reason |
|---|---|
| `400` | Missing `sessionId` |
| `500` | Stripe API error |

---

## GET /api/customer-portal

Redirects an authenticated user to the Stripe Billing Portal to manage their subscription.

**Auth:** Required (Clerk)

### Request

```
GET /api/customer-portal
```

No parameters.

### Behavior

1. Verifies Clerk auth
2. Looks up `stripe_customer_id` via `users.getUserByClerkId` in Convex
3. Creates a Stripe Billing Portal session
4. Redirects to the portal; return URL is the referer (if same domain) or `/subscription`

### Response

`302 Redirect` → Stripe Billing Portal URL

### Errors

| Status | Reason |
|---|---|
| `302 /sign-in` | Not authenticated |
| `404` | No Stripe customer found for user |
| `500` | Stripe API error |

---

## POST /api/webhook

Receives and processes Stripe webhook events. Keeps Convex and Clerk in sync with Stripe subscription state.

**Auth:** Stripe webhook signature (`stripe-signature` header + `STRIPE_WEBHOOK_SECRET`)

### Request

```
POST /api/webhook
stripe-signature: <value>
Content-Type: application/json
```

Raw body is verified before parsing.

### Events Handled

| Event | Action |
|---|---|
| `checkout.session.completed` | Creates/updates user record with subscription info in Convex + Clerk |
| `customer.subscription.created` | Same as above |
| `customer.subscription.updated` | Updates plan, status, end date |
| `customer.subscription.deleted` | Sets status to `'canceled'` |

### Response

```json
{ "received": true }
```

### Errors

| Status | Reason |
|---|---|
| `400` | Webhook signature verification failed |
| `500` | Event processing error |
