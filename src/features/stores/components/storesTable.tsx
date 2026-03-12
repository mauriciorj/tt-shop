import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp, Heart, TrendingDown, TrendingUp } from 'lucide-react'
import RevenueSparkline from '@/components/revenueSparkline'
import TablePagination from '@/components/tablePagination'
import { IStoresWithCategory, TSortKey, TSortOrder } from '@/stores/types'
import { normalizeUrl } from '@/utils/string'

export interface TableProps {
  currentPage: number
  items: IStoresWithCategory[]
  onPageChange: (page: number) => void
  onToggleSave?: (storeKId: string) => void
  savedStoreIds?: string[]
  setSortKey: (key: TSortKey) => void
  setSortOrder: (order: TSortOrder) => void
  sortKey: TSortKey
  sortOrder: TSortOrder
  totalPages: number | undefined
}

const SortIcon = ({
  columnKey,
  sortKey,
  sortOrder,
}: {
  columnKey: TSortKey
  sortKey: TSortKey
  sortOrder: TSortOrder
}) => {
  if (sortKey !== columnKey) return null
  return sortOrder === 'asc' ? (
    <ArrowUp className="h-4 w-4" />
  ) : (
    <ArrowDown className="h-4 w-4" />
  )
}

const StoresTable = ({
  currentPage,
  items,
  onPageChange,
  onToggleSave,
  savedStoreIds,
  setSortKey,
  setSortOrder,
  sortKey,
  sortOrder,
  totalPages,
}: TableProps) => {
  const router = useRouter()

  const handleSort = (key: TSortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
    // Move to first page whenever the user changes the table sort
    onPageChange(1)
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
                  {onToggleSave && (
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Salvar
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.name}
                    onClick={() =>
                      router.push(`/store/${normalizeUrl(item.name)}`)
                    }
                    className="table-row-hover border-b border-border/30 last:border-0 cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                          item.rank === 1
                            ? 'bg-primary text-primary-foreground'
                            : item.rank === 2
                              ? 'bg-accent text-accent-foreground'
                              : item.rank === 3
                                ? 'bg-orange-500 text-white'
                                : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {item.rank}
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
                      {item?.category_name && (
                        <span className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground">
                          {item?.category_name}
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
                    {onToggleSave && (
                      <td
                        className="p-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => item.k_id && onToggleSave(item.k_id)}
                          className="p-1 rounded-md hover:bg-secondary transition-colors"
                          title={
                            savedStoreIds?.includes(item.k_id ?? '')
                              ? 'Remover dos salvos'
                              : 'Salvar loja'
                          }
                        >
                          <Heart
                            className={`h-5 w-5 transition-colors ${
                              savedStoreIds?.includes(item.k_id ?? '')
                                ? 'text-primary fill-primary'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      </td>
                    )}
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

export default StoresTable
