import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://shopradar.com.br',
      lastModified: new Date(),
    },
    {
      url: 'https://shopradar.com.br/stores',
      lastModified: new Date(),
    },
    {
      url: 'https://shopradar.com.br/products',
      lastModified: new Date(),
    },
    {
      url: 'https://shopradar.com.br/videos',
      lastModified: new Date(),
    },
    {
      url: 'https://shopradar.com.br/docs',
      lastModified: new Date(),
    },
    {
      url: 'https://shopradar.com.br/suporte',
      lastModified: new Date(),
    },
    {
      url: 'https://shopradar.com.br/sobre',
      lastModified: new Date(),
    },
    {
      url: 'https://shopradar.com.br/contato',
      lastModified: new Date(),
    },
    {
      url: 'https://shopradar.com.br/privacidade',
      lastModified: new Date(),
    },
    {
      url: 'https://shopradar.com.br/termos',
      lastModified: new Date(),
    },
  ]
}
