import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from './_generated/server'
import { v } from 'convex/values'
import { paginationOptsValidator } from 'convex/server'
import { getUpdatedValues } from './utils'
import { data as categories } from '@/hooks/useCategories'
import TopVideosDto from '@/videos/dtos/topVideosDto'
import { ITopVideosWithCategory } from '@/videos/types'

export const updateVideos = mutation({
  args: {
    image: v.optional(v.string()),
    tt_account: v.optional(v.string()),
    storage_id: v.optional(v.string()),
    description: v.string(),
    main_category: v.string(),
    views: v.number(),
    duration: v.string(),
    k_id: v.string(),
    k_revenue: v.number(),
    k_sales: v.number(),
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

export const getVideos = query({
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

    return {
      page: videosWithImages,
      isDone: videos?.isDone,
      continueCursor: videos?.continueCursor,
      splitCursor: videos?.splitCursor,
      pageStatus: videos?.pageStatus,
    }
  },
})

export const getAllVideos = query({
  handler: async (ctx) => {
    const videos = await ctx.db
      .query('videos')
      .withIndex('by_k_revenue')
      .order('desc')
      .collect()

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

export const getVideoById = internalQuery({
  args: { id: v.id('videos') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

export const updateTranscription = internalMutation({
  args: { id: v.id('videos'), transcription: v.string() },
  handler: async (ctx, { id, transcription }) => {
    await ctx.db.patch(id, {
      transcription,
      updated_at: new Date().toISOString(),
    })
  },
})
