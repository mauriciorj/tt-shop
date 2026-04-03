'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Loading from './loading'
import CreatorsTable from '@/components/creatorsTable'
import VideosTable from '@/components/videosTable'
import { Button } from '@/components/ui/button'
import CardsStats from '@/src/features/products/components/cardsStats'
import LineChart from '@/src/features/products/components/lineChart'
import NotFoundProduct from '@/src/features/products/components/notFoundProduct'
import useProduct from '@/src/features/products/hooks/useProduct'
import UseUser from '@/hooks/useUser'
import Header from '@/src/features/products/components/header'
import { ICreatorDto, IVideoDto } from '@/types/index'

const ProductDetail = () => {
  const { id } = useParams()
  const router = useRouter()

  const { isLoading, product, setName } = useProduct()
  const { isFreeUser, id: clerkId } = UseUser()

  useEffect(() => {
    if (id?.[0]) {
      setName(id[0])
    }
  }, [id])

  if (!isLoading && !product) {
    return <NotFoundProduct />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/stores')}
            className="mb-6 hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para produtos
          </Button>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              {/* Product Header */}
              <Header product={product!} />

              {/* Stats Grid */}
              <CardsStats product={product!} />

              {/* Line Chart */}
              <LineChart product={product!} />

              {/* Creators Table */}
              <CreatorsTable data={product?.top_creators as ICreatorDto[]} />

              {/* Videos Table */}
              <VideosTable
                data={product?.top_videos as IVideoDto[]}
                isFreeUser={isFreeUser}
                clerkId={clerkId}
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default ProductDetail
