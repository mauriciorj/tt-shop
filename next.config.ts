import type { NextConfig } from 'next'

const convexHost = process.env.NEXT_PUBLIC_CONVEX_URL
  ? new URL(process.env.NEXT_PUBLIC_CONVEX_URL).hostname
  : ''

const securityHeaders = [
  // Prevent clickjacking — only allow framing from same origin
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // Prevent MIME-type sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self' data: 'unsafe-inline' 'unsafe-eval' blob:",
      // Next.js requires unsafe-inline for its runtime scripts; unsafe-eval for dev HMR
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.clerk.com https://*.clerk.accounts.dev https://clerk.useshopradar.com",
      // Tailwind/Radix inline styles
      "style-src 'self' 'unsafe-inline'",
      // Images: self + Convex storage + data URIs + blob
      `img-src 'self' data: blob: https://${convexHost} https://savory-ram-126.convex.cloud https://*.tiktokcdn.com https://*.tiktok.com https://images.unsplash.com https://*.clerk.com`,
      // Fonts
      "font-src 'self'",
      // API/WS connections: Convex (https + wss), Clerk, Stripe
      `connect-src 'self' https://${convexHost} wss://${convexHost} https://savory-ram-126.convex.cloud wss://savory-ram-126.convex.cloud https://*.clerk.com https://*.clerk.accounts.dev https://api.stripe.com https://*.useshopradar.com`,
      // Stripe checkout iframe
      'frame-src https://js.stripe.com https://hooks.stripe.com',
      // Deny all plugins (Flash, etc.)
      "object-src 'none'",
      // Restrict base tag
      "base-uri 'self'",
      // Workers
      "worker-src 'self' blob:",
    ]
      .join('; ')
      .trim(),
  },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_CONVEX_URL
      ? [
          {
            protocol: 'https',
            hostname: new URL(process.env.NEXT_PUBLIC_CONVEX_URL).hostname,
          },
          {
            protocol: 'https',
            hostname: 'savory-ram-126.convex.cloud',
          },
        ]
      : [],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
