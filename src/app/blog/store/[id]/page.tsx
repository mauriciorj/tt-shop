import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import { normalizeUrl } from '@/utils/string'
import { getStoreByName } from '@/actions/store'
import CallToAction from '@/components/homepage/callToAction'
import CreatorsTable from '@/components/creatorsTable'
import ProductsTable from '@/components/productsTable'
import VideosTable from '@/components/videosTable'
import CardsStats from '@/stores/components/cardsStats'
import Header from '@/stores/components/header'
import LineChart from '@/stores/components/lineChart'
import { ICreatorDto, IProductDto, IVideoDto } from '@/types/index'

export const revalidate = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const store = await getStoreByName(id)

  if (!store) {
    return {
      title: 'Produto não encontrado',
    }
  }

  return {
    title: `${store.name} no TikTok Shop: vendas e tendência`,
    description:
      'Descubra as melhores lojas do TikTok Shop. Veja vendas, vídeos virais e tendências para afiliados.',
    openGraph: {
      description:
        'Descubra as melhores lojas do TikTok Shop. Veja vendas, vídeos virais e tendências para afiliados.',
      images: [store.image],
      locale: 'pt_BR',
      title: `${store.name} no TikTok Shop`,
      type: 'article',
      siteName: 'UseShopRadar',
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
}

export async function generateStaticParams() {
  const stores = await fetchQuery(api.stores.getAllStores)
  return stores.map((store) => ({
    id: normalizeUrl(store.name) as string,
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const store = await getStoreByName(id)

  if (!store) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loja não encontrada.</p>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para blog
        </Link>
        <div className="container mx-auto px-4 py-8">
          <Header store={store} isBlog={true} />
          <CardsStats store={store} />
          <LineChart store={store} />
          <ProductsTable
            data={store?.top_products as IProductDto[]}
            isBlog={true}
          />
          <CreatorsTable
            data={store?.top_creators as ICreatorDto[]}
            isBlog={true}
          />
          <VideosTable data={store?.top_videos as IVideoDto[]} isBlog={true} />
          <CallToAction />
        </div>
      </main>
    </div>
  )
}
