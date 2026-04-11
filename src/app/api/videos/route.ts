import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { verifyApiKey } from '@/apiKeys/lib/verifyApiKey'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: NextRequest) {
  const clerkId = await verifyApiKey(request)
  if (!clerkId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const limitReached = await convex.query(api.userApiKeys.hasReachedLimit, {
    clerk_id: clerkId,
  })
  if (limitReached) {
    return NextResponse.json(
      { error: 'API call limit reached (1,000 requests)' },
      { status: 429 }
    )
  }

  const { searchParams } = request.nextUrl
  const limit = Math.min(
    Math.max(Number(searchParams.get('limit') ?? 10), 1),
    100
  )
  const cursor = searchParams.get('cursor') ?? null

  try {
    const result = await convex.query(api.videos.getVideosWithPagination, {
      paginationOpts: { numItems: limit, cursor },
    })

    await convex.mutation(api.userApiKeys.incrementUsage, { clerk_id: clerkId })

    return NextResponse.json({
      data: result.page,
      total: result.page.length,
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
