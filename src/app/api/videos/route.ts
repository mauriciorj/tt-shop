import { NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET() {
  try {
    const videos = await convex.query(api.videos.getAllVideos)

    const top10 = videos.slice(0, 10).map((video) => ({
      video_id: video.video_id,
      description: video.description,
      revenue: video.revenue,
      sales: video.sales,
      views: video.views,
      duration: video.duration,
      image: video.image,
      category: video.category_name ?? null,
      tt_account: video.tt_account ?? null,
    }))

    return NextResponse.json({ data: top10, total: top10.length })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}
