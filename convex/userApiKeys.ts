import { mutation, query } from '@/convex/_generated/server'
import { v } from 'convex/values'

export const getApiKey = query({
  args: { clerk_id: v.string() },
  handler: async (ctx, { clerk_id }) => {
    return await ctx.db
      .query('userApiKeys')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerk_id))
      .first()
  },
})

export const createApiKey = mutation({
  args: {
    clerk_id: v.string(),
    api_key: v.object({
      content: v.string(),
      iv: v.string(),
      tag: v.string(),
    }),
  },
  handler: async (ctx, { clerk_id, api_key }) => {
    const existing = await ctx.db
      .query('userApiKeys')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerk_id))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        api_key,
        updated_at: new Date().toISOString(),
      })
      return { id: existing._id, status: 'updated' }
    }

    const id = await ctx.db.insert('userApiKeys', {
      clerk_id,
      api_key,
      created_at: new Date().toISOString(),
    })
    return { id, status: 'created' }
  },
})

const USAGE_LIMIT = 1_000

export const hasReachedLimit = query({
  args: { clerk_id: v.string() },
  handler: async (ctx, { clerk_id }) => {
    const record = await ctx.db
      .query('userApiKeys')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerk_id))
      .first()

    if (!record) return true
    return (record.usage ?? 0) >= USAGE_LIMIT
  },
})

export const incrementUsage = mutation({
  args: { clerk_id: v.string() },
  handler: async (ctx, { clerk_id }) => {
    const record = await ctx.db
      .query('userApiKeys')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerk_id))
      .first()

    if (!record) return

    await ctx.db.patch(record._id, {
      usage: (record.usage ?? 0) + 1,
    })
  },
})

export const deleteApiKey = mutation({
  args: { clerk_id: v.string() },
  handler: async (ctx, { clerk_id }) => {
    const existing = await ctx.db
      .query('userApiKeys')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerk_id))
      .first()

    if (!existing) return { status: 'not_found' }

    await ctx.db.delete(existing._id)
    return { status: 'deleted' }
  },
})
