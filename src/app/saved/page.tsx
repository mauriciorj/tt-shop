'use client'

import { useRouter } from 'next/navigation'
import {
  Store,
  Video,
  Bookmark,
  Eye,
  DollarSign,
  ShoppingCart,
} from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockStores } from './mockStores'
import { mockVideos } from './mockVideos'
import { Badge } from '@/components/ui/badge'

const savedStores = mockStores.slice(0, 5)
const savedVideos = mockVideos.slice(0, 6)

const Saved = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Bookmark className="h-6 w-6 text-primary" />
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
              Lojas ({savedStores.length})
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
              {savedStores.map((store: any) => (
                <div
                  key={store.id}
                  onClick={() => router.push(`/store/${store.id}`)}
                  className="glass-card rounded-2xl p-5 cursor-pointer hover:border-primary/40 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={store.avatar}
                      alt={store.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {store.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {store.category}
                      </Badge>
                    </div>
                    <Bookmark className="h-4 w-4 text-primary fill-primary shrink-0" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground">
                        Seguidores
                      </p>
                      <p className="font-semibold text-sm">{store.followers}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground">Produtos</p>
                      <p className="font-semibold text-sm">{store.products}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground">Receita</p>
                      <p className="font-semibold text-sm">{store.revenue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedVideos.map((video: any) => (
                <div
                  key={video.id}
                  className="glass-card rounded-2xl overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Bookmark className="h-4 w-4 text-primary fill-primary" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-1 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {video.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {video.creator}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="flex items-center gap-1 justify-center text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {(video.views / 1000).toFixed(0)}K
                      </div>
                      <div className="flex items-center gap-1 justify-center text-xs text-muted-foreground">
                        <ShoppingCart className="h-3 w-3" />
                        {(video.sales / 1000).toFixed(1)}K
                      </div>
                      <div className="flex items-center gap-1 justify-center text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        {(video.revenue / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}

export default Saved
