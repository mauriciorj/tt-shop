import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    table_id: v.string(),
    k_id: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("app", {
      storageId: args.storageId,
      table_id: args.table_id,
      k_id: args.k_id,
      source: args.source,
      format: "image",
    });
  },
});
