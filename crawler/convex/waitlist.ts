import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const joinWaitlist = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    sells_on_tiktok: v.boolean(),
    monthly_revenue: v.union(
      v.literal('$0-$1000'),
      v.literal('$1001-$5000'),
      v.literal('+$5000')
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('waitlist')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first()

    if (existing) {
      return { success: true, alreadyRegistered: true }
    }

    await ctx.db.insert('waitlist', {
      ...args,
      created_at: new Date().toISOString(),
    })

    return { success: true, alreadyRegistered: false }
  },
})
