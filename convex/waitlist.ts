import { mutation } from './_generated/server'
import { v } from 'convex/values'

const toTitleCase = (str: string) =>
  str
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())

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
    const email = args.email.trim().toLowerCase()

    const existing = await ctx.db
      .query('waitlist')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first()

    if (existing) {
      return { success: true, alreadyRegistered: true }
    }

    await ctx.db.insert('waitlist', {
      ...args,
      name: toTitleCase(args.name),
      email,
      type: 'waitlist',
      created_at: new Date().toISOString(),
    })

    return { success: true, alreadyRegistered: false }
  },
})

export const joinTesterInvite = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    tiktok_account: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase()

    const existing = await ctx.db
      .query('waitlist')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first()

    if (existing) {
      return { success: true, alreadyRegistered: true }
    }

    await ctx.db.insert('waitlist', {
      name: toTitleCase(args.name),
      email,
      tiktok_account: args.tiktok_account.trim().toLowerCase(),
      type: 'tester',
      created_at: new Date().toISOString(),
    })

    return { success: true, alreadyRegistered: false }
  },
})
