import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

export const addProduct = mutation({
  args: {
    data: v.object({
      country: v.string(),
      name: v.string(),
      launch_date: v.string(),
      product_rating: v.number(),
      main_category: v.string(),
      second_category: v.string(),
      third_category: v.string(),
      unit_price: v.number(),
      k_id: v.string(),
      k_creator_conversion_ratio: v.number(),
      k_revenue: v.number(),
      k_revenue_history: v.array(v.number()),
      k_revenue_growth_rate: v.number(),
      k_sales: v.number(),
      k_top_creators: v.optional(v.array(v.string())),
      k_top_videos: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const { data } = args;

    const existingProduct = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("k_id"), data.k_id))
      .first();

    if (existingProduct) {
      await ctx.db.patch(existingProduct._id, {
        product_rating: data.product_rating,
        main_category: data.main_category,
        second_category: data.second_category,
        third_category: data.third_category,
        unit_price: data.unit_price,
        k_creator_conversion_ratio: data.k_creator_conversion_ratio,
        k_revenue: data.k_revenue,
        k_revenue_history: data.k_revenue_history,
        k_revenue_growth_rate: data.k_revenue_growth_rate,
        k_sales: data.k_sales,
        updated_at: new Date().toISOString(),
      });
      return;
    }

    await ctx.db.insert("products", {
      country: data.country,
      name: data.name,
      launch_date: data.launch_date,
      product_rating: data.product_rating,
      main_category: data.main_category,
      second_category: data.second_category,
      third_category: data.third_category,
      unit_price: data.unit_price,
      k_id: data.k_id,
      k_creator_conversion_ratio: data.k_creator_conversion_ratio,
      k_revenue: data.k_revenue,
      k_revenue_history: data.k_revenue_history,
      k_revenue_growth_rate: data.k_revenue_growth_rate,
      k_sales: data.k_sales,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
  },
});

export const getProducts = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { paginationOpts } = args;

    return await ctx.db.query("products").order("asc").paginate(paginationOpts);
  },
});

export const updateProductDetails = mutation({
  args: {
    data: v.object({
      id: v.id("products"),
      k_id: v.string(),
      k_top_creators: v.optional(v.array(v.string())),
      k_top_videos: v.optional(v.array(v.string())),
      k_day_sales: v.number(),
      k_day_revenue: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const { data } = args;

    const existingProduct = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("k_id"), data.k_id))
      .first();

    if (existingProduct) {
      await ctx.db.patch(existingProduct._id, {
        k_top_creators: data.k_top_creators,
        k_top_videos: data.k_top_videos,
        k_day_sales: data.k_day_sales,
        k_day_revenue: data.k_day_revenue,
        updated_at: new Date().toISOString(),
      });
      return existingProduct;
    }
  },
});
