import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

const revenueHistoryChanged = ({ existingStore, data }) =>
  Boolean(
    !existingStore.k_revenue_history ||
      existingStore.k_revenue_history.length !==
        data.k_revenue_history.length ||
      existingStore.k_revenue_history.some(
        (val, index) => val !== data.k_revenue_history[index]
      )
  );

const checkValues = ({ existingStore, data }) => {
  const updates = {};

  if (data?.storage_id && existingStore?.storage_id !== data?.storage_id)
    updates.storage_id = data.storage_id;
  if (data?.type && existingStore?.type !== data?.type)
    updates.type = data.type;
  if (
    data?.main_category &&
    existingStore?.main_category !== data?.main_category
  )
    updates.main_category = data.main_category;
  if (
    data?.second_category &&
    existingStore?.second_category !== data?.second_category
  )
    updates.second_category = data.second_category;
  if (
    data?.third_category &&
    existingStore?.third_category !== data?.third_category
  )
    updates.third_category = data.third_category;
  if (data?.unit_price && existingStore?.unit_price !== data?.unit_price)
    updates.unit_price = data.unit_price;
  if (data?.k_revenue && existingStore?.k_revenue !== data?.k_revenue)
    updates.k_revenue = data.k_revenue;
  if (
    data?.k_revenue_growth_rate &&
    existingStore?.k_revenue_growth_rate !== data?.k_revenue_growth_rate
  )
    updates.k_revenue_growth_rate = data.k_revenue_growth_rate;
  if (data?.k_sales && existingStore?.k_sales !== data?.k_sales)
    updates.k_sales = data.k_sales;

  return updates;
};

export const addStore = mutation({
  args: {
    data: v.object({
      country: v.string(),
      name: v.string(),
      storage_id: v.optional(v.string()),
      type: v.string(),
      main_category: v.string(),
      second_category: v.string(),
      third_category: v.string(),
      unit_price: v.number(),
      k_id: v.string(),
      k_revenue: v.number(),
      k_revenue_history: v.array(v.number()),
      k_revenue_growth_rate: v.number(),
      k_sales: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { data } = args;

    const existingStore = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("k_id"), data.k_id))
      .first();

    if (existingStore) {
      const updates = checkValues({ existingStore, data });

      if (revenueHistoryChanged({ existingStore, data })) {
        updates.k_revenue_history = data.k_revenue_history;
      }

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(existingStore._id, {
          ...updates,
          updated_at: new Date().toISOString(),
        });
      }
      return { id: existingStore._id, status: "updated" };
    }

    const newDataObj = {
      country: data.country,
      name: data.name,
      type: data.type,
      main_category: data.main_category,
      second_category: data.second_category,
      third_category: data.third_category,
      unit_price: data.unit_price,
      k_id: data.k_id,
      k_revenue: data.k_revenue,
      k_revenue_history: data.k_revenue_history,
      k_revenue_growth_rate: data.k_revenue_growth_rate,
      k_sales: data.k_sales,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    if (data?.storage_id) {
      newDataObj.storage_id = data.storage_id;
    }

    const result = await ctx.db.insert("stores", newDataObj);
    return { id: result, status: "added" };
  },
});

export const getStores = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { paginationOpts } = args;

    return await ctx.db.query("stores").order("asc").paginate(paginationOpts);
  },
});

export const getStoreByKId = query({
  args: { k_id: v.string() },
  handler: async (ctx, args) => {
    const { k_id } = args;

    return await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("k_id"), k_id))
      .first();
  },
});

export const updateStore = mutation({
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

    const existingStore = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("k_id"), data.k_id))
      .first();

    if (existingStore) {
      await ctx.db.patch(existingStore._id, {
        tt_account: data.tt_account,
        tt_nickname: data.tt_nickname,
        tt_followers: data.tt_followers,
        k_revenue: data.k_revenue,
        k_video_revenue: data.k_video_revenue,
        k_live_revenue: data.k_live_revenue,
        updated_at: new Date().toISOString(),
      });
      return existingStore;
    }
  },
});

export const updateStoreDetails = mutation({
  args: {
    data: v.object({
      id: v.id("stores"),
      k_id: v.string(),
      k_top_creators: v.array(v.string()),
      k_top_products: v.array(v.string()),
      k_top_videos: v.array(v.string()),
      k_day_sales: v.number(),
      k_day_revenue: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { data } = args;

    const existingStore = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("_id"), data.id))
      .first();

    if (existingStore) {
      await ctx.db.patch(existingStore._id, {
        k_top_creators: data.k_top_creators,
        k_top_products: data.k_top_products,
        k_top_videos: data.k_top_videos,
        k_day_sales: data.k_day_sales,
        k_day_revenue: data.k_day_revenue,
        updated_at: new Date().toISOString(),
      });
      return existingStore;
    }
  },
});
