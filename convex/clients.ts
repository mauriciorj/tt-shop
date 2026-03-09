import { v } from 'convex/values'
import { internalMutation, query } from './_generated/server'
import { getUpdatedValues } from './utils'

export const upsertClient = internalMutation({
  args: {
    clerk_id: v.string(),
    email: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    image_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingClient = await ctx.db
      .query('clients')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', args.clerk_id))
      .first()

    if (existingClient) {
      const updates = getUpdatedValues({
        currentData: existingClient,
        newData: args,
      })

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(existingClient._id, {
          ...updates,
          updated_at: new Date().toISOString(),
        })
        return { id: existingClient._id, status: 'updated' }
      }

      return { id: existingClient._id, status: 'no_changes' }
    }

    const id = await ctx.db.insert('clients', {
      ...args,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    return { id, status: 'created' }
  },
})

export const deleteClient = internalMutation({
  args: {
    clerk_id: v.string(),
  },
  handler: async (ctx, args) => {
    const existingClient = await ctx.db
      .query('clients')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', args.clerk_id))
      .first()

    if (existingClient) {
      await ctx.db.delete(existingClient._id)
      return { status: 'deleted' }
    }

    return { status: 'not_found' }
  },
})

export const getClientByClerkId = query({
  args: {
    clerk_id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('clients')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', args.clerk_id))
      .first()
  },
})
