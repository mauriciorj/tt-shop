import { v } from 'convex/values'
import { internalMutation, mutation, query } from './_generated/server'
import { getUpdatedValues } from './utils'

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
    // First check if user exists by clerk_id
    const clerkId = args.clerk_id
    let existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerkId))
      .first()

    // If not found by clerk_id, check by email (for linking Stripe customers who later sign up)
    if (!existingUser) {
      const email = args.email
      existingUser = await ctx.db
        .query('users')
        .withIndex('by_email', (q) => q.eq('email', email))
        .first()
    }

    if (existingUser) {
      const updates = getUpdatedValues({
        currentData: existingUser,
        newData: args,
      })

      // Check if we're linking a Stripe customer to a new Clerk account
      const isLinking = !existingUser.clerk_id && args.clerk_id

      if (isLinking) {
        updates.clerk_id = args.clerk_id
      }

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(existingUser._id, {
          ...updates,
          updated_at: new Date().toISOString(),
        })
        return {
          id: existingUser._id,
          status: isLinking ? 'linked' : 'updated',
          subscription_status: existingUser.subscription_status,
        }
      }

      return {
        id: existingUser._id,
        status: 'no_changes',
        subscription_status: existingUser.subscription_status,
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

export const deleteUser = internalMutation({
  args: {
    clerk_id: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', args.clerk_id))
      .first()

    if (existingUser) {
      await ctx.db.delete(existingUser._id)
      return { status: 'deleted' }
    }

    return { status: 'not_found' }
  },
})

export const getUserByClerkId = query({
  args: {
    clerk_id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', args.clerk_id))
      .first()
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
      const clerkId = args.clerk_id
      user = await ctx.db
        .query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerkId))
        .first()
    }

    // Then try by stripe_customer_id
    if (!user && args.stripe_customer_id) {
      const stripeCustomerId = args.stripe_customer_id
      user = await ctx.db
        .query('users')
        .withIndex('by_stripe_customer_id', (q) =>
          q.eq('stripe_customer_id', stripeCustomerId)
        )
        .first()
    }

    // Finally try by email
    if (!user && args.email) {
      const email = args.email
      user = await ctx.db
        .query('users')
        .withIndex('by_email', (q) => q.eq('email', email))
        .first()
    }

    if (!user) {
      return { status: 'not_found' }
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (args.stripe_customer_id) {
      updates.stripe_customer_id = args.stripe_customer_id
    }
    if (args.subscription_status) {
      updates.subscription_status = args.subscription_status
    }
    if (args.subscription_plan) {
      updates.subscription_plan = args.subscription_plan
    }
    if (args.subscription_end_date) {
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
    const email = args.email
    let existingUser = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first()

    if (!existingUser) {
      const stripeCustomerId = args.stripe_customer_id
      existingUser = await ctx.db
        .query('users')
        .withIndex('by_stripe_customer_id', (q) =>
          q.eq('stripe_customer_id', stripeCustomerId)
        )
        .first()
    }

    if (existingUser) {
      // Update existing user
      const updates: Record<string, unknown> = {
        stripe_customer_id: args.stripe_customer_id,
        updated_at: new Date().toISOString(),
      }

      if (args.subscription_status) {
        updates.subscription_status = args.subscription_status
      }
      if (args.subscription_plan) {
        updates.subscription_plan = args.subscription_plan
      }
      if (args.subscription_end_date) {
        updates.subscription_end_date = args.subscription_end_date
      }

      await ctx.db.patch(existingUser._id, updates)
      return { id: existingUser._id, status: 'updated' }
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
