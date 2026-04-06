# Feature Modules

All features live under `src/features/`. Each module contains components, hooks, DTOs, types, and tests in a self-contained folder.

---

## Common

**Path:** `src/features/common/`

Shared infrastructure used by all features.

### Components

| Component | Description |
|---|---|
| `header.tsx` | App header with navigation |
| `footer.tsx` | App footer |
| `breadcrumb.tsx` | Breadcrumb navigation |
| `navLink.tsx` | Active-aware nav link |
| `productsTable.tsx` | Shared products data table |
| `videosTable.tsx` | Shared videos data table |
| `creatorsTable.tsx` | Shared creators data table |
| `periodFilter.tsx` | Time period selector (7d, 14d, all) |
| `categories.tsx` | Category filter UI |
| `categoriesSkeleton.tsx` | Loading skeleton for categories |
| `revenueSparkline.tsx` | Mini revenue trend sparkline |
| `search.tsx` | Search input |
| `tablePagination.tsx` | Pagination controls |
| `hoverCardUpgradePlan.tsx` | Upgrade prompt for free users |
| `pastDueGuard.tsx` | Content gate for past-due subscriptions |
| `homepage/` | 13 landing page section components |

### UI Component Library

**Path:** `src/features/common/components/ui/`
**Import:** `@/ui/<component>`

55 Radix UI wrappers styled with Tailwind. Use these instead of Radix directly.

Categories: buttons, inputs, forms, dialogs, navigation, layout, data display, feedback (toasts, skeletons, spinners).

### Hooks

| Hook | Import | Returns |
|---|---|---|
| `useUser` | `@/hooks/useUser` | Auth state + subscription info — see [[auth-subscriptions]] |
| `useCategories` | `@/hooks/useCategories` | All categories from Convex |
| `useDebounce` | `@/hooks/useDebounce` | Debounced value |
| `useMobile` | `@/hooks/useMobile` | `boolean` — is mobile viewport |
| `useToast` | `@/hooks/useToast` | Sonner toast helpers |

### Utilities

| File | Import | Purpose |
|---|---|---|
| `utils.ts` | `@/hooks/../utils` | `cn()` — Tailwind class merge |
| `string.ts` | — | String helpers |
| `number.ts` | — | Number formatting (revenue, sales) |

### DTOs

Shared data transfer objects for the API response layer: `video.ts`, `creator.ts`, `product.ts`.

---

## Stores

**Path:** `src/features/stores/`
**Import prefix:** `@/stores/*`

TikTok shop browsing and detail pages.

### Components

| Component | Description |
|---|---|
| `header.tsx` | Stores page header |
| `cardsStats.tsx` | Aggregate stats cards |
| `storesTable.tsx` | Paginated stores data table |
| `storesTableSkeleton.tsx` | Loading skeleton |
| `lineChart.tsx` | Revenue trend line chart |
| `storeNotFound.tsx` | 404 state component |

### Hooks

| Hook | Description |
|---|---|
| `useStores.tsx` | Fetches paginated store list with filters |
| `useStore.tsx` | Fetches single store by ID or slug |

### DTOs

- `store.ts` — Single store entity shape
- `topStores.ts` — Paginated response shape

### Tests

`src/features/stores/components/tests/` — 5 component tests
`src/features/stores/hooks/tests/` — 2 hook tests
`src/features/stores/dtos/tests/` — 2 DTO tests

---

## Products

**Path:** `src/features/products/`
**Import prefix:** `@/products/*`

TikTok product browsing and detail pages.

### Components

| Component | Description |
|---|---|
| `header.tsx` | Products page header |
| `cardsStats.tsx` | Stats cards |
| `productsTable.tsx` | Product data table |
| `productTableSkeleton.tsx` | Loading skeleton |
| `lineChart.tsx` | Revenue trend chart |
| `revenueChart.tsx` | Revenue breakdown chart |
| `coreMetrics.tsx` | Key metric cards for product detail |
| `productHeader.tsx` | Product detail header |
| `notFoundProduct.tsx` | 404 state |

### Hooks

- `useProducts.tsx` — Paginated product list
- `useProduct.tsx` — Single product by ID or slug

### DTOs

- `product.ts` — Product entity
- `topProducts.ts` — Paginated response

---

## Videos

**Path:** `src/features/videos/`
**Import prefix:** `@/videos/*`

Viral TikTok video browsing. The public `GET /api/videos` endpoint serves this data — see [[api/videos]].

### Components

- `videoCard.tsx` — Video card with thumbnail, description, revenue, and transcription toggle

### Hooks

- `useVideos.tsx` — Fetches paginated videos sorted by revenue

### DTOs

- `topVideosDto.ts` — Paginated API response shape

### Tests

- `components/tests/videoCard.test.tsx`
- `hooks/tests/useVideos.test.ts`
- `dtos/tests/topVideosDto.test.ts`

---

## Saved Items

**Path:** `src/features/saved/`
**Import prefix:** `@/saved/*`

Users can save products, stores, and videos. Saved state is per-user, stored in Convex (`savedProducts`, `savedStores`, `savedVideos` tables).

### Components

| Component | Description |
|---|---|
| `SavedProductCard.tsx` | Saved product display |
| `SavedProductCardSkeleton.tsx` | Loading state |
| `SavedStoreCard.tsx` | Saved store display |
| `SavedStoreCardSkeleton.tsx` | Loading state |
| `savedVideoCard.tsx` | Saved video display |
| `SavedVideoCardSkeleton.tsx` | Loading state |

### Hooks

- `useSaved.tsx` — Get, add, and remove saved items for all three entity types

---

## API Keys

**Path:** `src/features/api-keys/`

Lets users generate an API key to access UseShopRadar data programmatically.

### Components

- `ApiKeyManager.tsx` — UI for generating, viewing, and deleting the user's API key

### Hooks

- `useApiKey.ts` — Fetch current API key status from Convex

### Utilities

- `lib/verifyApiKey.ts` — Server-side token validation (AES-256-GCM decrypt + compare)

See [[api/keys]] for the generate/delete endpoints.

---

## Payment

**Path:** `src/features/payment/`
**Import prefix:** `@/payment/*`

### Components

- `pricingCard.tsx` — Pricing tier card used on the `/subscription` page
- `plansInfos/index.tsx` — Plan feature list definitions

### Utilities

- `utils/stripe.ts` — Stripe SDK singleton (`stripe()`)
- `products.ts` — Plan definitions and feature flags

---

## Contact

**Path:** `src/features/contact/`

### Components

- `contactWebForm.tsx` — Contact form (React Hook Form + Zod, submits via `WebContactFormAction`)
- `contactOptions.tsx` — Alternative contact methods

### Server Action

`src/app/actions/webContactForm/index.ts` — Sends email via Resend.

---

## Blog

**Path:** `src/features/blog/`

### Components

- `components/card.tsx` — Blog post card

### Types

- `types/index.ts` — `BlogPost` type

Blog sub-routes: `/blog/post/[id]`, `/blog/product/[id]`, `/blog/store/[id]`
