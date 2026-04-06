# UseShopRadar — Docs

Open this folder as a vault in Obsidian for best navigation experience.

## Quick Links

- [[architecture]] — System overview, folder structure, data flow
- [[database]] — Convex schema reference (all 13 tables)
- [[auth-subscriptions]] — Auth (Clerk) + subscription (Stripe) flow
- [[features]] — Feature module guide (stores, products, videos, saved, API keys)
- [[crawler]] — Data crawler & transcriber setup and architecture

## API Reference

| Endpoint | Doc |
|----------|-----|
| `GET /api/videos` | [[api/videos]] |
| `GET /api/products` | [[api/products]] |
| `POST /api/create-checkout-session` | [[api/payments]] |
| `GET /api/checkout-session` | [[api/payments]] |
| `POST /api/webhook` | [[api/payments]] |
| `GET /api/customer-portal` | [[api/payments]] |
| `POST /api/generate-key` | [[api/keys]] |
| `DELETE /api/delete-key` | [[api/keys]] |
| `GET /api/config` | [[api/config]] |
| `POST /api/clear-sub-cache` | [[api/config]] |

## Tech Stack at a Glance

| Layer | Technology |
|---|---|
| Framework | Next.js 16, React 19, TypeScript 5 |
| Backend / DB | Convex (BaaS) |
| Auth | Clerk |
| Payments | Stripe |
| Email | Resend |
| UI | Radix UI + Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| State | TanStack React Query + `@convex-dev/react-query` |
| Toasts | Sonner |

## Key Commands

```bash
pnpm dev        # dev server (localhost:3000)
pnpm build      # production build
pnpm test       # Jest test suite
pnpm lint       # ESLint
pnpm format     # Prettier
```
