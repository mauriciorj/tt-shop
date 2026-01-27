import { mutation } from "./_generated/server";
import { v } from "convex/values";

const checkValues = ({ existingCreator, data }) => {
  const updates = {};

  if (data?.storage_id && existingCreator?.storage_id !== data?.storage_id)
    updates.storage_id = data.storage_id;

  if (data?.tt_account && existingCreator?.tt_account !== data?.tt_account)
    updates.tt_account = data.tt_account;

  if (data?.tt_nickname && existingCreator?.tt_nickname !== data?.tt_nickname)
    updates.tt_nickname = data.tt_nickname;

  if (
    data?.tt_followers &&
    existingCreator?.tt_followers !== data?.tt_followers
  )
    updates.tt_followers = data.tt_followers;

  if (data?.k_revenue && existingCreator?.k_revenue !== data?.k_revenue)
    updates.k_revenue = data.k_revenue;

  if (
    data?.k_video_revenue &&
    existingCreator?.k_video_revenue !== data?.k_video_revenue
  )
    updates.k_video_revenue = data.k_video_revenue;

  if (
    data?.k_live_revenue &&
    existingCreator?.k_live_revenue !== data?.k_live_revenue
  )
    updates.k_live_revenue = data.k_live_revenue;

  return updates;
};

export const updateCreator = mutation({
  args: {
    data: v.object({
      k_id: v.string(),
      storage_id: v.optional(v.string()),
      tt_account: v.string(),
      tt_nickname: v.string(),
      tt_followers: v.number(),
      k_revenue: v.number(),
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

    if (existingCreator) {
      const updates = checkValues({ existingCreator, data });

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(existingCreator._id, {
          ...updates,
          updated_at: new Date().toISOString(),
        });
      }
      return { id: existingCreator._id, status: "updated" };
    }

    const newDataObj = {
      k_id: data.k_id,
      tt_account: data.tt_account,
      tt_nickname: data.tt_nickname,
      tt_followers: data.tt_followers,
      k_revenue: data.k_revenue,
      k_video_revenue: data.k_video_revenue,
      k_live_revenue: data.k_live_revenue,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    if (data?.storage_id) {
      newDataObj.storage_id = data.storage_id;
    }

    const result = await ctx.db.insert("creators", newDataObj);
    return { id: result, status: "added" };
  },
});
