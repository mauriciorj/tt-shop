# Database — Convex Schema Reference

All data lives in Convex. Schema defined in `convex/schema.ts`.

## Tables

### `products`
TikTok shop products with sales metrics.

| Field | Type | Notes |
|---|---|---|
| `country` | string | Market country |
| `name` | string | Product name |
| `name_url` | string? | URL-safe slug |
| `storage_id` | string? | Convex file storage ID |
| `image` | string? | Thumbnail URL |
| `launch_date` | string | ISO date string |
| `product_rating` | number | Rating score |
| `main_category` | string | Primary category |
| `second_category` | string? | Secondary category |
| `third_category` | string? | Tertiary category |
| `unit_price` | number | Price per unit |
| `k_id` | string | Kalodata unique ID |
| `k_creator_conversion_ratio` | number | Creator conversion rate |
| `k_day_revenue` | number? | Daily revenue |
| `k_day_sales` | number? | Daily sales count |
| `k_revenue` | number | Total revenue |
| `k_revenue_14_days` | number? | 14-day revenue |
| `k_revenue_7_days` | number? | 7-day revenue |
| `k_revenue_history` | number[] | Revenue history array |
| `k_revenue_history_14_days` | number[]? | 14-day history |
| `k_revenue_history_7_days` | number[]? | 7-day history |
| `k_revenue_growth_rate` | number | Growth rate |
| `k_sales` | number | Total sales count |
| `k_top_creators` | string[]? | Top creator k_ids |
| `k_top_videos` | string[]? | Top video k_ids |
| `created_at` | string? | ISO timestamp |
| `updated_at` | string? | ISO timestamp |

---

### `stores`
TikTok shop stores with store-level metrics.

| Field | Type | Notes |
|---|---|---|
| `country` | string | Market country |
| `name` | string | Store name |
| `name_url` | string? | URL-safe slug |
| `storage_id` | string? | Convex file storage ID |
| `image` | string? | Store logo URL |
| `type` | string | Store type classification |
| `main_category` | string | Primary category |
| `second_category` | string? | |
| `third_category` | string? | |
| `unit_price` | number | Average price |
| `k_id` | string | Kalodata unique ID |
| `k_day_revenue` | number? | Daily revenue |
| `k_day_sales` | number? | Daily sales |
| `k_revenue` | number | Total revenue |
| `k_revenue_14_days` | number? | |
| `k_revenue_7_days` | number? | |
| `k_revenue_history` | number[] | Revenue history array |
| `k_revenue_history_14_days` | number[]? | |
| `k_revenue_history_7_days` | number[]? | |
| `k_revenue_growth_rate` | number | Growth rate |
| `k_sales` | number | Total sales |
| `k_top_creators` | string[]? | Top creator k_ids |
| `k_top_products` | string[]? | Top product k_ids |
| `k_top_videos` | string[]? | Top video k_ids |
| `created_at` | string? | |
| `updated_at` | string? | |

---

### `videos`
Viral TikTok videos with revenue and view data.

| Field | Type | Notes |
|---|---|---|
| `tt_account` | string? | TikTok account handle |
| `storage_id` | string? | Convex file storage ID |
| `image` | string? | Thumbnail URL |
| `description` | string | Video title / caption |
| `views` | number | Total view count |
| `duration` | string | e.g. `"0:45"` |
| `k_id` | string | Kalodata unique ID |
| `k_revenue` | number | Total revenue |
| `k_revenue_14_days` | number? | |
| `k_revenue_7_days` | number? | |
| `k_revenue_history_14_days` | number[]? | |
| `k_revenue_history_7_days` | number[]? | |
| `k_sales` | number | Total sales count |
| `main_category` | string? | Category |
| `transcription` | string? | Whisper transcript text |
| `publish_date` | string? | ISO date string |
| `created_at` | string? | |
| `updated_at` | string? | |

**Indexes:**
- `by_k_revenue` on `['k_revenue']` — used by `/api/videos` for sorted pagination

---

### `categories`
3-level product category hierarchy.

| Field | Type |
|---|---|
| `main_category_id` | string |
| `main_category_name` | string |
| `second_category_id` | string? |
| `second_category_name` | string? |
| `third_category_id` | string? |
| `third_category_name` | string? |
| `created_at` | string? |
| `updated_at` | string? |

---

### `creators`
TikTok creators / influencers.

| Field | Type | Notes |
|---|---|---|
| `k_id` | string | Kalodata ID |
| `storage_id` | string? | Convex file storage ID |
| `image` | string? | Avatar URL |
| `tt_account` | string | TikTok handle |
| `tt_nickname` | string | Display name |
| `tt_followers` | number | Follower count |
| `k_revenue` | number | Total revenue generated |
| `k_sales` | number? | |
| `k_video_revenue` | number? | Revenue from videos |
| `k_live_revenue` | number? | Revenue from lives |
| `created_at` | string? | |
| `updated_at` | string? | |

---

### `users`
App users — subscription status + Stripe data.

| Field | Type | Notes |
|---|---|---|
| `clerk_id` | string? | Clerk user ID (null for guest checkouts) |
| `email` | string | |
| `first_name` | string? | |
| `last_name` | string? | |
| `image_url` | string? | |
| `stripe_customer_id` | string? | Stripe customer ID |
| `subscription_status` | `'active' \| 'inactive' \| 'canceled' \| 'past_due'`? | |
| `subscription_plan` | string? | e.g. `'Pro'`, `'free'`, `'tester'` |
| `subscription_end_date` | string? | ISO timestamp |
| `created_at` | string? | |
| `updated_at` | string? | |

**Indexes:**
- `by_clerk_id` on `['clerk_id']`
- `by_email` on `['email']`
- `by_stripe_customer_id` on `['stripe_customer_id']`

**Notes:**
- Guest checkout creates a user record without `clerk_id`; when that guest later signs up via Clerk the record is linked by email
- `subscription_plan === 'tester'` bypasses the `active` status requirement

---

### `savedProducts` / `savedStores` / `savedVideos`
User-saved items (one record per save action).

| Field | Type |
|---|---|
| `clerk_id` | string |
| `product_k_id` / `store_k_id` / `video_k_id` | string |
| `created_at` | string? |

**Indexes (each table):**
- `by_clerk_id`
- `by_clerk_id_<entity>_k_id` (composite, for dedup checks)

---

### `userApiKeys`
Encrypted API keys for external API access.

| Field | Type | Notes |
|---|---|---|
| `clerk_id` | string | |
| `api_key.content` | string | AES-256-GCM ciphertext (base64) |
| `api_key.iv` | string | Initialization vector (base64) |
| `api_key.tag` | string | GCM auth tag (base64) |
| `usage` | number? | Request count |
| `created_at` | string | |
| `updated_at` | string? | |

**Indexes:** `by_clerk_id`

---

### `searchLogs`
Tracks daily search usage for rate-limiting.

| Field | Type |
|---|---|
| `clerk_id` | string |
| `date` | string (`YYYY-MM-DD`) |
| `created_at` | string |

**Limit:** 3 searches per user per day (free tier).

**Indexes:** `by_clerk_id_date` (composite)

---

### `transcriptionLogs`
Tracks which videos a user has had transcribed.

| Field | Type |
|---|---|
| `clerk_id` | string |
| `video_k_id` | string |
| `date` | string (`YYYY-MM-DD`) |
| `created_at` | string |

**Limit:** 1 new video transcription per user per day. Re-viewing the same video does not count against the limit.

**Indexes:** `by_clerk_id_date`, `by_clerk_id_video`

---

### `waitlist`
Waitlist / tester sign-ups.

| Field | Type |
|---|---|
| `name` | string |
| `email` | string |
| `type` | `'waitlist' \| 'tester'`? |
| `sells_on_tiktok` | boolean? |
| `monthly_revenue` | `'$0-$1000' \| '$1001-$5000' \| '+$5000'`? |
| `tiktok_account` | string? |
| `created_at` | string |

**Indexes:** `by_email`, `by_type`

---

## Convex Functions Reference

| File | Exports |
|---|---|
| `convex/products.ts` | Queries and mutations for products |
| `convex/stores.ts` | Queries and mutations for stores |
| `convex/videos.ts` | `getVideos` (paginated by `by_k_revenue`) |
| `convex/users.ts` | `upsertUser`, `deleteUser`, `getUserByClerkId`, `updateUserSubscription`, `upsertUserFromStripe`, `recordSearchAndCheckLimit`, `recordTranscriptionAndCheckLimit` |
| `convex/savedProducts.ts` | Save / unsave products |
| `convex/savedStores.ts` | Save / unsave stores |
| `convex/savedVideos.ts` | Save / unsave videos |
| `convex/categories.ts` | Category queries |
| `convex/creators.ts` | Creator queries |
| `convex/userApiKeys.ts` | `createApiKey`, `getApiKey`, `deleteApiKey` |
| `convex/waitlist.ts` | Waitlist mutations |
| `convex/files.ts` | File storage helpers |
| `convex/http.ts` | HTTP endpoint configuration |
| `convex/auth.config.ts` | Clerk JWT config |
