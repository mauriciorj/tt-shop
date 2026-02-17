import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowDown,
  ArrowUp,
  Star,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import RevenueSparkline from '@/components/revenueSparkline'
import TablePagination from '@/components/tablePagination'
import { IProductWithCategory } from '@/products/types'
import { normalizeUrl } from '@/utils/string'

export interface TableProps {
  items: IProductWithCategory[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

type SortKey =
  | 'revenue'
  | 'revenueHistory'
  | 'revenueGrowthRate'
  | 'rating'
  | 'sales'
  | 'unitPrice'

type SortOrder = 'asc' | 'desc'

const SortIcon = ({
  columnKey,
  sortKey,
  sortOrder,
}: {
  columnKey: SortKey
  sortKey: SortKey
  sortOrder: SortOrder
}) => {
  if (sortKey !== columnKey) return null
  return sortOrder === 'asc' ? (
    <ArrowUp className="h-4 w-4" />
  ) : (
    <ArrowDown className="h-4 w-4" />
  )
}

const ProductsTable = ({
  currentPage,
  items,
  onPageChange,
  totalPages,
}: TableProps) => {
  const router = useRouter()
  const [sortKey, setSortKey] = useState<SortKey>('revenue')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

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
                    <button
                      onClick={() => handleSort('revenue')}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Receita
                      <SortIcon
                        columnKey="revenue"
                        sortKey={sortKey}
                        sortOrder={sortOrder}
                      />
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    <button
                      onClick={() => handleSort('revenueHistory')}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Receita Histórica
                      <SortIcon
                        columnKey="revenueHistory"
                        sortKey={sortKey}
                        sortOrder={sortOrder}
                      />
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    <button
                      onClick={() => handleSort('revenueGrowthRate')}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Receita %
                      <SortIcon
                        columnKey="revenueGrowthRate"
                        sortKey={sortKey}
                        sortOrder={sortOrder}
                      />
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    <button
                      onClick={() => handleSort('sales')}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Vendas
                      <SortIcon
                        columnKey="sales"
                        sortKey={sortKey}
                        sortOrder={sortOrder}
                      />
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    <button
                      onClick={() => handleSort('rating')}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Avaliação
                      <SortIcon
                        columnKey="rating"
                        sortKey={sortKey}
                        sortOrder={sortOrder}
                      />
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    <button
                      onClick={() => handleSort('unitPrice')}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Preço Unitário
                      <SortIcon
                        columnKey="unitPrice"
                        sortKey={sortKey}
                        sortOrder={sortOrder}
                      />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.name}
                    onClick={() =>
                      router.push(`/product/${normalizeUrl(item.name)}`)
                    }
                    className="table-row-hover border-b border-border/30 last:border-0 cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                          index + 1 === 1
                            ? 'bg-primary text-primary-foreground'
                            : index + 1 === 2
                              ? 'bg-accent text-accent-foreground'
                              : index + 1 === 3
                                ? 'bg-orange-500 text-white'
                                : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {index + 1}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-[50px]">
                          {item?.image && (
                            <Image
                              src={item.image}
                              alt={item?.name}
                              width={40}
                              height={40}
                              style={{
                                borderRadius: '10px',
                              }}
                            />
                          )}
                        </div>
                        <span className="font-semibold">{item?.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {item?.category && (
                        <span className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground">
                          {item?.category}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(item?.revenue)}
                    </td>
                    <td className="p-4 font-medium">
                      <RevenueSparkline data={item?.revenue_history} />
                    </td>
                    <td className="p-4 font-semibold text-accent">
                      <div
                        className={`flex items-center gap-1 text-sm font-medium ${
                          item.revenue_growth_rate >= 0
                            ? 'text-green-400'
                            : item.revenue_growth_rate < 0
                              ? 'text-red-400'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {item.revenue_growth_rate > 0 ? (
                          <TrendingUp className="h-4 w-4 mr-2" />
                        ) : item.revenue_growth_rate < 0 ? (
                          <TrendingDown className="h-4 w-4 mr-2" />
                        ) : null}
                        {item.revenue_growth_rate > 0 ? '+' : ''}
                        {item.revenue_growth_rate}%
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {new Intl.NumberFormat('pt-BR').format(item?.sales)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <div className="flex flex-row justify-center items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 mr-2" />
                          <span className="font-medium">
                            {item?.product_rating}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(item?.unit_price)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <TablePagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  )
}

export default ProductsTable
