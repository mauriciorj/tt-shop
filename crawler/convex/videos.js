import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateVideos = mutation({
  args: {
    data: v.object({
      tt_account: v.optional(v.string()),
      description: v.string(),
      views: v.number(),
      duration: v.string(),
      k_id: v.string(),
      k_revenue: v.number(),
      k_sales: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { data } = args;

    const existingVideo = await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("k_id"), data.k_id))
      .first();

    const newDataObject = {
      tt_account: data.tt_account,
      description: data.description,
      views: data.views,
      duration: data.duration,
      k_id: data.k_id,
      k_revenue: data.k_revenue,
      k_sales: data.k_sales,
      updated_at: new Date().toISOString(),
    };

    newDataObject.updated_at = new Date().toISOString();

    if (data?.tt_account) {
      newDataObject.tt_account = data.tt_account;
    }

    if (existingVideo) {
      await ctx.db.patch(existingVideo._id, newDataObject);
      return null;
    }

    newDataObject.created_at = new Date().toISOString();

    const newVideo = await ctx.db.insert("videos", newDataObject);

    return newVideo;
  },
});
