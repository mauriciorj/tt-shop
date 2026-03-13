'use client'

import { useRouter } from 'next/navigation'
import {
  Store,
  Video,
  Heart,
  Eye,
  DollarSign,
  Package,
  ShoppingCart,
  Star,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import UseUser from '@/hooks/useUser'
import { normalizeUrl } from '@/utils/string'

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

const Saved = () => {
  const router = useRouter()
  const { id } = UseUser()

  const savedVideos =
    useQuery(api.savedVideos.getSavedVideos, id ? { clerk_id: id } : 'skip') ??
    []

  const savedProducts =
    useQuery(
      api.savedProducts.getSavedProducts,
      id ? { clerk_id: id } : 'skip'
    ) ?? []

  const savedStores =
    useQuery(api.savedStores.getSavedStores, id ? { clerk_id: id } : 'skip') ??
    []

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedStores.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  Nenhuma loja salva ainda.
                </p>
              )}
              {savedStores.map((store: any) => (
                <div
                  key={store.k_id ?? store.name}
                  onClick={() =>
                    router.push(`/store/${normalizeUrl(store.name)}`)
                  }
                  className="glass-card rounded-2xl p-5 cursor-pointer hover:border-primary/40 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {store.image && (
                      <img
                        src={store.image}
                        alt={store.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {store.name}
                      </h3>
                      {store.category_name && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {store.category_name}
                        </Badge>
                      )}
                    </div>
                    <Heart className="h-5 w-5 text-primary fill-primary shrink-0" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground">Receita</p>
                      <p className="font-semibold text-sm">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          notation: 'compact',
                        }).format(store.revenue)}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground">Vendas</p>
                      <p className="font-semibold text-sm">
                        {formatNumber(store.sales)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{store.type}</span>
                    <div
                      className={`flex items-center gap-1 font-medium ${
                        store.revenue_growth_rate >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {store.revenue_growth_rate >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {store.revenue_growth_rate > 0 ? '+' : ''}
                      {store.revenue_growth_rate}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedProducts.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  Nenhum produto salvo ainda.
                </p>
              )}
              {savedProducts.map((product: any) => (
                <div
                  key={product.k_id ?? product.name}
                  onClick={() =>
                    router.push(`/product/${normalizeUrl(product.name)}`)
                  }
                  className="glass-card rounded-2xl p-5 cursor-pointer hover:border-primary/40 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      {product.category_name && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {product.category_name}
                        </Badge>
                      )}
                    </div>
                    <Heart className="h-5 w-5 text-primary fill-primary shrink-0" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground">Receita</p>
                      <p className="font-semibold text-sm">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          notation: 'compact',
                        }).format(product.revenue)}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground">Vendas</p>
                      <p className="font-semibold text-sm">
                        {formatNumber(product.sales)}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        Avaliação
                      </p>
                      <p className="font-semibold text-sm">
                        {product.product_rating}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(product.unit_price)}
                    </span>
                    <div
                      className={`flex items-center gap-1 font-medium ${
                        product.revenue_growth_rate >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {product.revenue_growth_rate >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {product.revenue_growth_rate > 0 ? '+' : ''}
                      {product.revenue_growth_rate}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedVideos.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  Nenhum vídeo salvo ainda.
                </p>
              )}
              {savedVideos.map((video: any) => (
                <div
                  key={video.video_id}
                  className="glass-card rounded-2xl overflow-hidden group"
                >
                  <div className="relative">
                    {video.image && (
                      <img
                        src={video.image}
                        alt={video.description}
                        className="w-full aspect-video object-cover"
                      />
                    )}
                    <div className="absolute top-2 right-2">
                      <Heart className="h-5 w-5 text-primary fill-primary" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {video.description}
                    </h3>
                    <div className="flex items-center gap-1 mb-3">
                      {video.category_name && (
                        <Badge variant="secondary" className="text-xs">
                          {video.category_name}
                        </Badge>
                      )}
                      {video.tt_account && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          {video.tt_account}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="flex items-center gap-1 justify-center text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {formatNumber(video.views)}
                      </div>
                      <div className="flex items-center gap-1 justify-center text-xs text-muted-foreground">
                        <ShoppingCart className="h-3 w-3" />
                        {formatNumber(video.sales)}
                      </div>
                      <div className="flex items-center gap-1 justify-center text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        {formatNumber(video.revenue)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default Saved
