import { mutation, query } from "./_generated/server";
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
    const file = await ctx.db
      .query("app")
      .filter((q) =>
        q.and(
          q.eq(q.field("table_id"), args.table_id),
          q.eq(q.field("k_id"), args.k_id),
          q.eq(q.field("source"), args.source)
        )
      )
      .first();

    if (file) {
      return await ctx.db.patch("app", file._id, {
        storageId: args.storageId,
      });
    }

    return await ctx.db.insert("app", {
      storageId: args.storageId,
      table_id: args.table_id,
      k_id: args.k_id,
      source: args.source,
      format: "image",
    });
  },
});

export const getFile = query({
  args: {
    table_id: v.string(),
    k_id: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const file = await ctx.db
      .query("app")
      .filter((q) =>
        q.and(
          q.eq(q.field("table_id"), args.table_id),
          q.eq(q.field("k_id"), args.k_id),
          q.eq(q.field("source"), args.source)
        )
      )
      .first();
    return file;
  },
});

export const getUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const deleteFile = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.delete(args.storageId);
  },
});
