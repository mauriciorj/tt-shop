import { mutation, query } from './_generated/server'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { getUpdatedValues } from './utils'
import TopProducts from '@/products/dtos/topProducts'
import { IProductWithCategory } from '@/products/types'

export const addProduct = mutation({
  args: {
    country: v.string(),
    k_id: v.string(),
    k_creator_conversion_ratio: v.number(),
    k_revenue: v.number(),
    k_revenue_growth_rate: v.number(),
    k_revenue_history: v.array(v.number()),
    k_sales: v.number(),
    launch_date: v.string(),
    main_category: v.string(),
    name: v.string(),
    product_rating: v.number(),
    second_category: v.string(),
    storage_id: v.optional(v.string()),
    third_category: v.string(),
    unit_price: v.number(),
  },
  handler: async (ctx, args) => {
    const queryResult = await ctx.db
      .query('products')
      .filter((q) => q.eq(q.field('k_id'), args.k_id))
      .first()

    if (queryResult) {
      const updates = getUpdatedValues({
        currentData: queryResult,
        newData: args,
      })

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(queryResult._id, {
          ...updates,
          updated_at: new Date().toISOString(),
        })
      }

      return { id: queryResult._id, status: 'updated' }
    }

    const result = await ctx.db.insert('products', {
      ...args,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })
    return { id: result, status: 'created' }
  },
})

export const getProducts = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { paginationOpts } = args

    const products = await ctx.db
      .query('products')
      .order('asc')
      .paginate(paginationOpts)

    const resultsDto: { products: IProductWithCategory[] } = new TopProducts(
      products?.page,
    )

    const productsWithImages = await Promise.all(
      resultsDto?.products?.map(async (product) => {
        product['image'] = product.image
          ? await ctx.storage.getUrl(product.image)
          : null
        return product
      }),
    )

    return {
      page: productsWithImages,
      isDone: products?.isDone,
      continueCursor: products?.continueCursor,
      splitCursor: products?.splitCursor,
      pageStatus: products?.pageStatus,
    }
  },
})

export const getProductByKId = query({
  args: { k_id: v.string() },
  handler: async (ctx, args) => {
    const { k_id } = args

    return await ctx.db
      .query('products')
      .filter((q) => q.eq(q.field('k_id'), k_id))
      .first()
  },
})

export const updateProduct = mutation({
  args: {
    id: v.id('products'),
    k_id: v.string(),
    k_day_sales: v.number(),
    k_day_revenue: v.number(),
    k_top_creators: v.optional(v.array(v.string())),
    k_top_videos: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const queryResult = await ctx.db
      .query('products')
      .filter((q) => q.eq(q.field('k_id'), args.k_id))
      .first()

    if (queryResult) {
      const updates = getUpdatedValues({
        currentData: queryResult,
        newData: args,
      })

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(queryResult._id, {
          ...updates,
          updated_at: new Date().toISOString(),
        })
      }
      return queryResult
    }
  },
})
