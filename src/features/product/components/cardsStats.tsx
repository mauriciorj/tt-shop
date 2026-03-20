'use client'

import {
  DollarSign,
  Minus,
  Package,
  Star,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IProductsWithCategory } from '@/products/types'

const CardsStats = ({ product }: { product: IProductsWithCategory }) => {
  if (!product) return null

  const getTrendIcon = () => {
    if (product.revenue_growth_rate >= 0)
      return <TrendingUp className="w-5 h-5 text-green-500" />
    if (product.revenue_growth_rate < 0)
      return <TrendingDown className="w-5 h-5 text-red-500" />
    return <Minus className="w-5 h-5 text-muted-foreground" />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
            {new Intl.NumberFormat('pt-BR').format(product?.revenue)}
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
            {product?.revenue_growth_rate} %
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
            {new Intl.NumberFormat('pt-BR').format(product?.sales)}
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
            {product?.unit_price}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Estimated unit price
          </p>
        </CardContent>
      </Card>
      <Card
        className="glass-card border-white/5 animate-slide-up"
        style={{ animationDelay: `${4 * 50}ms` }}
      >
        <CardHeader className="flex flex-row justify-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Rating
          </CardTitle>
          <Star className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {product?.product_rating}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CardsStats
