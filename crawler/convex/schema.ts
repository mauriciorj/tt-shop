import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // Define your tables here.
  categories: defineTable({
    main_category_id: v.string(),
    main_category_name: v.string(),
    second_category_id: v.optional(v.string()),
    second_category_name: v.optional(v.string()),
    third_category_id: v.optional(v.string()),
    third_category_name: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }),
  creators: defineTable({
    k_id: v.string(),
    storage_id: v.optional(v.string()),
    image: v.optional(v.string()),
    tt_account: v.string(),
    tt_nickname: v.string(),
    tt_followers: v.number(),
    k_revenue: v.number(),
    k_sales: v.optional(v.number()),
    k_video_revenue: v.optional(v.number()),
    k_live_revenue: v.optional(v.number()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }),
  products: defineTable({
    country: v.string(),
    name: v.string(),
    name_url: v.optional(v.string()),
    storage_id: v.optional(v.string()),
    image: v.optional(v.string()),
    launch_date: v.string(),
    product_rating: v.number(),
    main_category: v.string(),
    second_category: v.optional(v.string()),
    third_category: v.optional(v.string()),
    unit_price: v.number(),
    k_id: v.string(),
    k_creator_conversion_ratio: v.number(),
    k_day_revenue: v.optional(v.number()),
    k_day_sales: v.optional(v.number()),
    k_revenue: v.number(),
    k_revenue_history: v.array(v.number()),
    k_revenue_history_14_days: v.optional(v.array(v.number())),
    k_revenue_history_7_days: v.optional(v.array(v.number())),
    k_revenue_growth_rate: v.number(),
    k_sales: v.number(),
    k_top_creators: v.optional(v.array(v.string())),
    k_top_videos: v.optional(v.array(v.string())),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }),
  stores: defineTable({
    country: v.string(),
    name: v.string(),
    name_url: v.optional(v.string()),
    storage_id: v.optional(v.string()),
    image: v.optional(v.string()),
    type: v.string(),
    main_category: v.string(),
    second_category: v.optional(v.string()),
    third_category: v.optional(v.string()),
    unit_price: v.number(),
    k_id: v.string(),
    k_day_revenue: v.optional(v.number()),
    k_day_sales: v.optional(v.number()),
    k_revenue: v.number(),
    k_revenue_history: v.array(v.number()),
    k_revenue_history_14_days: v.optional(v.array(v.number())),
    k_revenue_history_7_days: v.optional(v.array(v.number())),
    k_revenue_growth_rate: v.number(),
    k_sales: v.number(),
    k_top_creators: v.optional(v.array(v.string())),
    k_top_products: v.optional(v.array(v.string())),
    k_top_videos: v.optional(v.array(v.string())),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }),
  videos: defineTable({
    tt_account: v.optional(v.string()),
    storage_id: v.optional(v.string()),
    image: v.optional(v.string()),
    description: v.string(),
    views: v.number(),
    duration: v.string(),
    k_id: v.string(),
    k_revenue: v.number(),
    k_sales: v.number(),
    main_category: v.optional(v.string()),
    transcription: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  }).index('by_k_revenue', ['k_revenue']),
  savedVideos: defineTable({
    clerk_id: v.string(),
    video_k_id: v.string(),
    created_at: v.optional(v.string()),
  })
    .index('by_clerk_id', ['clerk_id'])
    .index('by_clerk_id_video_k_id', ['clerk_id', 'video_k_id']),
  savedProducts: defineTable({
    clerk_id: v.string(),
    product_k_id: v.string(),
    created_at: v.optional(v.string()),
  })
    .index('by_clerk_id', ['clerk_id'])
    .index('by_clerk_id_product_k_id', ['clerk_id', 'product_k_id']),
  savedStores: defineTable({
    clerk_id: v.string(),
    store_k_id: v.string(),
    created_at: v.optional(v.string()),
  })
    .index('by_clerk_id', ['clerk_id'])
    .index('by_clerk_id_store_k_id', ['clerk_id', 'store_k_id']),
  users: defineTable({
    clerk_id: v.optional(v.string()),
    email: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    image_url: v.optional(v.string()),
    // Stripe subscription fields
    stripe_customer_id: v.optional(v.string()),
    subscription_status: v.optional(
      v.union(
        v.literal('active'),
        v.literal('inactive'),
        v.literal('canceled'),
        v.literal('past_due')
      )
    ),
    subscription_plan: v.optional(v.string()),
    subscription_end_date: v.optional(v.string()),
    created_at: v.optional(v.string()),
    updated_at: v.optional(v.string()),
  })
    .index('by_clerk_id', ['clerk_id'])
    .index('by_email', ['email'])
    .index('by_stripe_customer_id', ['stripe_customer_id']),
})
