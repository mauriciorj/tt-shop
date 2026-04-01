import { mutation, query } from './_generated/server'
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
