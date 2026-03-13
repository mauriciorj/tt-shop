import { useRouter } from 'next/navigation'
import { Heart, Star, TrendingUp, TrendingDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/utils/number'
import { normalizeUrl } from '@/utils/string'

const SavedProductCard = ({ product }: { product: any }) => {
  const router = useRouter()
  return (
    <div
      key={product.k_id ?? product.name}
      onClick={() => router.push(`/product/${normalizeUrl(product.name)}`)}
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
          <p className="font-semibold text-sm">{formatNumber(product.sales)}</p>
        </div>
        <div className="p-2 rounded-lg bg-secondary/50">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Star className="h-3 w-3 text-yellow-400" />
            Avaliação
          </p>
          <p className="font-semibold text-sm">{product.product_rating}</p>
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
            product.revenue_growth_rate >= 0 ? 'text-green-400' : 'text-red-400'
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
  )
}

export default SavedProductCard
