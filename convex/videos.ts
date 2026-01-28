import { mutation } from "../crawler/convex/_generated/server";
import { v } from "convex/values";
import { getUpdatedValues } from "./utils";

export const updateVideos = mutation({
  args: {
    tt_account: v.optional(v.string()),
    storage_id: v.optional(v.string()),
    description: v.string(),
    views: v.number(),
    duration: v.string(),
    k_id: v.string(),
    k_revenue: v.number(),
    k_sales: v.number(),
  },
  handler: async (ctx, args) => {
    const existingVideo = await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("k_id"), args.k_id))
      .first();

    if (existingVideo) {
      const updates = getUpdatedValues({
        currentData: existingVideo,
        newData: args,
      });

      await ctx.db.patch(existingVideo._id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });
      return { id: existingVideo._id, status: "updated" };
    }

    const result = await ctx.db.insert("videos", {
      ...args,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });

    return { id: result, status: "added" };
  },
});
