import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import { getProductByName } from '@/actions/product'
import CreatorsTable from '@/components/creatorsTable'
import CallToAction from '@/components/homepage/callToAction'
import VideosTable from '@/components/videosTable'
import CardsStats from '@/product/components/cardsStats'
import Header from '@/product/components/header'
import LineChart from '@/product/components/lineChart'
import { ICreatorDto, IVideoDto } from '@/types/index'
import { normalizeUrl } from '@/utils/string'

export const revalidate = false

export async function generateStaticParams() {
  const products = await fetchQuery(api.products.getAllProducts)
  return products.map((product) => ({
    id: normalizeUrl(product.name) as string,
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductByName(id)

  if (!product) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Product not found.</p>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <div className="container mx-auto px-4 py-8">
          <Header product={product} isBlog={true} />
          <CardsStats product={product} />
          <LineChart product={product} />
          <CreatorsTable
            data={product.top_creators as ICreatorDto[]}
            isBlog={true}
          />
          <VideosTable data={product.top_videos as IVideoDto[]} isBlog={true} />
          <CallToAction />
        </div>
      </main>
    </div>
  )
}
