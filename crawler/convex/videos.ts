import { mutation, query } from './_generated/server'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { getUpdatedValues } from './utils'
import { data as categories } from '@/hooks/useCategories'
import TopVideosDto from '@/videos/dtos/topVideosDto'
import { ITopVideosWithCategory } from '@/videos/types'

export const updateVideos = mutation({
  args: {
    description: v.string(),
    duration: v.string(),
    image: v.optional(v.string()),
    k_id: v.string(),
    k_revenue: v.number(),
    k_sales: v.number(),
    main_category: v.optional(v.string()),
    tt_account: v.optional(v.string()),
    views: v.number(),
    storage_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingVideo = await ctx.db
      .query('videos')
      .filter((q) => q.eq(q.field('k_id'), args.k_id))
      .first()

    if (existingVideo) {
      const updates = getUpdatedValues({
        currentData: existingVideo,
        newData: args,
      })

      await ctx.db.patch(existingVideo._id, {
        ...updates,
        updated_at: new Date().toISOString(),
      })
      return { id: existingVideo._id, status: 'updated' }
    }

    const result = await ctx.db.insert('videos', {
      ...args,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })

    return { id: result, status: 'added' }
  },
})

export const updateVideoCategory = mutation({
  args: {
    id: v.id('videos'),
    main_category: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      main_category: args.main_category,
      updated_at: new Date().toISOString(),
    })
  },
})

const fetchVideosSince = async (ctx: any, daysAgo: number) => {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - daysAgo)
  return ctx.db
    .query('videos')
    .withIndex('by_k_revenue')
    .filter((q: any) => q.gte(q.field('updated_at'), cutoff.toISOString()))
    .order('desc')
    .collect()
}

export const getVideosWithPagination = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { paginationOpts } = args

    const videos = await ctx.db
      .query('videos')
      .withIndex('by_k_revenue')
      .order('desc')
      .paginate(paginationOpts)

    const resultsDto: { videos: ITopVideosWithCategory[] } = new TopVideosDto(
      videos?.page
    )

    const videosWithImages = await Promise.all(
      resultsDto?.videos?.map(async (video) => {
        video['image'] = video.image
          ? await ctx.storage.getUrl(video.image)
          : null
        return video
      })
    )

    // Add the category name to the store
    const videosWithCategories = videosWithImages.map((video) => {
      video['category_name'] =
        categories.find((category) => category.id === video.category_id)
          ?.label || null
      delete video.category_id
      return video
    })

    return {
      page: videosWithCategories,
      isDone: videos?.isDone,
      continueCursor: videos?.continueCursor,
      splitCursor: videos?.splitCursor,
      pageStatus: videos?.pageStatus,
    }
  },
})

export const getAllVideos = query({
  handler: async (ctx) => {
    let videos: any[] = []
    let days = 14
    const MAX_DAYS = 45
    const STEP = 14

    while (videos.length === 0) {
      videos = await fetchVideosSince(ctx, days)
      if (videos.length > 0 || days >= MAX_DAYS) break
      days = Math.min(days + STEP, MAX_DAYS)
    }

    const resultsDto: { videos: ITopVideosWithCategory[] } = new TopVideosDto(
      videos
    )

    // Add the image url to the video
    const videosWithImages = await Promise.all(
      resultsDto?.videos?.map(async (video) => {
        video['image'] = video.image
          ? await ctx.storage.getUrl(video.image)
          : null
        return video
      })
    )

    // Add the category name to the store
    const videosWithCategories = videosWithImages.map((video) => {
      video['category_name'] =
        categories.find((category) => category.id === video.category_id)
          ?.label || null
      return video
    })

    return videosWithCategories
  },
})

export const getVideosCount = query({
  handler: async (ctx) => {
    const videos = await ctx.db.query('videos').collect()
    return videos.map((row) => row.k_id)
  },
})

export const getVideoById = query({
  args: { id: v.id('videos') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

const fetchVideosByIdSince = async (ctx: any, daysAgo: number, paginationOpts: any) => {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - daysAgo)
  return ctx.db
    .query('videos')
    .filter((q: any) => q.gte(q.field('updated_at'), cutoff.toISOString()))
    .order('asc')
    .paginate(paginationOpts)
}

export const getVideoByIdWithPagination = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { paginationOpts } = args
    let videos: any = null
    let days = 14
    const MAX_DAYS = 45
    const STEP = 14

    while (true) {
      videos = await fetchVideosByIdSince(ctx, days, paginationOpts)
      if (videos?.page?.length > 0 || days >= MAX_DAYS) break
      days = Math.min(days + STEP, MAX_DAYS)
    }

    return {
      page: videos?.page,
      isDone: videos?.isDone,
      continueCursor: videos?.continueCursor,
      splitCursor: videos?.splitCursor,
      pageStatus: videos?.pageStatus,
    }
  },
})

export const updateTranscription = mutation({
  args: { id: v.id('videos'), transcription: v.string() },
  handler: async (ctx, { id, transcription }) => {
    await ctx.db.patch(id, {
      transcription,
      updated_at: new Date().toISOString(),
    })
  },
})
