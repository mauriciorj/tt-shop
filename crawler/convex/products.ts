import { mutation, query } from './_generated/server'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { getUpdatedValues } from './utils'
import { data as categories } from '@/hooks/useCategories'
import ProductDto from '@/product/dtos/product'
import TopProductsDto from '@/products/dtos/topProducts'
import { IProductsWithCategory } from '@/products/types'
import { normalizeUrl } from '@/utils/string'

export const addProduct = mutation({
  args: {
    country: v.string(),
    k_id: v.string(),
    k_creator_conversion_ratio: v.number(),
    k_revenue: v.number(),
    k_revenue_growth_rate: v.number(),
    k_revenue_history: v.array(v.number()),
    k_revenue_history_14_days: v.optional(v.array(v.number())),
    k_revenue_history_7_days: v.optional(v.array(v.number())),
    k_sales: v.number(),
    launch_date: v.string(),
    main_category: v.string(),
    name: v.string(),
    name_url: v.optional(v.string()),
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

export const getAllProducts = query({
  handler: async (ctx) => {
    const products = await ctx.db.query('products').order('asc').collect()

    const resultsDto: { products: IProductsWithCategory[] } = new TopProductsDto(
      products
    )

    // Add the image url to the product
    const productsWithImages = await Promise.all(
      resultsDto?.products?.map(async (product) => {
        product['image'] = product.image
          ? await ctx.storage.getUrl(product.image)
          : null
        return product
      })
    )

    // Add the category name to the store
    const productsWithCategories = productsWithImages.map((product) => {
      product['category_name'] =
        categories.find((category) => category.id === product.category_id)
          ?.label || null
      return product
    })

    return productsWithCategories
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

    const resultsDto: { products: IProductsWithCategory[] } = new TopProductsDto(
      products?.page
    )

    const productsWithImages = await Promise.all(
      resultsDto?.products?.map(async (product) => {
        product['image'] = product.image
          ? await ctx.storage.getUrl(product.image)
          : null
        return product
      })
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

export const getProductByName = query({
  args: { name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { name } = args

    if (!name) {
      return null
    }

    // TODO: create a name_url field in stores table
    const getAllProducts = await ctx.db.query('products').collect()

    const getProduct = getAllProducts.find(
      (product) => normalizeUrl(product.name) === name
    )

    const productDto: { product: IProductsWithCategory | null } = new ProductDto(
      getProduct
    )

    if (productDto?.product?.image) {
      productDto.product.image = await ctx.storage.getUrl(
        productDto.product.image
      )
    }

    return productDto.product
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
