import {
  clerkMiddleware,
  clerkClient,
  createRouteMatcher,
} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/billing(.*)',
  '/store(.*)',
  '/stores(.*)',
  '/payment(.*)',
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

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const subscriptionStatus = (
    user.publicMetadata as { subscriptionStatus?: string }
  )?.subscriptionStatus

  if (subscriptionStatus === 'past_due') {
    const url = req.nextUrl.clone()
    url.pathname = '/subscription'
    return NextResponse.redirect(url)
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
