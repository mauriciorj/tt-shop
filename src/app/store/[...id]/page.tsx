'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CardsStats from '@/store/components/cardsStats'
import CreatorsTable from '@/store/components/creatorsTable'
import Header from '@/store/components/header'
import LineChart from '@/store/components/lineChart'
import NotFoundStore from '@/store/components/notFoundStore'
import ProductsTable from '@/store/components/productsTable'
import VideosTable from '@/store/components/videosTable'
import useStore from '@/store/hooks/useStore'
import { ICreatorDto, IProductDto, IVideoDto } from '@/types/index'

const StoreDetail = () => {
  const { id } = useParams()
  const router = useRouter()

  const { store, setName } = useStore()

  useEffect(() => {
    if (id?.[0]) {
      setName(id[0])
    }
  }, [id])

  // TODO: Add loading state
  if (!store) {
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
            Back to Stores
          </Button>

          {/* Store Header */}
          <Header store={store} />

          {/* Stats Grid */}
          <CardsStats store={store} />

          {/* Line Chart */}
          <LineChart store={store} />

          {/* Products Table */}
          <ProductsTable data={store.top_products as IProductDto[]} />

          {/* Creators Table */}
          <CreatorsTable data={store.top_creators as ICreatorDto[]} />

          {/* Videos Table */}
          <VideosTable data={store.top_videos as IVideoDto[]} />
        </div>
      </main>
    </div>
  )
}

export default StoreDetail
