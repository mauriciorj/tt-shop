import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { data as categories } from '@/hooks/useCategories'
import { verifyApiKey } from '@/src/features/api-keys/lib/verifyApiKey'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: NextRequest) {
  const clerkId = await verifyApiKey(request)
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = request.nextUrl
  const limit = Math.min(
    Math.max(Number(searchParams.get('limit') ?? 10), 1),
    100
  )
  const cursor = searchParams.get('cursor') ?? null

  try {
    const result = await convex.query(api.videos.getVideos, {
      paginationOpts: { numItems: limit, cursor },
    })

    const data = result.page.map((video) => ({
      video_id: video.video_id,
      description: video.description,
      revenue: video.revenue,
      sales: video.sales,
      views: video.views,
      duration: video.duration,
      image: video.image,
      category:
        categories.find((c) => c.id === video.category_id)?.label ?? null,
      tt_account: video.tt_account ?? null,
    }))

    return NextResponse.json({
      data,
      total: data.length,
      cursor: result.continueCursor,
      isDone: result.isDone,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}
