import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addStore = mutation({
  args: {
    data: v.object({
      country: v.string(),
      name: v.string(),
      type: v.string(),
      main_category: v.number(),
      second_category: v.number(),
      third_category: v.number(),
      unit_price: v.number(),
      k_id: v.string(),
      k_day_revenue: v.number(),
      k_day_sales: v.number(),
      k_revenue: v.number(),
      k_revenue_history: v.array(v.number()),
      k_revenue_growth_rate: v.number(),
      k_sales: v.number(),
      k_top_creators: v.array(v.string()),
      k_top_products: v.array(v.string()),
      k_top_videos: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { data } = args;
    console.log("");
    console.log(data);
    // await ctx.db.insert("stores", {
    //   country: data.country,
    //   name: data.name,
    //   type: data.type,
    //   main_category: data.main_category,
    //   second_category: data.second_category,
    //   third_category: data.third_category,
    //   unit_price: data.unit_price,
    //   k_id: data.k_id,
    //   k_revenue: data.k_revenue,
    //   k_revenue_history: data.k_revenue_history,
    //   k_revenue_growth_rate: data.k_revenue_growth_rate,
    //   k_sales: data.k_sales,
    //   updated_at: data.updated_at,
    // });
  },
});
