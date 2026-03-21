# CLAUDE.md — (UseShopRadar)

## Project Overview

**UseShopRadar** is a SaaS platform for analyzing TikTok Shop trends. Users can discover viral products, videos, and shops, track sales data, and get insights for TikTok Shop affiliates.

- **Framework:** Next.js (App Router)
- **Package manager:** pnpm
- **Branches:** `develop` (active development) → `production` (main/release)

---

## Workflow Orchestration

### 1. Plan Mode Default\

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)\
- If something goes sideways, STOP and re-plan immediately\
- Use plan mode for verification steps, not just building\
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy\

- Use subagents liberally to keep main context window clean\
- Offload research, exploration, and parallel analysis to subagents\
- For complex problems, throw more compute at it via subagents\
- One task per subagent for focused execution

### 3. Self-Improvement Loop\

- After ANY correction from the user: update tasks/lessons.md with the pattern\
- Write rules for yourself that prevent the same mistake\
- Ruthlessly iterate on these lessons until mistake rate drops\
- Review lessons at session start for relevant project

### 4. Verification Before Done\

- Never mark a task complete without proving it works\
- Diff behavior between main and your changes when relevant\
- Ask yourself: "Would a staff engineer approve this?"\
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)\

- For non-trivial changes: pause and ask "is there a more elegant way?"\
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"\
- Skip this for simple, obvious fixes -- don't over-engineer\
- Challenge your own work before presenting it\

### 6. Autonomous Bug Fixing\

- When given a bug report: just fix it. Don't ask for hand-holding\
- Point at logs, errors, failing tests -- then resolve them\
- Zero context switching required from the user\
- Go fix failing CI tests without being told how\

## Task Management\

1. Plan First: Write plan to tasks/todo.md with checkable items\
2. Verify Plan: Check in before starting implementation\
3. Track Progress: Mark items complete as you go\
4. Explain Changes: High-level summary at each step\
5. Document Results: Add review section to tasks/todo.md\
6. Capture Lessons: Update tasks/lessons.md after corrections\

## Core Principles\

- Simplicity First: Make every change as simple as possible. Impact minimal code.\
- No Laziness: Find root causes. No temporary fixes. Senior developer standards.\
- Minimal Impact: Only touch what's necessary. No side effects with new bugs.

## Tech Stack

| Layer             | Technology                                       |
| ----------------- | ------------------------------------------------ |
| Framework         | Next.js 16, React 19, TypeScript 5               |
| Backend/DB        | Convex (BaaS — database + serverless functions)  |
| Auth              | Clerk                                            |
| Payments          | Stripe                                           |
| Email             | Resend                                           |
| Webhooks          | Svix                                             |
| State / Caching   | TanStack React Query + `@convex-dev/react-query` |
| Forms             | React Hook Form + Zod                            |
| UI Base           | Radix UI (25+ components)                        |
| Styling           | Tailwind CSS v4, clsx, tailwind-merge, CVA       |
| Icons             | Lucide React                                     |
| Toasts            | Sonner                                           |
| Database (legacy) | PostgreSQL via `pg`                              |

---

## Commands

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm scan         # Dev + React Scan inspector
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm format       # Prettier auto-fix
pnpm format:check # Check formatting
```

---

## Architecture

### Folder Structure

```
src/
  app/              # Next.js App Router pages & API routes
  features/         # Feature-based modules
    common/         # Shared components, hooks, utils, types, DTOs, UI wrappers
    stores/         # TikTok shops feature
    products/       # TikTok products feature
    videos/         # Viral videos feature
    saved/          # User saved items
    product/        # Single product detail
    store/          # Single store detail
    contact/        # Contact form
    db/             # DB utilities
  providers/        # React context providers (Clerk, Convex)
convex/             # Convex schema, queries, mutations, HTTP endpoints
crawler/            # Data crawler for TikTok videos/products
public/             # Static assets
```

### Path Aliases (tsconfig)

```
@/actions/*   → src/app/actions/*
@/components/* → src/features/common/components/*
@/hooks/*     → src/features/common/hooks/*
@/ui/*        → src/features/common/components/ui/*
@/product/*   → src/features/product/*
@/products/*  → src/features/products/*
@/stores/*    → src/features/stores/*
@/videos/*    → src/features/videos/*
@/saved/*     → src/features/saved/*
@/convex/*    → convex/*
```

---

## Database (Convex)

Convex is the **primary database**. All real-time data and mutations go through it.

**Main tables:**

| Table           | Purpose                                       |
| --------------- | --------------------------------------------- |
| `products`      | TikTok shop products with sales metrics       |
| `stores`        | TikTok shops with store details & metrics     |
| `videos`        | Viral TikTok videos with revenue/views data   |
| `categories`    | 3-level category hierarchy                    |
| `creators`      | TikTok creators/influencers                   |
| `users`         | App users — subscription status + Stripe data |
| `savedProducts` | User-saved products (clerk_id + product_k_id) |
| `savedStores`   | User-saved stores (clerk_id + store_k_id)     |
| `savedVideos`   | User-saved videos (clerk_id + video_k_id)     |

**Convex functions** in `/convex/`:

- `schema.ts` — table definitions
- `products.ts`, `stores.ts`, `videos.ts` — queries & mutations per entity
- `users.ts` — user auth + subscription management
- `savedProducts.ts`, `savedStores.ts`, `savedVideos.ts` — save/unsave
- `categories.ts`, `creators.ts` — supporting data
- `http.ts` — HTTP endpoints
- `auth.config.ts` — Clerk JWT auth config

---

## Authentication (Clerk)

- Clerk wraps the app via `ClerkProviderWrapper` in `src/providers/`
- Convex uses `ConvexProviderWithClerk` for authenticated queries
- After sign-in, users are redirected to `/stores`
- Subscription status is stored in Clerk metadata and synced via Convex
- Use `useAuth()` for auth state; `useUser()` (custom hook) for subscription data

---

## Payments (Stripe)

**API routes in `src/app/api/`:**

| Route                          | Purpose                        |
| ------------------------------ | ------------------------------ |
| `/api/create-checkout-session` | Create Stripe checkout session |
| `/api/checkout-session`        | Retrieve session details       |
| `/api/webhook`                 | Handle Stripe events           |
| `/api/customer-portal`         | Redirect to billing portal     |
| `/api/config`                  | Config endpoint                |

**Stripe webhook events handled:**

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Subscription metadata is stored in both Convex (`users` table) and Clerk user metadata.

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

# Convex
NEXT_PUBLIC_CONVEX_URL
CONVEX_DEPLOYMENT

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_SECRET
PRICE                              # Subscription price ID
PRICE_FREE                         # Free plan price ID
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL

# Email
NEXT_PUBLIC_RESEND

# Data source (crawler)
KALODATA_USER
KALODATA_PASSWORD

# General
NEXT_PUBLIC_URL=http://localhost:3000/
```

---

## Code Style & Conventions

**Prettier config (`.prettierrc.json`):**

- Single quotes
- No semicolons
- Trailing commas: ES5
- Tab width: 2
- Print width: 80

**ESLint:**

- Next.js core web vitals + TypeScript
- No `console.log` in production
- Unused imports checked (prefix unused vars with `_`)

**Husky + lint-staged** run on pre-commit.

**React patterns:**

- Server Components by default; `'use client'` only when needed
- Custom hooks for all data fetching and state logic
- Feature-based folder structure — keep code inside its feature directory
- Radix UI + Tailwind for all UI; use `@/ui/*` wrappers, not Radix directly

**Toasts:** Use Sonner for user-facing feedback.

**Loading states:** Use skeleton loaders, not spinners.

**Data fetching:** Always use Convex queries/mutations via React Query integration. Do not add direct API calls unless going through a Next.js API route.

---

## App Routes

| Route                                                           | Notes                                     |
| --------------------------------------------------------------- | ----------------------------------------- |
| `/`                                                             | Landing page                              |
| `/stores`                                                       | Browse TikTok shops (post-login redirect) |
| `/products`                                                     | Browse products                           |
| `/videos`                                                       | Browse viral videos                       |
| `/saved`                                                        | User's saved items (protected)            |
| `/success`, `/canceled`                                         | Post-payment pages                        |
| `/blog`                                                         | Blog (product & store sub-pages)          |
| `/about`, `/contact`                                            | Static pages                              |
| `/politica-de-privacidade`, `/termos-de-servico`, `/disclaimer` | Legal                                     |
| `/producto-em-beta`                                             | Beta feature page                         |

---

## SEO

- Dynamic sitemap at `src/app/sitemap.ts`
- Robots config at `src/app/robots.ts`
- All major pages have `generateMetadata` or static metadata exports
- Deployed on Vercel

---

## Deployment

- **Platform:** Vercel
- **Build command:** `pnpm build`
- Remote images served from Convex — configured in `next.config.ts` with dynamic hostname from `NEXT_PUBLIC_CONVEX_URL`
