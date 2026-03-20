'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import CreatorsTable from '@/components/creatorsTable'
import ProductsTable from '@/components/productsTable'
import VideosTable from '@/components/videosTable'
import { Button } from '@/components/ui/button'
import CardsStats from '@/store/components/cardsStats'
import Header from '@/store/components/header'
import LineChart from '@/store/components/lineChart'
import NotFoundStore from '@/store/components/notFoundStore'
import StoreDetailSkeleton from '@/store/components/storeDetailSkeleton'
import useStore from '@/store/hooks/useStore'
import UseUser from '@/hooks/useUser'
import { ICreatorDto, IProductDto, IVideoDto } from '@/types/index'

const StoreDetail = () => {
  const { id } = useParams()
  const router = useRouter()

  const { isLoading, store, setName } = useStore()
  const { isFreeUser, id: clerkId } = UseUser()

  useEffect(() => {
    if (id?.[0]) {
      setName(id[0])
    }
  }, [id])

  if (!isLoading && !store) {
    return <NotFoundStore />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push('/stores')}
            className="mb-6 hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para lojas
          </Button>

          {isLoading ? (
            <StoreDetailSkeleton />
          ) : (
            <>
              {/* Store Header */}
              <Header store={store!} />

              {/* Stats Grid */}
              <CardsStats store={store!} />

              {/* Line Chart */}
              <LineChart store={store!} />

              {/* Products Table */}
              <ProductsTable data={store?.top_products as IProductDto[]} />

              {/* Creators Table */}
              <CreatorsTable data={store?.top_creators as ICreatorDto[]} />

              {/* Videos Table */}
              <VideosTable
                data={store?.top_videos as IVideoDto[]}
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

export default StoreDetail
