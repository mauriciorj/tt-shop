import type { MetadataRoute } from 'next'

const BASE_URL = 'https://useshopradar.com.br'

// Keep in sync with isProtectedRoute in src/proxy.ts
const disallowedPaths = [
  '/billing',
  '/store',
  '/stores',
  '/product',
  '/products',
  '/saved',
  '/subscription',
  '/videos',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: disallowedPaths,
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
