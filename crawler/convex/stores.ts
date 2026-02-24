import { mutation, query } from './_generated/server'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { getUpdatedValues } from './utils'
import CreatorDto from '@/dtos/creator'
import ProductDto from '@/dtos/product'
import VideoDto from '@/dtos/video'
import { data as categories } from '@/hooks/useCategories'
import StoreDto from '@/store/dtos/store'
import { IStoreWithCategory } from '@/store/types'
import TopStoresDto from '@/stores/dtos/topStores'
import { IStoresWithCategory } from '@/stores/types'
import { ICreatorDto, IProductDto, IVideoDto } from '@/types/index'
import { normalizeUrl } from '@/utils/string'

export const addStore = mutation({
  args: {
    country: v.string(),
    name: v.string(),
    name_url: v.optional(v.string()),
    storage_id: v.optional(v.string()),
    type: v.string(),
    main_category: v.string(),
    second_category: v.string(),
    third_category: v.string(),
    unit_price: v.number(),
    k_id: v.string(),
    k_revenue: v.number(),
    k_revenue_history: v.array(v.number()),
    k_revenue_history_14_days: v.optional(v.array(v.number())),
    k_revenue_history_7_days: v.optional(v.array(v.number())),
    k_revenue_growth_rate: v.number(),
    k_sales: v.number(),
  },
  handler: async (ctx, args) => {
    const queryResult = await ctx.db
      .query('stores')
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

    const result = await ctx.db.insert('stores', {
      ...args,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })
    return { id: result, status: 'added' }
  },
})

export const getAllStores = query({
  handler: async (ctx) => {
    const stores = await ctx.db.query('stores').order('asc').collect()

    const resultsDto: { stores: IStoresWithCategory[] } = new TopStoresDto(
      stores
    )

    // Add the image url to the store
    const storesWithImages = await Promise.all(
      resultsDto?.stores?.map(async (store) => {
        store['image'] = store.image
          ? await ctx.storage.getUrl(store.image)
          : null
        return store
      })
    )

    // Add the category name to the store
    const storesWithCategories = storesWithImages.map((store) => {
      store['category_name'] =
        categories.find((category) => category.id === store.category_id)
          ?.label || null
      return store
    })

    return storesWithCategories
  },
})

export const getStores = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { paginationOpts } = args

    const stores = await ctx.db
      .query('stores')
      .order('asc')
      .paginate(paginationOpts)

    const resultsDto: { stores: IStoresWithCategory[] } = new TopStoresDto(
      stores?.page
    )

    const storesWithImages = await Promise.all(
      resultsDto?.stores?.map(async (store) => {
        store['image'] = store.image
          ? await ctx.storage.getUrl(store.image)
          : null
        return store
      })
    )

    return {
      page: storesWithImages,
      isDone: stores?.isDone,
      continueCursor: stores?.continueCursor,
      splitCursor: stores?.splitCursor,
      pageStatus: stores?.pageStatus,
    }
  },
})

export const getStoreByKId = query({
  args: { k_id: v.string() },
  handler: async (ctx, args) => {
    const { k_id } = args

    return await ctx.db
      .query('stores')
      .filter((q) => q.eq(q.field('k_id'), k_id))
      .first()
  },
})

export const getStoreByName = query({
  args: { name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { name } = args

    if (!name) {
      return null
    }

    // TODO: create a name_url field in stores table
    const getAllStores = await ctx.db.query('stores').collect()

    const getStore = getAllStores.find(
      (store) => normalizeUrl(store.name) === name
    )

    const storeDto: { store: IStoreWithCategory | null } = new StoreDto(
      getStore
    )

    if (!storeDto?.store) {
      return null
    }

    if (storeDto?.store?.image) {
      storeDto.store.image = await ctx.storage.getUrl(storeDto.store.image)
    }

    let getTopCreators: ICreatorDto[] = []
    if (
      storeDto.store?.top_creators &&
      storeDto.store?.top_creators?.length > 0
    ) {
      await Promise.all(
        storeDto.store?.top_creators?.map(async (creator) => {
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

    let getTopProducts: IProductDto[] = []
    if (
      storeDto.store?.top_products &&
      storeDto.store?.top_products?.length > 0
    ) {
      await Promise.all(
        storeDto.store?.top_products?.map(async (product) => {
          const getProduct = await ctx.db
            .query('products')
            .filter((q) => q.eq(q.field('k_id'), product as string))
            .first()

          if (getProduct) {
            const productDto: { product: IProductDto | null } = new ProductDto(
              getProduct
            )
            let image = null
            if (productDto.product?.storage_id) {
              image = await ctx.storage.getUrl(productDto.product.storage_id)
            }
            delete productDto.product?.storage_id
            getTopProducts.push({
              ...productDto.product!,
              image,
            })
          }
        })
      )
    }

    let getTopVideos: IVideoDto[] = []
    if (storeDto.store?.top_videos && storeDto.store?.top_videos?.length > 0) {
      await Promise.all(
        storeDto.store?.top_videos?.map(async (video) => {
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

    delete storeDto.store?.top_creators
    storeDto.store.top_creators = getTopCreators

    delete storeDto.store?.top_products
    storeDto.store.top_products = getTopProducts

    delete storeDto.store?.top_videos
    storeDto.store.top_videos = getTopVideos

    return storeDto.store
  },
})

export const updateStore = mutation({
  args: {
    id: v.id('stores'),
    k_id: v.string(),
    k_top_creators: v.array(v.string()),
    k_top_products: v.array(v.string()),
    k_top_videos: v.array(v.string()),
    k_day_sales: v.number(),
    k_day_revenue: v.number(),
  },
  handler: async (ctx, args) => {
    const queryResult = await ctx.db
      .query('stores')
      .filter((q) => q.eq(q.field('_id'), args.id))
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
