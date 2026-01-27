import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addCategory = mutation({
  args: {
    data: v.object({
      main_category_id: v.string(),
      main_category_name: v.string(),
      second_category_id: v.string(),
      second_category_name: v.string(),
      third_category_id: v.string(),
      third_category_name: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { data } = args;

    const existingCategory = await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("main_category_id"), data.main_category_id))
      .filter((q) =>
        q.eq(q.field("second_category_id"), data.second_category_id)
      )
      .filter((q) => q.eq(q.field("third_category_id"), data.third_category_id))
      .first();

    // Don't do anything if the category already exists
    if (!existingCategory) {
      await ctx.db.insert("categories", {
        main_category_id: data.main_category_id,
        main_category_name: data.main_category_name,
        second_category_id: data.second_category_id,
        second_category_name: data.second_category_name,
        third_category_id: data.third_category_id,
        third_category_name: data.third_category_name,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    }
  },
});
