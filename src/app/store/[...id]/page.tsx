'use client'

import { useRouter, useParams } from 'next/navigation'
import { mockStores } from '@/stores/hooks/mockStores'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Package,
  DollarSign,
  Star,
  ExternalLink,
  Share2,
  Heart,
} from 'lucide-react'

const StoreDetail = () => {
  const { id } = useParams()
  const router = useRouter()

  const store = mockStores.find((s) =>
    id?.[0] ? s.name.trim().toLowerCase().replace(/\s+/g, '-') === id[0] : null
  )

  if (!store) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex justify-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Store Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The store youre looking for doesnt exist.
            </p>
            <Button onClick={() => router.push('/stores')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stores
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const getTrendIcon = () => {
    if (store.trend === 'up')
      return <TrendingUp className="w-5 h-5 text-green-500" />
    if (store.trend === 'down')
      return <TrendingDown className="w-5 h-5 text-red-500" />
    return <Minus className="w-5 h-5 text-muted-foreground" />
  }

  const getTrendColor = () => {
    if (store.trend === 'up') return 'text-green-500'
    if (store.trend === 'down') return 'text-red-500'
    return 'text-muted-foreground'
  }

  const stats = [
    {
      label: 'Followers',
      value: store.followers,
      icon: Users,
      description: 'Total followers on TikTok',
    },
    {
      label: 'Products',
      value: store.products.toLocaleString(),
      icon: Package,
      description: 'Active product listings',
    },
    {
      label: 'Revenue',
      value: store.revenue,
      icon: DollarSign,
      description: 'Estimated monthly revenue',
    },
    {
      label: 'Rating',
      value: store.rating.toFixed(1),
      icon: Star,
      description: 'Average customer rating',
    },
  ]

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
          <div className="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6 items-start md:justify-center">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={store.avatar}
                  alt={store.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-primary/20"
                />
                <div className="absolute -top-2 -left-2 w-10 h-10 rounded-full bg-primary flex justify-center justify-center text-primary-foreground font-bold text-lg">
                  #{store.rank}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap justify-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    {store.name}
                  </h1>
                  <Badge variant="secondary" className="text-sm">
                    {store.category}
                  </Badge>
                </div>

                <div className="flex justify-center gap-2 mb-4">
                  {getTrendIcon()}
                  <span className={`font-medium ${getTrendColor()}`}>
                    {store.trendValue > 0 ? '+' : ''}
                    {store.trendValue}% this month
                  </span>
                </div>

                <p className="text-muted-foreground max-w-2xl">
                  A leading TikTok shop in the {store.category} category, known
                  for quality products and excellent customer service. Ranked #
                  {store.rank} among all TikTok stores.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Store
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                className="glass-card border-white/5 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="flex flex-row justify-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Card */}
            <Card
              className="glass-card border-white/5 animate-slide-up"
              style={{ animationDelay: '200ms' }}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between justify-center">
                  <span className="text-muted-foreground">Growth Trend</span>
                  <div className="flex justify-center gap-2">
                    {getTrendIcon()}
                    <span className={getTrendColor()}>
                      {store.trend === 'up'
                        ? 'Growing'
                        : store.trend === 'down'
                          ? 'Declining'
                          : 'Stable'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between justify-center">
                  <span className="text-muted-foreground">Monthly Change</span>
                  <span className={getTrendColor()}>
                    {store.trendValue > 0 ? '+' : ''}
                    {store.trendValue}%
                  </span>
                </div>
                <div className="flex justify-between justify-center">
                  <span className="text-muted-foreground">Ranking</span>
                  <span className="text-foreground font-medium">
                    #{store.rank} Overall
                  </span>
                </div>
                <div className="flex justify-between justify-center">
                  <span className="text-muted-foreground">Customer Rating</span>
                  <div className="flex justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-foreground font-medium">
                      {store.rating}/5.0
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Info Card */}
            <Card
              className="glass-card border-white/5 animate-slide-up"
              style={{ animationDelay: '250ms' }}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Category Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between justify-center">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="secondary">{store.category}</Badge>
                </div>
                <div className="flex justify-between justify-center">
                  <span className="text-muted-foreground">Product Count</span>
                  <span className="text-foreground font-medium">
                    {store.products} items
                  </span>
                </div>
                <div className="flex justify-between justify-center">
                  <span className="text-muted-foreground">Est. Revenue</span>
                  <span className="text-foreground font-medium">
                    {store.revenue}/month
                  </span>
                </div>
                <div className="flex justify-between justify-center">
                  <span className="text-muted-foreground">Audience Size</span>
                  <span className="text-foreground font-medium">
                    {store.followers}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StoreDetail
