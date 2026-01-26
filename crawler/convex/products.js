import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

const revenueHistoryChanged = ({ existingProduct, data }) =>
  Boolean(
    !existingProduct.k_revenue_history ||
      existingProduct.k_revenue_history.length !==
        data.k_revenue_history.length ||
      existingProduct.k_revenue_history.some(
        (val, index) => val !== data.k_revenue_history[index]
      )
  );

const checkValues = ({ existingProduct, data }) => {
  const updates = {};

  if (data?.storage_id && existingProduct?.storage_id !== data?.storage_id)
    updates.storage_id = data.storage_id;
  if (
    data?.main_category &&
    existingProduct?.main_category !== data?.main_category
  )
    updates.main_category = data.main_category;
  if (
    data?.second_category &&
    existingProduct?.second_category !== data?.second_category
  )
    updates.second_category = data.second_category;
  if (
    data?.third_category &&
    existingProduct?.third_category !== data?.third_category
  )
    updates.third_category = data.third_category;
  if (data?.unit_price && existingProduct?.unit_price !== data?.unit_price)
    updates.unit_price = data.unit_price;
  if (
    data?.k_creator_conversion_ratio &&
    existingProduct?.k_creator_conversion_ratio !==
      data?.k_creator_conversion_ratio
  )
    updates.k_creator_conversion_ratio = data.k_creator_conversion_ratio;
  if (data?.k_revenue && existingProduct?.k_revenue !== data?.k_revenue)
    updates.k_revenue = data.k_revenue;
  if (
    data?.k_revenue_growth_rate &&
    existingProduct?.k_revenue_growth_rate !== data?.k_revenue_growth_rate
  )
    updates.k_revenue_growth_rate = data.k_revenue_growth_rate;
  if (data?.k_sales && existingProduct?.k_sales !== data?.k_sales)
    updates.k_sales = data.k_sales;

  return updates;
};

export const addProduct = mutation({
  args: {
    data: v.object({
      country: v.string(),
      name: v.string(),
      storage_id: v.optional(v.string()),
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
    }),
  },
  handler: async (ctx, args) => {
    const { data } = args;

    const existingProduct = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("k_id"), data.k_id))
      .first();

    if (existingProduct) {
      const updates = checkValues({ existingProduct, data });

      if (revenueHistoryChanged({ existingProduct, data })) {
        updates.k_revenue_history = data.k_revenue_history;
      }

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(existingProduct._id, {
          ...updates,
          updated_at: new Date().toISOString(),
        });
      }

      return { id: existingProduct._id, status: "updated" };
    }

    const newDataObj = {
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
    };

    if (data?.storage_id) {
      newDataObj.storage_id = data.storage_id;
    }

    const result = await ctx.db.insert("products", newDataObj);
    return { id: result, status: "created" };
  },
});

export const getProducts = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { paginationOpts } = args;

    return await ctx.db.query("products").order("asc").paginate(paginationOpts);
  },
});

export const getProductByKId = query({
  args: { k_id: v.string() },
  handler: async (ctx, args) => {
    const { k_id } = args;

    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("k_id"), k_id))
      .first();
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
