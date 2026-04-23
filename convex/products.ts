import { mutation, query } from '@/convex/_generated/server'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { getUpdatedValues } from '@/convex/utils'
import CreatorDto from '@/dtos/creator'
import VideoDto from '@/dtos/video'
import { data as categories } from '@/hooks/useCategories'
import ProductDto from '@/src/features/products/dtos/product'
import TopProductsDto from '@/products/dtos/topProducts'
import { IProductWithCategory } from '@/products/types'
import { ICreatorDto, IVideoDto } from '@/types/index'
import { normalizeUrl } from '@/utils/string'

export const addProduct = mutation({
  args: {
    country: v.string(),
    image: v.optional(v.string()),
    k_id: v.string(),
    k_creator_conversion_ratio: v.number(),
    k_revenue: v.number(),
    k_revenue_14_days: v.optional(v.number()),
    k_revenue_7_days: v.optional(v.number()),
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

const fetchProductsSince = async (ctx: any, daysAgo: number) => {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - daysAgo)
  return ctx.db
    .query('products')
    .filter((q: any) => q.gte(q.field('updated_at'), cutoff.toISOString()))
    .order('asc')
    .collect()
}

export const getAllProducts = query({
  handler: async (ctx) => {
    let products: any[] = []
    let days = 14
    const MAX_DAYS = 45
    const STEP = 14

    while (products.length === 0) {
      products = await fetchProductsSince(ctx, days)
      if (products.length > 0 || days >= MAX_DAYS) break
      days = Math.min(days + STEP, MAX_DAYS)
    }

    const resultsDto: { products: IProductWithCategory[] } = new TopProductsDto(
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

export const getProductsWithPagination = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { paginationOpts } = args

    const products = await ctx.db
      .query('products')
      .withIndex('by_k_revenue')
      .order('desc')
      .paginate(paginationOpts)

    const resultsDto: { products: IProductWithCategory[] } = new TopProductsDto(
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

    const productsWithCategories = productsWithImages.map((product) => {
      product['category_name'] =
        categories.find((category) => category.id === product.category_id)
          ?.label || null
      delete product.category_id
      return product
    })

    return {
      page: productsWithCategories,
      isDone: products?.isDone,
      continueCursor: products?.continueCursor,
      splitCursor: products?.splitCursor,
      pageStatus: products?.pageStatus,
    }
  },
})

export const getProductsWithId = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { paginationOpts } = args

    const products = await ctx.db
      .query('products')
      .order('asc')
      .paginate(paginationOpts)

    return {
      page: products?.page,
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

    const productDto: { product: IProductWithCategory | null } = new ProductDto(
      getProduct
    )

    if (!productDto?.product) {
      return null
    }

    if (productDto?.product?.image) {
      productDto.product.image = await ctx.storage.getUrl(
        productDto.product.image
      )
    }

    const getTopCreators: ICreatorDto[] = []
    if (
      productDto.product?.top_creators &&
      productDto.product?.top_creators?.length > 0
    ) {
      await Promise.all(
        productDto.product?.top_creators?.map(async (creator) => {
          const getCreator = await ctx.db
            .query('creators')
            .filter((q) => q.eq(q.field('k_id'), creator as string))
            .first()

          if (getCreator) {
            const creatorDto: { creator: ICreatorDto | null } = new CreatorDto(
              getCreator
            )
            let image = null
            if (creatorDto.creator?.storage_id) {
              image = await ctx.storage.getUrl(creatorDto.creator.storage_id)
            }
            delete creatorDto.creator?.storage_id
            getTopCreators.push({
              ...creatorDto.creator!,
              image,
            })
          }
        })
      )
    }

    const getTopVideos: IVideoDto[] = []
    if (
      productDto.product?.top_videos &&
      productDto.product?.top_videos?.length > 0
    ) {
      await Promise.all(
        productDto.product?.top_videos?.map(async (video) => {
          const getVideo = await ctx.db
            .query('videos')
            .filter((q) => q.eq(q.field('k_id'), video as string))
            .first()

          if (getVideo) {
            const videoDto: { video: IVideoDto | null } = new VideoDto(getVideo)
            let image = null
            if (videoDto.video?.storage_id) {
              image = await ctx.storage.getUrl(videoDto.video.storage_id)
            }
            delete videoDto.video?.storage_id
            getTopVideos.push({
              ...videoDto.video!,
              image,
            })
          }
        })
      )
    }

    delete productDto.product?.top_creators
    productDto.product.top_creators = getTopCreators

    delete productDto.product?.top_videos
    productDto.product.top_videos = getTopVideos

    return productDto.product
  },
})

export const updateProduct = mutation({
  args: {
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
