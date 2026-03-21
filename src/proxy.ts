import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'

const isProtectedRoute = createRouteMatcher([
  '/billing(.*)',
  '/store(.*)',
  '/stores(.*)',
  '/product(.*)',
  '/products(.*)',
  '/saved(.*)',
  '/subscription(.*)',
  '/videos(.*)',
])

const isPastDueExempt = createRouteMatcher([
  '/subscription(.*)',
  '/canceled(.*)',
  '/success(.*)',
  '/api(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()

  if (isPastDueExempt(req)) return

  const { userId } = await auth()
  if (!userId) return

  const CACHE_COOKIE = 'x-sub-status'
  const CACHE_TTL_SECONDS = 60 * 5 // 5 minutes

  let subscriptionStatus = req.cookies.get(CACHE_COOKIE)?.value

  if (!subscriptionStatus) {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
    const dbUser = await convex.query(api.users.getUserByClerkId, {
      clerk_id: userId,
    })
    subscriptionStatus = dbUser?.subscription_status ?? 'unknown'
  }

  if (subscriptionStatus === 'past_due') {
    const url = req.nextUrl.clone()
    url.pathname = '/subscription'
    return NextResponse.redirect(url)
  }

  const res = NextResponse.next()
  res.cookies.set(CACHE_COOKIE, subscriptionStatus, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: CACHE_TTL_SECONDS,
    path: '/',
  })
  return res
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
