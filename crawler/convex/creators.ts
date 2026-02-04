import { mutation } from './_generated/server'
import { v } from 'convex/values'
import { getUpdatedValues } from './utils'

export const updateCreator = mutation({
  args: {
    k_id: v.string(),
    k_live_revenue: v.optional(v.number()),
    k_revenue: v.number(),
    k_sales: v.optional(v.number()),
    k_video_revenue: v.optional(v.number()),
    storage_id: v.optional(v.string()),
    tt_account: v.string(),
    tt_followers: v.number(),
    tt_nickname: v.string(),
  },
  handler: async (ctx, args) => {
    const queryResult = await ctx.db
      .query('creators')
      .filter((q) => q.eq(q.field('k_id'), args.k_id))
      .first()

    if (queryResult) {
      const updates = getUpdatedValues({
        currentData: queryResult,
        newData: args,
      })

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(queryResult._id, {
          ...updates,
          updated_at: new Date().toISOString(),
        })
      }
      return { id: queryResult._id, status: 'updated' }
    }

    const result = await ctx.db.insert('creators', {
      ...args,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })
    return { id: result, status: 'added' }
  },
})
