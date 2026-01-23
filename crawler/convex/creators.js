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
      k_sales: v.optional(v.number()),
      k_video_revenue: v.optional(v.number()),
      k_live_revenue: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const { data } = args;

    const existingCreator = await ctx.db
      .query("creators")
      .filter((q) => q.eq(q.field("k_id"), data.k_id))
      .first();

    const newDataObj = {
      tt_account: data.tt_account,
      tt_nickname: data.tt_nickname,
      tt_followers: data.tt_followers,
      k_revenue: data.k_revenue,
      updated_at: new Date().toISOString(),
    };

    if (data?.k_sales) {
      newDataObj.k_sales = data.k_sales;
    }

    if (data?.k_video_revenue) {
      newDataObj.k_video_revenue = data.k_video_revenue;
    }

    if (data?.k_live_revenue) {
      newDataObj.k_live_revenue = data.k_live_revenue;
    }

    if (existingCreator) {
      await ctx.db.patch(existingCreator._id, newDataObj);
      return null;
    }

    newDataObj.k_id = data.k_id;
    newDataObj.created_at = new Date().toISOString();

    const newCreator = await ctx.db.insert("creators", newDataObj);

    return newCreator;
  },
});
