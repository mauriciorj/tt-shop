# Architecture

## Overview

UseShopRadar is a Next.js 16 (App Router) SaaS. The stack is intentionally simple:

- **Convex** is the only database and serverless runtime. All real-time reads/writes go through it.
- **Clerk** handles auth. After sign-in users land on `/stores`.
- **Stripe** handles subscriptions. Webhooks keep Convex + Clerk in sync.
- **Crawler** (Python) scrapes TikTok data via the Kalodata API and writes directly into Convex.

## Request Lifecycle

```
Browser
  │
  ├─ React Server Components → Convex queries (server-side)
  │
  ├─ Client components → TanStack React Query + convex-dev/react-query hooks
  │                       → Convex real-time subscriptions / mutations
  │
  └─ Next.js API Routes → Stripe / Clerk / Convex (server-side only)
```

## Folder Structure

```
tt-shop/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API route handlers (9 routes)
│   │   ├── actions/          # Server actions (contact, product, store)
│   │   ├── (subscription)/   # Route group: subscription, success, canceled, waitlist
│   │   ├── (empresa)/        # Route group: sobre, contato
│   │   ├── (legal)/          # Route group: legal pages
│   │   ├── (recursos)/       # Route group: blog
│   │   ├── product/[...id]/  # Dynamic product detail
│   │   ├── store/[...id]/    # Dynamic store detail
│   │   ├── stores/           # Browse stores (post-login redirect)
│   │   ├── products/         # Browse products
│   │   ├── videos/           # Browse viral videos
│   │   ├── saved/            # Saved items (protected)
│   │   └── apiKey/           # API key management
│   │
│   ├── features/             # Feature-based modules
│   │   ├── common/           # Shared components, hooks, utils, DTOs, UI wrappers
│   │   ├── stores/           # TikTok shops feature
│   │   ├── products/         # TikTok products feature
│   │   ├── videos/           # Viral videos feature
│   │   ├── saved/            # User saved items
│   │   ├── api-keys/         # API key management
│   │   ├── payment/          # Stripe integration
│   │   ├── contact/          # Contact form
│   │   ├── blog/             # Blog content
│   │   ├── categories/       # Product categories
│   │   ├── db/               # DB utilities
│   │   └── database/         # Legacy PostgreSQL config (unused in prod)
│   │
│   └── providers/            # ClerkProviderWrapper, ConvexProviderWithClerk
│
├── convex/                   # Convex backend (schema, queries, mutations, HTTP)
├── crawler/                  # Python data crawler
│   ├── kalodata/             # TikTok data scraper
│   └── transcriber/          # OpenAI Whisper transcription
├── docs/                     # This vault
└── tasks/                    # Task tracking (todo.md, lessons.md)
```

## Path Aliases (tsconfig)

| Alias | Resolves to |
|---|---|
| `@/actions/*` | `src/app/actions/*` |
| `@/components/*` | `src/features/common/components/*` |
| `@/hooks/*` | `src/features/common/hooks/*` |
| `@/ui/*` | `src/features/common/components/ui/*` |
| `@/products/*` | `src/features/products/*` |
| `@/stores/*` | `src/features/stores/*` |
| `@/videos/*` | `src/features/videos/*` |
| `@/saved/*` | `src/features/saved/*` |
| `@/convex/*` | `convex/*` |
| `@/payment/*` | `src/features/payment/*` |
| `@/db/*` | `src/features/db/*` |
| `@/blog/*` | `src/features/blog/*` |

## App Routes

| Route | Notes |
|---|---|
| `/` | Landing page |
| `/stores` | Browse TikTok shops (default post-login redirect) |
| `/products` | Browse products |
| `/videos` | Browse viral videos |
| `/product/[...id]` | Product detail page |
| `/store/[...id]` | Store detail page |
| `/saved` | User's saved items (protected) |
| `/apiKey` | API key management |
| `/subscription` | Subscription management |
| `/success`, `/canceled` | Post-payment pages |
| `/waitlist`, `/tester` | Pre-launch flows |
| `/blog` | Blog listing + sub-pages |
| `/sobre`, `/contato` | Company pages |
| `/politica-de-privacidade`, `/termos-de-servico`, `/disclaimer` | Legal |
| `/produto-em-beta` | Beta notice |

## Security Headers

Configured in `next.config.ts`:

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy` — allowlist includes Stripe, Clerk, Convex domains

## Remote Images

Next.js image optimization is allowed for:
- Convex cloud storage (dynamic hostname from `NEXT_PUBLIC_CONVEX_URL`)
- TikTok CDN
- Unsplash

## Testing Conventions

- Test files live in a `tests/` subfolder relative to the file under test
- Example: `src/features/videos/components/tests/videoCard.test.tsx`
- Never place test files alongside source files
- Run with `pnpm test`
