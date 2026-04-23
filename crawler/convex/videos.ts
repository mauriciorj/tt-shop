import { mutation, query } from './_generated/server'
import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { LIMITS } from '@/businessRules/index'
import { api } from './_generated/api'
import { getUpdatedValues } from './utils'
import { data as categories } from '@/hooks/useCategories'
import TopVideosDto from '@/videos/dtos/topVideosDto'
import { ITopVideosWithCategory } from '@/videos/types'

export const getSavedVideoById = query({
  args: { clerk_id: v.string() },
  handler: async (ctx, { clerk_id }) => {
    const saved = await ctx.db
      .query('savedVideos')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerk_id))
      .collect()
    return saved.map((s) => s.video_k_id)
  },
})

export const getSavedVideos = query({
  args: { clerk_id: v.string() },
  handler: async (ctx, { clerk_id }) => {
    const videoIds = await ctx.runQuery(api.videos.getSavedVideoById, {
      clerk_id: clerk_id,
    })

    const videos = await ctx.db.query('videos').collect()
    const filteredVideos = videos.filter((v) => videoIds.includes(v.k_id))

    const resultsDto: { videos: ITopVideosWithCategory[] } = new TopVideosDto(
      filteredVideos
    )

    const videosWithImages = await Promise.all(
      resultsDto.videos.map(async (video) => {
        video['image'] = video.image
          ? await ctx.storage.getUrl(video.image)
          : null
        return video
      })
    )

    return videosWithImages
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
  handler: async (ctx, args) => {
    const { id } = args
    return await ctx.db.get(id)
  },
})

export const getVideos = query({
  args: { clerk_id: v.string() },
  handler: async (ctx, args) => {
    const { clerk_id } = args

    let videos: any[] = []
    let days = LIMITS.VIDEOS_FROM_PERIOD_OF_DAYS
    const MAX_DAYS = LIMITS.VIDEOS_FROM_PERIOD_OF_DAYS_MAX_LIMIT
    const STEP = LIMITS.VIDEOS_FROM_PERIOD_OF_DAYS_STEP

    while (videos.length === 0) {
      videos = await ctx.runQuery(api.videos.getVideosSince, {
        daysAgo: days,
      })
      if (videos.length > 0 || days >= MAX_DAYS) break
      days = Math.min(days + STEP, MAX_DAYS)
    }

    const resultsDto: { videos: ITopVideosWithCategory[] } = new TopVideosDto(
      videos
    )

    const savedVideoIds = await ctx.runQuery(api.videos.getSavedVideoById, {
      clerk_id: clerk_id,
    })

    // Add to video: image url, category name and saved status
    const finalVideos = await Promise.all(
      resultsDto?.videos?.map(async (video) => {
        video['image'] = video.image
          ? await ctx.storage.getUrl(video.image)
          : null
        video['category_name'] =
          categories.find((category) => category.id === video.category_id)
            ?.label || null
        video['saved'] = video?.video_id
          ? savedVideoIds?.includes(video.video_id!)
          : false
        return video
      })
    )

    return finalVideos
  },
})

export const getVideosSince = query({
  args: { daysAgo: v.number() },
  handler: async (ctx, args) => {
    const { daysAgo } = args
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - daysAgo)
    return ctx.db
      .query('videos')
      .withIndex('by_k_revenue')
      .filter((q: any) => q.gte(q.field('updated_at'), cutoff.toISOString()))
      .order('desc')
      .collect()
  },
})

export const getVideosSinceWithPagination = query({
  args: { daysAgo: v.number(), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { daysAgo, paginationOpts } = args
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - daysAgo)
    return ctx.db
      .query('videos')
      .filter((q: any) => q.gte(q.field('updated_at'), cutoff.toISOString()))
      .order('asc')
      .paginate(paginationOpts)
  },
})

export const getVideosWithPagination = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { paginationOpts } = args

    let videos: any = null
    let days = LIMITS.VIDEOS_FROM_PERIOD_OF_DAYS
    const MAX_DAYS = LIMITS.VIDEOS_FROM_PERIOD_OF_DAYS_MAX_LIMIT
    const STEP = LIMITS.VIDEOS_FROM_PERIOD_OF_DAYS_STEP

    while (true) {
      videos = await ctx.runQuery(api.videos.getVideosSinceWithPagination, {
        daysAgo: days,
        paginationOpts,
      })
      if (videos?.page?.length > 0 || days >= MAX_DAYS) break
      days = Math.min(days + STEP, MAX_DAYS)
    }

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

export const updateVideoTranscription = mutation({
  args: { id: v.id('videos'), transcription: v.string() },
  handler: async (ctx, args) => {
    const { id, transcription } = args
    await ctx.db.patch(id, {
      transcription,
      updated_at: new Date().toISOString(),
    })
  },
})

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

export const updateSavedVideo = mutation({
  args: { clerk_id: v.string(), video_k_id: v.string() },
  handler: async (ctx, { clerk_id, video_k_id }) => {
    const existing = await ctx.db
      .query('savedVideos')
      .withIndex('by_clerk_id_video_k_id', (q) =>
        q.eq('clerk_id', clerk_id).eq('video_k_id', video_k_id)
      )
      .first()

    if (existing) {
      await ctx.db.delete(existing._id)
      return { saved: false }
    }

    await ctx.db.insert('savedVideos', {
      clerk_id,
      video_k_id,
      created_at: new Date().toISOString(),
    })
    return { saved: true }
  },
})
