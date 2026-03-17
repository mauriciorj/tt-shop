import type { MetadataRoute } from 'next'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { normalizeUrl } from '@/utils/string'

const BASE_URL = 'https://useshopradar.com.br'

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date() },
  { url: `${BASE_URL}/stores`, lastModified: new Date() },
  { url: `${BASE_URL}/products`, lastModified: new Date() },
  { url: `${BASE_URL}/videos`, lastModified: new Date() },
  { url: `${BASE_URL}/docs`, lastModified: new Date() },
  { url: `${BASE_URL}/suporte`, lastModified: new Date() },
  { url: `${BASE_URL}/sobre`, lastModified: new Date() },
  { url: `${BASE_URL}/contact`, lastModified: new Date() },
  { url: `${BASE_URL}/privacidade`, lastModified: new Date() },
  { url: `${BASE_URL}/termos`, lastModified: new Date() },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stores, products, videos] = await Promise.all([
    fetchQuery(api.stores.getAllStores),
    fetchQuery(api.products.getAllProducts),
    fetchQuery(api.videos.getAllVideos),
  ])

  const storeRoutes: MetadataRoute.Sitemap = stores.map((store) => ({
    url: `${BASE_URL}/blog/store/${normalizeUrl(store.name)}`,
    lastModified: new Date(),
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/blog/product/${normalizeUrl(product.name)}`,
    lastModified: new Date(),
  }))

  const videoRoutes: MetadataRoute.Sitemap = videos
    .filter((video) => !!video.video_id)
    .map((video) => ({
      url: `${BASE_URL}/blog/video/${video.video_id}`,
      lastModified: new Date(),
    }))

  return [...staticRoutes, ...storeRoutes, ...productRoutes, ...videoRoutes]
}
