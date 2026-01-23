import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateCreator = mutation({
  args: {
    data: v.object({
      k_id: v.string(),
      tt_account: v.string(),
      tt_nickname: v.string(),
      tt_followers: v.number(),
      k_revenue: v.number(),
      k_video_revenue: v.number(),
      k_live_revenue: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { data } = args;

    const existingCreator = await ctx.db
      .query("creators")
      .filter((q) => q.eq(q.field("k_id"), data.k_id))
      .first();

    if (existingCreator) {
      await ctx.db.patch(existingCreator._id, {
        tt_account: data.tt_account,
        tt_nickname: data.tt_nickname,
        tt_followers: data.tt_followers,
        k_revenue: data.k_revenue,
        k_video_revenue: data.k_video_revenue,
        k_live_revenue: data.k_live_revenue,
        updated_at: new Date().toISOString(),
      });
      return null;
    }

    const newCreator = await ctx.db.insert("creators", {
      k_id: data.k_id,
      tt_account: data.tt_account,
      tt_nickname: data.tt_nickname,
      tt_followers: data.tt_followers,
      k_revenue: data.k_revenue,
      k_video_revenue: data.k_video_revenue,
      k_live_revenue: data.k_live_revenue,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

    return newCreator;
  },
});
