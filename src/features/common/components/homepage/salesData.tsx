import Link from 'next/link'
import {
  ArrowRight,
  TrendingUp,
  Flame,
  Sparkles,
  Play,
  ShoppingBag,
  Store,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const products = [
  {
    name: 'Mini Impressora',
    image:
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=80&h=80&fit=crop',
    revenue: 'R$184k',
    sales: '2.430',
    videos: 312,
    badge: 'Hot' as const,
    trend: 24,
  },
  {
    name: 'Escova Secadora',
    image:
      'https://images.unsplash.com/photo-1522338242992-e1a54571f741?w=80&h=80&fit=crop',
    revenue: 'R$98k',
    sales: '1.110',
    videos: 205,
    badge: 'Trending' as const,
    trend: 18,
  },
  {
    name: 'Fone Bluetooth',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop',
    revenue: 'R$72k',
    sales: '830',
    videos: 147,
    badge: null,
    trend: 12,
  },
  {
    name: 'Luminária LED',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=80&h=80&fit=crop',
    revenue: 'R$61k',
    sales: '720',
    videos: 98,
    badge: 'Trending' as const,
    trend: 31,
  },
]

const videos = [
  {
    name: 'Unboxing Mini Impressora',
    image:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=80&h=80&fit=crop',
    views: '2.1M',
    sales: '1.840',
    revenue: 'R$142k',
    badge: 'Hot' as const,
    trend: 45,
  },
  {
    name: 'Review Escova Secadora',
    image:
      'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=80&h=80&fit=crop',
    views: '890k',
    sales: '720',
    revenue: 'R$67k',
    badge: 'Trending' as const,
    trend: 22,
  },
  {
    name: 'Tutorial Fone Bluetooth',
    image:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=80&h=80&fit=crop',
    views: '540k',
    sales: '430',
    revenue: 'R$38k',
    badge: null,
    trend: 15,
  },
  {
    name: 'Luminária LED no Quarto',
    image:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=80&h=80&fit=crop',
    views: '1.3M',
    sales: '610',
    revenue: 'R$52k',
    badge: 'Trending' as const,
    trend: 38,
  },
]

const stores = [
  {
    name: 'GlowUp Beauty',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=80&h=80&fit=crop',
    products: 245,
    revenue: 'R$2.8M',
    followers: '12.5M',
    badge: 'Hot' as const,
    trend: 15,
  },
  {
    name: 'TechTrend Hub',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=80&h=80&fit=crop',
    products: 189,
    revenue: 'R$2.1M',
    followers: '8.2M',
    badge: 'Trending' as const,
    trend: 12,
  },
  {
    name: 'FashionForward',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop',
    products: 412,
    revenue: 'R$1.9M',
    followers: '7.8M',
    badge: null,
    trend: 2,
  },
  {
    name: 'HomeStyle Living',
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop',
    products: 328,
    revenue: 'R$1.5M',
    followers: '5.6M',
    badge: 'Trending' as const,
    trend: 8,
  },
]

const Badge = ({ badge }: { badge: 'Hot' | 'Trending' | null }) => {
  if (!badge) return null
  return (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary">
      {badge === 'Hot' ? (
        <Flame className="h-3 w-3" />
      ) : (
        <Sparkles className="h-3 w-3" />
      )}
      {badge}
    </span>
  )
}

const TrendBadge = ({ value }: { value: number }) => (
  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-500">
    <TrendingUp className="h-3.5 w-3.5" />+{value}%
  </span>
)

const SalesDataSection = () => {
  return (
    <section className="w-full relative flex items-center justify-center flex-col py-20 md:py-24 px-4">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-14 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Dados reais de vendas do{' '}
            <span className="gradient-text">TikTok Shop</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Descubra quais produtos estão gerando mais receita agora.
          </p>
        </div>

        <Tabs
          defaultValue="products"
          className="max-w-4xl mx-auto animate-slide-up"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 h-12 rounded-xl bg-muted/60 p-1">
            <TabsTrigger
              value="videos"
              className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md"
            >
              <Play className="h-4 w-4" />
              <span className="hidden sm:inline">Vídeos</span>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Produtos</span>
            </TabsTrigger>
            <TabsTrigger
              value="stores"
              className="rounded-lg gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md"
            >
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Lojas</span>
            </TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <div className="hidden md:block glass-card rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Vídeo
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Views
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Vendas
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Receita
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Tendência
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((item) => (
                    <tr
                      key={item.name}
                      className="border-b border-border/30 last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <span className="font-medium">{item.name}</span>
                          <Badge badge={item.badge} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {item.views}
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {item.sales}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-primary">
                        {item.revenue}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <TrendBadge value={item.trend} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <MobileCards
              items={videos.map((v) => ({
                name: v.name,
                image: v.image,
                badge: v.badge,
                trend: v.trend,
                cols: [
                  { label: 'Views', value: v.views },
                  { label: 'Vendas', value: v.sales },
                  { label: 'Receita', value: v.revenue, highlight: true },
                ],
              }))}
            />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="hidden md:block glass-card rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Produto
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Receita
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Vendas
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Vídeos
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Tendência
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr
                      key={item.name}
                      className="border-b border-border/30 last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <span className="font-medium">{item.name}</span>
                          <Badge badge={item.badge} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-primary">
                        {item.revenue}
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {item.sales}
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {item.videos}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <TrendBadge value={item.trend} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <MobileCards
              items={products.map((p) => ({
                name: p.name,
                image: p.image,
                badge: p.badge,
                trend: p.trend,
                cols: [
                  { label: 'Receita', value: p.revenue, highlight: true },
                  { label: 'Vendas', value: p.sales },
                  { label: 'Vídeos', value: String(p.videos) },
                ],
              }))}
            />
          </TabsContent>

          {/* Stores Tab */}
          <TabsContent value="stores">
            <div className="hidden md:block glass-card rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Loja
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Receita
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Produtos
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Seguidores
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Tendência
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((item) => (
                    <tr
                      key={item.name}
                      className="border-b border-border/30 last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <span className="font-medium">{item.name}</span>
                          <Badge badge={item.badge} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-primary">
                        {item.revenue}
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {item.products}
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {item.followers}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <TrendBadge value={item.trend} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <MobileCards
              items={stores.map((s) => ({
                name: s.name,
                image: s.image,
                badge: s.badge,
                trend: s.trend,
                cols: [
                  { label: 'Receita', value: s.revenue, highlight: true },
                  { label: 'Produtos', value: String(s.products) },
                  { label: 'Seguidores', value: s.followers },
                ],
              }))}
            />
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <div className="text-center mt-12 animate-fade-in">
          <p className="text-muted-foreground mb-5">
            Esses são apenas alguns dos produtos que você pode descobrir.
          </p>
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all glow-effect"
          >
            Explorar produtos vencedores
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

interface MobileCardItem {
  name: string
  image: string
  badge: 'Hot' | 'Trending' | null
  trend: number
  cols: { label: string; value: string; highlight?: boolean }[]
}

const MobileCards = ({ items }: { items: MobileCardItem[] }) => (
  <div className="md:hidden space-y-4 max-w-md mx-auto">
    {items.map((item, i) => (
      <div
        key={item.name}
        className="glass-card rounded-2xl p-5 animate-slide-up"
        style={{ animationDelay: `${i * 100}ms` }}
      >
        <div className="flex items-center gap-3 mb-4">
          <img
            src={item.image}
            alt={item.name}
            className="h-12 w-12 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold truncate">{item.name}</span>
              <Badge badge={item.badge} />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-500">
              <TrendingUp className="h-3 w-3" />+{item.trend}%
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {item.cols.map((col) => (
            <div key={col.label}>
              <p className="text-xs text-muted-foreground mb-0.5">
                {col.label}
              </p>
              <p
                className={`font-semibold text-sm ${col.highlight ? 'text-primary' : ''}`}
              >
                {col.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

export default SalesDataSection
