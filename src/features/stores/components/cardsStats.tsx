'use client'

import {
  DollarSign,
  Minus,
  Package,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IStoreWithCategory } from '@/stores/types'

const CardsStats = ({ store }: { store: IStoreWithCategory }) => {
  if (!store) return null

  const getTrendIcon = () => {
    if (store.revenue_growth_rate >= 0)
      return <TrendingUp className="w-5 h-5 text-green-500" />
    if (store.revenue_growth_rate < 0)
      return <TrendingDown className="w-5 h-5 text-red-500" />
    return <Minus className="w-5 h-5 text-muted-foreground" />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card
        className="glass-card border-white/5 animate-slide-up"
        style={{ animationDelay: `${1 * 50}ms` }}
      >
        <CardHeader className="flex flex-row justify-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Revenue
          </CardTitle>
          <DollarSign className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {new Intl.NumberFormat('pt-BR').format(store?.revenue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Estimated monthly revenue
          </p>
        </CardContent>
      </Card>
      <Card
        className="glass-card border-white/5 animate-slide-up"
        style={{ animationDelay: `${2 * 50}ms` }}
      >
        <CardHeader className="flex flex-row justify-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Growth Rate
          </CardTitle>
          {getTrendIcon()}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {store?.revenue_growth_rate} %
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Estimated growth rate
          </p>
        </CardContent>
      </Card>
      <Card
        className="glass-card border-white/5 animate-slide-up"
        style={{ animationDelay: `${3 * 50}ms` }}
      >
        <CardHeader className="flex flex-row justify-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Sales
          </CardTitle>
          <Package className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {new Intl.NumberFormat('pt-BR').format(store?.sales)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Estimated sales</p>
        </CardContent>
      </Card>
      <Card
        className="glass-card border-white/5 animate-slide-up"
        style={{ animationDelay: `${4 * 50}ms` }}
      >
        <CardHeader className="flex flex-row justify-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Unit Price
          </CardTitle>
          <DollarSign className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {store?.unit_price}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Estimated unit price
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default CardsStats
