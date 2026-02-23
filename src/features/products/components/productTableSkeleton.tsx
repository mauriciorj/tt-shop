import { Skeleton } from '@/components/ui/skeleton'

interface ProductTableSkeletonProps {
  rows?: number
}

const ProductTableSkeleton = ({ rows = 10 }: ProductTableSkeletonProps) => {
  return (
    <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="w-full">
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    Rank
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    Loja
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    Categoria
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    Receita
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    Receita Histórica
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    Receita %
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    Vendas
                  </th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }).map((_, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/30 last:border-0"
                  >
                    <td className="p-4">
                      <Skeleton className="w-8 h-8 rounded-lg" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </td>
                    <td className="p-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="h-8 w-20" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between mt-6">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20 rounded-lg" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-lg" />
          ))}
          <Skeleton className="h-10 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default ProductTableSkeleton
