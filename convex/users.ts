import { v } from 'convex/values'
import { internalMutation, mutation, query } from '@/convex/_generated/server'
import { api } from '@/convex/_generated/api'
import { getUpdatedValues, isoWeek } from '@/convex/utils'
import { LIMITS } from '@/businessRules/index'

export const deleteUser = internalMutation({
  args: {
    clerk_id: v.string(),
  },
  handler: async (ctx, args) => {
    const { clerk_id } = args
    const user = (await ctx.runQuery(api.users.getUserByClerkId, {
      clerk_id: clerk_id,
    })) as any

    if (user) {
      await ctx.db.delete(user._id)
      return { status: 'deleted' }
    }

    return { status: 'not_found' }
  },
})

export const getEnhancementUsageTodayAndWeekly = query({
  args: { clerk_id: v.string() },
  handler: async (ctx, { clerk_id }) => {
    const user = (await ctx.runQuery(api.users.getUserByClerkId, {
      clerk_id: clerk_id,
    })) as any

    const isSubscriptionActive =
      user?.subscription_status === 'active' ||
      user?.subscription_plan === 'tester'

    const now = new Date()

    if (isSubscriptionActive) {
      const DAILY_LIMIT = LIMITS.VIDEOS_ENHANCEMENTS_PER_DAY
      const today = now.toISOString().slice(0, 10)
      const logs = await ctx.db
        .query('enhancementLogs')
        .withIndex('by_clerk_id_date', (q) =>
          q.eq('clerk_id', clerk_id).eq('date', today)
        )
        .collect()

      const isAllowed = logs.length < DAILY_LIMIT
      const used = logs.length
      const remaining = DAILY_LIMIT - used

      return {
        isAllowed,
        limit: DAILY_LIMIT,
        period: 'day' as const,
        remaining,
        used,
      }
    } else {
      const WEEKLY_LIMIT = LIMITS.VIDEOS_ENHANCEMENTS_PER_WEEK
      const week = isoWeek(now)
      const logs = await ctx.db
        .query('enhancementLogs')
        .withIndex('by_clerk_id_week', (q) =>
          q.eq('clerk_id', clerk_id).eq('week', week)
        )
        .collect()
      const isAllowed = logs.length < WEEKLY_LIMIT
      const used = logs.length
      const remaining = WEEKLY_LIMIT - used

      return {
        isAllowed,
        limit: WEEKLY_LIMIT,
        period: 'week' as const,
        remaining,
        used,
      }
    }
  },
})

export const getSearchUsageToday = query({
  args: { clerk_id: v.string() },
  handler: async (ctx, args) => {
    const { clerk_id } = args
    const DAILY_LIMIT = LIMITS.SEARCH_PER_DAY_FREE_USER
    const today = new Date().toISOString().slice(0, 10)

    const existing = await ctx.db
      .query('searchLogs')
      .withIndex('by_clerk_id_date', (q) =>
        q.eq('clerk_id', clerk_id).eq('date', today)
      )
      .collect()

    const isAllowed = existing.length < DAILY_LIMIT
    const used = existing.length
    const remaining = DAILY_LIMIT - used - 1

    return { used, isAllowed, remaining }
  },
})

export const getTranscriptionByVideoKId = query({
  args: { clerk_id: v.string(), video_k_id: v.string() },
  handler: async (ctx, args) => {
    const { clerk_id, video_k_id } = args
    return await ctx.db
      .query('transcriptionLogs')
      .withIndex('by_clerk_id_video', (q) =>
        q.eq('clerk_id', clerk_id).eq('video_k_id', video_k_id)
      )
      .first()
  },
})

export const getUserByClerkId = query({
  args: {
    clerk_id: v.string(),
  },
  handler: async (ctx, args) => {
    const { clerk_id } = args
    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerk_id))
      .first()
  },
})

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const { email } = args
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first()
  },
})

export const getUserByStripe = query({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, args) => {
    const { stripeCustomerId } = args
    return await ctx.db
      .query('users')
      .withIndex('by_stripe_customer_id', (q) =>
        q.eq('stripe_customer_id', stripeCustomerId)
      )
      .first()
  },
})

export const getTranscriptionUsageToday = query({
  args: { clerk_id: v.string() },
  handler: async (ctx, { clerk_id }) => {
    const DAILY_LIMIT = LIMITS.VIDEOS_TRANSCRIPTIONS_PER_DAY_FREE_USER
    const today = new Date().toISOString().slice(0, 10)
    const todayLogs = await ctx.db
      .query('transcriptionLogs')
      .withIndex('by_clerk_id_date', (q) =>
        q.eq('clerk_id', clerk_id).eq('date', today)
      )
      .collect()

    const used = todayLogs?.length
    const isAllowed = used < DAILY_LIMIT
    const remaining = DAILY_LIMIT - used

    return { isAllowed, limit: DAILY_LIMIT, remaining, used }
  },
})

export const updateEnhancementLimit = mutation({
  args: { clerk_id: v.string() },
  handler: async (ctx, args) => {
    const { clerk_id } = args

    // Get user
    const user = (await ctx.runQuery(api.users.getUserByClerkId, {
      clerk_id: clerk_id,
    })) as any

    // Check if user is subscribed
    const isSubscriptionActive =
      user?.subscription_status === 'active' ||
      user?.subscription_plan === 'tester'

    const now = new Date()
    const today = now.toISOString().slice(0, 10)
    const week = isoWeek(now)

    const { isAllowed, used } = (await ctx.runQuery(
      api.users.getEnhancementUsageTodayAndWeekly,
      {
        clerk_id,
      }
    )) as { isAllowed: boolean; used: number }

    if (!isAllowed) {
      return {
        allowed: false,
        used: used,
        limit: 1,
        period: isSubscriptionActive ? ('day' as const) : ('week' as const),
      }
    }

    await ctx.db.insert('enhancementLogs', {
      clerk_id,
      date: today,
      week,
      created_at: now.toISOString(),
    })

    return {
      allowed: true,
      used: used + 1,
      limit: 1,
      period: isSubscriptionActive ? ('day' as const) : ('week' as const),
    }
  },
})

export const updateSearchLimit = mutation({
  args: { clerk_id: v.string() },
  handler: async (ctx, args) => {
    const { clerk_id } = args
    const today = new Date().toISOString().slice(0, 10)

    // Check if user is allowed to search
    const { isAllowed, remaining } = (await ctx.runQuery(
      api.users.getSearchUsageToday,
      {
        clerk_id,
      }
    )) as { isAllowed: boolean; remaining: number }

    // If user is not allowed to search, return allowed is false
    if (!isAllowed) {
      return { allowed: false, remaining: 0 }
    }

    // Record the search
    await ctx.db.insert('searchLogs', {
      clerk_id,
      date: today,
      created_at: new Date().toISOString(),
    })

    return { allowed: true, remaining }
  },
})

export const updateTranscriptionLimit = mutation({
  args: { clerk_id: v.string(), video_k_id: v.string() },
  handler: async (ctx, args) => {
    const { clerk_id, video_k_id } = args

    const today = new Date().toISOString().slice(0, 10)

    // Allow re-viewing the same video without counting against the limit
    const alreadySeen = await ctx.runQuery(
      api.users.getTranscriptionByVideoKId,
      {
        clerk_id,
        video_k_id,
      }
    )

    // If user has already seen the video, return allowed is true
    if (alreadySeen) {
      return { allowed: true, remaining: 0 }
    }

    // Check if user is allowed to transcribe
    const { isAllowed, remaining } = (await ctx.runQuery(
      api.users.getTranscriptionUsageToday,
      {
        clerk_id,
      }
    )) as { isAllowed: boolean; remaining: number }

    // If user is not allowed to transcribe, return is false
    if (!isAllowed) {
      return { allowed: false, remaining: 0 }
    }

    // Record the transcription
    await ctx.db.insert('transcriptionLogs', {
      clerk_id,
      video_k_id,
      date: today,
      created_at: new Date().toISOString(),
    })

    return { allowed: true, remaining }
  },
})

export const upsertUser = internalMutation({
  args: {
    clerk_id: v.string(),
    email: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    image_url: v.optional(v.string()),
    subscription_plan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerk_id, email } = args

    // First check if user exists by clerk_id
    let user = (await ctx.runQuery(api.users.getUserByClerkId, {
      clerk_id: clerk_id,
    })) as any

    // If not found by clerk_id, check by email (for linking Stripe customers who later sign up)
    if (!user) {
      user = (await ctx.runQuery(api.users.getUserByEmail, {
        email: email,
      })) as any
    }

    if (user) {
      const updates = getUpdatedValues({
        currentData: user,
        newData: args,
      })

      // Check if we're linking a Stripe customer to a new Clerk account
      const isLinking = !user.clerk_id && args.clerk_id

      if (isLinking) {
        updates.clerk_id = args.clerk_id
      }

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(user._id, {
          ...updates,
          updated_at: new Date().toISOString(),
        })
        return {
          id: user._id,
          status: isLinking ? 'linked' : 'updated',
          subscription_status: user.subscription_status,
        }
      }

      return {
        id: user._id,
        status: 'no_changes',
        subscription_status: user.subscription_status,
      }
    }

    const id = await ctx.db.insert('users', {
      ...args,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    return { id, status: 'created' }
  },
})

export const updateUserSubscription = mutation({
  args: {
    clerk_id: v.optional(v.string()),
    email: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    let user = null

    // Try to find user by clerk_id first
    if (args.clerk_id) {
      user = (await ctx.runQuery(api.users.getUserByClerkId, {
        clerk_id: args.clerk_id,
      })) as any
    }

    // Then try by stripe_customer_id
    if (!user && args.stripe_customer_id) {
      user = (await ctx.runQuery(api.users.getUserByStripe, {
        stripeCustomerId: args.stripe_customer_id,
      })) as any
    }

    // Finally try by email
    if (!user && args.email) {
      user = (await ctx.runQuery(api.users.getUserByEmail, {
        email: args.email,
      })) as any
    }

    if (!user) {
      return { status: 'not_found' }
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (args?.stripe_customer_id) {
      updates.stripe_customer_id = args.stripe_customer_id
    }
    if (args?.subscription_status) {
      updates.subscription_status = args.subscription_status
    }
    if (args?.subscription_plan) {
      updates.subscription_plan = args.subscription_plan
    }
    if (args?.subscription_end_date) {
      updates.subscription_end_date = args.subscription_end_date
    }

    await ctx.db.patch(user._id, updates)

    return { id: user._id, status: 'updated' }
  },
})

// Create or update user from Stripe webhook (no clerk_id required)
export const upsertUserFromStripe = mutation({
  args: {
    email: v.string(),
    stripe_customer_id: v.string(),
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
  },
  handler: async (ctx, args) => {
    // Try to find existing user by email or stripe_customer_id
    let user = (await ctx.runQuery(api.users.getUserByEmail, {
      email: args.email,
    })) as any

    if (!user) {
      user = (await ctx.runQuery(api.users.getUserByStripe, {
        stripeCustomerId: args.stripe_customer_id,
      })) as any
    }

    if (user) {
      // Update existing user
      const updates: Record<string, unknown> = {
        stripe_customer_id: args.stripe_customer_id,
        updated_at: new Date().toISOString(),
      }

      if (args?.subscription_status) {
        updates.subscription_status = args.subscription_status
      }
      if (args?.subscription_plan) {
        updates.subscription_plan = args.subscription_plan
      }
      if (args?.subscription_end_date) {
        updates.subscription_end_date = args.subscription_end_date
      }

      await ctx.db.patch(user._id, updates)
      return { id: user._id, status: 'updated' }
    }

    // Create new user without clerk_id
    const id = await ctx.db.insert('users', {
      email: args.email,
      stripe_customer_id: args.stripe_customer_id,
      subscription_status: args.subscription_status,
      subscription_plan: args.subscription_plan,
      subscription_end_date: args.subscription_end_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    return { id, status: 'created' }
  },
})
