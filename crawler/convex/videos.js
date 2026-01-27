import { mutation } from "./_generated/server";
import { v } from "convex/values";

const checkValues = ({ existingVideo, data }) => {
  const updates = {};

  if (data?.storage_id && existingVideo?.storage_id !== data?.storage_id)
    updates.storage_id = data.storage_id;

  if (data?.tt_account && existingVideo?.tt_account !== data?.tt_account)
    updates.tt_account = data.tt_account;

  if (data?.description && existingVideo?.description !== data?.description)
    updates.description = data.description;

  if (data?.views && existingVideo?.views !== data?.views)
    updates.views = data.views;

  if (data?.duration && existingVideo?.duration !== data?.duration)
    updates.duration = data.duration;

  if (data?.k_revenue && existingVideo?.k_revenue !== data?.k_revenue)
    updates.k_revenue = data.k_revenue;

  if (data?.k_sales && existingVideo?.k_sales !== data?.k_sales)
    updates.k_sales = data.k_sales;

  return updates;
};

export const updateVideos = mutation({
  args: {
    data: v.object({
      tt_account: v.optional(v.string()),
      storage_id: v.optional(v.string()),
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

    if (existingVideo) {
      const updates = checkValues({ existingVideo, data });

      await ctx.db.patch(existingVideo._id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });
      return { id: existingVideo._id, status: "updated" };
    }

    const newDataObj = {
      description: data.description,
      views: data.views,
      duration: data.duration,
      k_id: data.k_id,
      k_revenue: data.k_revenue,
      k_sales: data.k_sales,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    if (data?.storage_id) {
      newDataObj.storage_id = data.storage_id;
    }

    if (data?.tt_account) {
      newDataObj.tt_account = data.tt_account;
    }

    const result = await ctx.db.insert("videos", newDataObj);

    return { id: result, status: "added" };
  },
});
