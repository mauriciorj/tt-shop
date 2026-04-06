# Auth & Subscriptions

## Authentication (Clerk)

- **Provider:** `ClerkProviderWrapper` in `src/providers/clerk/index.tsx` wraps the entire app
- **Convex integration:** `ConvexProviderWithClerk` in `src/providers/convex/index.tsx` passes the Clerk JWT to Convex for authenticated queries
- **Post sign-in redirect:** `/stores` (set via `CLERK_SIGN_IN_FORCE_REDIRECT_URL` and `CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`)
- **JWT config:** `convex/auth.config.ts`

### `useUser` hook — `src/features/common/hooks/useUser.ts`

Central hook for auth state and subscription info. Returns:

| Property | Type | Description |
|---|---|---|
| `id` | string | Clerk user ID |
| `isAuthenticated` | boolean | |
| `isLoading` | boolean | True while auth or DB user loads |
| `isFreeUser` | boolean | `subscription_plan === 'free'` |
| `isSubscriptionActive` | boolean | `status === 'active'` OR `plan === 'tester'` |
| `userSubscriptionPlan` | string \| null | e.g. `'Pro'`, `'free'`, `'tester'` |
| `userSubscriptionStatus` | string \| null | `'active'`, `'inactive'`, `'canceled'`, `'past_due'` |
| `FREE_USER_ITEMS_PER_PAGE` | number | `10` — pagination cap for free users |

```ts
import useUser from '@/hooks/useUser'

const { isSubscriptionActive, isFreeUser } = useUser()
```

---

## Subscriptions (Stripe)

### Checkout Flow

```
User clicks "Subscribe"
  → POST /api/create-checkout-session (form data: quantity)
  → Stripe checkout session created (subscription mode)
  → User redirected to Stripe hosted page
  → On success: redirect to /success?session_id=...
  → On cancel: redirect to /canceled
```

**Auth behavior:** Checkout works for both authenticated and guest users.
- Authenticated: `clerk_id` is stored in Stripe session metadata so the webhook can link the subscription to the right user.
- Guest: subscription is linked by email; if the guest later creates an account the records are merged automatically.

### Billing Portal

```
GET /api/customer-portal
  → Requires Clerk auth
  → Looks up stripe_customer_id from Convex
  → Creates Stripe Billing Portal session
  → Redirects user to Stripe portal
  → Return URL: referer page or /subscription
```

### Webhook Flow — `POST /api/webhook`

Stripe sends events → validated via `STRIPE_WEBHOOK_SECRET` → Convex + Clerk updated.

| Event | Handler | Effect |
|---|---|---|
| `checkout.session.completed` | `handleCheckoutSessionCompleted` | Sets subscription status/plan/end-date on `users` table; updates Clerk metadata |
| `customer.subscription.created` | `handleSubscriptionCreated` | Same as above |
| `customer.subscription.updated` | `handleSubscriptionUpdated` | Updates status/plan/end-date; handles plan changes and renewals |
| `customer.subscription.deleted` | `handleSubscriptionDeleted` | Sets status to `'canceled'` in Convex and Clerk |

#### Stripe → internal status mapping

| Stripe status | Internal status |
|---|---|
| `active`, `trialing` | `'active'` |
| `canceled` | `'canceled'` |
| `past_due`, `unpaid` | `'past_due'` |
| anything else | `'inactive'` |

### Subscription Status in Convex

`users.subscription_status` is the source of truth for access control. It is also mirrored in Clerk `publicMetadata.subscriptionStatus` for client-side reads without a Convex roundtrip.

User lookup in `updateUserSubscription` tries in order:
1. `clerk_id`
2. `stripe_customer_id`
3. `email`

### UI Guards

- `PastDueGuard` component (`src/features/common/components/pastDueGuard.tsx`) — gates content when subscription is `past_due`
- `HoverCardUpgradePlan` — shown to free users on locked features
- `FREE_USER_ITEMS_PER_PAGE = 10` — pagination limit enforced in hooks

---

## Environment Variables

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_JWT_ISSUER_DOMAIN
CLERK_WEBHOOK_SECRET
CLERK_SIGN_IN_FORCE_REDIRECT_URL=/stores
CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/stores

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_SECRET
PRICE                               # Subscription price ID
PRICE_FREE                          # Free plan price ID
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL
DOMAIN                              # App base URL for redirects (default: http://localhost:3000)
```
