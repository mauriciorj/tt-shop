import type { Metadata } from 'next'
import Benefits from '@/components/homepage/benefits'
import CallToAction from '@/components/homepage/callToAction'
import Comparison from '@/components/homepage/comparison'
import Faq from '../features/common/components/homepage/faq'
import Hero from '@/components/homepage/hero'
import HowItWorks from '@/components/homepage/howItWorks'
import ProblemSection from '@/components/homepage/problem'
import SalesData from '@/components/homepage/salesData'
import SocialProof from '@/components/homepage/socialProof'
import Solution from '@/components/homepage/solution'
import Pricing from '@/components/homepage/pricing'

export const metadata: Metadata = {
  title: 'ShopRadar – Produtos e vídeos virais que vendem muito no TikTok Shop',
  description:
    'Descubra produtos e vídeos virais que estão vendendo muito no TikTok Shop. Veja vendas, vídeos virais e tendências para afiliados.',
  keywords: ['TikTok Shop', 'Produtos virais', 'Vendas', 'Afiliados'],
  openGraph: {
    title:
      'ShopRadar – Produtos e vídeos virais que vendem muito no TikTok Shop',
    description:
      'Descubra produtos e vídeos virais que estão vendendo muito no TikTok Shop. Veja vendas, vídeos virais e tendências para afiliados.',
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

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-col justify-center items-center">
        <Hero />

        <ProblemSection />

        <Solution />

        <HowItWorks />

        <SalesData />

        <Benefits />

        <SocialProof />

        <Comparison />

        <Pricing />

        <Faq />

        <CallToAction />
      </main>
    </div>
  )
}

export default Page
