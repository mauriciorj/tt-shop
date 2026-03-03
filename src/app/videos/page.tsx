import type { Metadata } from 'next'
import VideosContainer from '@/videos/container'

export const metadata: Metadata = {
  title: 'ShopRadar – Encontre os melhores vídeos do TikTok Shop',
  description:
    'Descubra os melhores vídeos do TikTok Shop. Veja vendas, vídeos virais e tendências para afiliados.',
  keywords: ['TikTok Shop', 'Produtos virais', 'Vendas', 'Afiliados'],
  openGraph: {
    title: 'ShopRadar – Encontre os melhores vídeos do TikTok Shop',
    description:
      'Descubra os melhores vídeos do TikTok Shop. Veja vendas, vídeos virais e tendências para afiliados.',
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

const Videos = () => {
  return <VideosContainer />
}

export default Videos
