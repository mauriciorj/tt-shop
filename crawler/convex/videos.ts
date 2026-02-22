import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { paginationOptsValidator } from 'convex/server'
import { getUpdatedValues } from './utils'
import TopVideosDto from '@/videos/dtos/topVideosDto'
import { ITopVideos, ITopVideosWithCategory } from '@/videos/types'

export const updateVideos = mutation({
  args: {
    tt_account: v.optional(v.string()),
    storage_id: v.optional(v.string()),
    description: v.string(),
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

export const getVideosCount = query({
  handler: async (ctx) => {
    const videos = await ctx.db.query('videos').collect()
    return videos.map((row) => row.k_id)
  },
})
