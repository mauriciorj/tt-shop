import type { Metadata } from 'next'
import ProductsContainer from '@/products/container'

export const metadata: Metadata = {
  title: 'ShopRadar – Produtos virais e vendas do TikTok Shop',
  description:
    'Descubra produtos que estão faturando no TikTok Shop. Veja vendas, vídeos virais e tendências para afiliados.',
  keywords: ['TikTok Shop', 'Produtos virais', 'Vendas', 'Afiliados'],
  openGraph: {
    title: 'ShopRadar – Produtos virais e vendas do TikTok Shop',
    description:
      'Descubra produtos que estão faturando no TikTok Shop. Veja vendas, vídeos virais e tendências para afiliados.',
    url: 'https://shopradar.com.br',
    siteName: 'ShopRadar',
    images: [],
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const Products = () => {
  return <ProductsContainer />
}

export default Products
