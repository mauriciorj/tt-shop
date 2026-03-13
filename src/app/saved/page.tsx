'use client'

import { Store, Video, Heart, Package } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SavedStoreCard from '@/saved/components/SavedStoreCard'
import SavedStoreCardSkeleton from '@/saved/components/SavedStoreCardSkeleton'
import SavedProductCard from '@/saved/components/SavedProductCard'
import SavedProductCardSkeleton from '@/saved/components/SavedProductCardSkeleton'
import SavedVideoCard from '@/saved/components/savedVideoCard'
import SavedVideoCardSkeleton from '@/saved/components/SavedVideoCardSkeleton'
import UseSaved from '@/saved/hooks/useSaved'

const Saved = () => {
  const {
    savedVideos,
    savedVideosIsLoading,
    savedProducts,
    savedProductsIsLoading,
    savedStores,
    savedStoresIsLoading,
  } = UseSaved()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">
              Itens <span className="gradient-text">Salvos</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Suas lojas e vídeos favoritos em um só lugar
          </p>
        </div>
        <Tabs defaultValue="stores" className="animate-slide-up">
          <TabsList className="mb-6 bg-secondary/50 p-1 rounded-xl">
            <TabsTrigger
              value="stores"
              className="gap-2 rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Store className="h-4 w-4" />
              Lojas ({savedStores?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="gap-2 rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Package className="h-4 w-4" />
              Produtos ({savedProducts.length})
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="gap-2 rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Video className="h-4 w-4" />
              Vídeos ({savedVideos.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stores">
            {savedStoresIsLoading ? (
              <SavedStoreCardSkeleton cards={6} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedStores.length === 0 && (
                  <p className="text-muted-foreground col-span-full text-center py-8">
                    Nenhuma loja salva ainda.
                  </p>
                )}
                {savedStores.map((store: any) => (
                  <SavedStoreCard
                    key={store.k_id ?? store.name}
                    store={store}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="products">
            {savedProductsIsLoading ? (
              <SavedProductCardSkeleton cards={6} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedProducts.length === 0 && (
                  <p className="text-muted-foreground col-span-full text-center py-8">
                    Nenhum produto salvo ainda.
                  </p>
                )}
                {savedProducts.map((product: any) => (
                  <SavedProductCard
                    key={product.k_id ?? product.name}
                    product={product}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="videos">
            {savedVideosIsLoading ? (
              <SavedVideoCardSkeleton cards={6} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedVideos.length === 0 && (
                  <p className="text-muted-foreground col-span-full text-center py-8">
                    Nenhum vídeo salvo ainda.
                  </p>
                )}
                {savedVideos.map((video: any) => (
                  <SavedVideoCard key={video.video_id} video={video} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default Saved
