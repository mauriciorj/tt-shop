import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
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

export const toggleSavedVideo = mutation({
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

export const getSavedVideos = query({
  args: { clerk_id: v.string() },
  handler: async (ctx, { clerk_id }) => {
    const saved = await ctx.db
      .query('savedVideos')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerk_id))
      .collect()

    const videoIds = saved.map((s) => s.video_k_id)

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
