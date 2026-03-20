import type { NextConfig } from 'next'

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
}

export default nextConfig
