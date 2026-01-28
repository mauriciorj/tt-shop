import { mutation, query } from "../crawler/convex/_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { getUpdatedValues } from "./utils";

export const addStore = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const queryResult = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("k_id"), args.k_id))
      .first();

    if (queryResult) {
      const updates = getUpdatedValues({
        currentData: queryResult,
        newData: args,
      });

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(queryResult._id, {
          ...updates,
          updated_at: new Date().toISOString(),
        });
      }
      return { id: queryResult._id, status: "updated" };
    }

    const result = await ctx.db.insert("stores", {
      ...args,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
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
    id: v.id("stores"),
    k_id: v.string(),
    k_top_creators: v.array(v.string()),
    k_top_products: v.array(v.string()),
    k_top_videos: v.array(v.string()),
    k_day_sales: v.number(),
    k_day_revenue: v.number(),
  },
  handler: async (ctx, args) => {
    const queryResult = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .first();

    if (queryResult) {
      const updates = getUpdatedValues({
        currentData: queryResult,
        newData: args,
      });

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(queryResult._id, {
          ...updates,
          updated_at: new Date().toISOString(),
        });
      }
      return queryResult;
    }
  },
});
