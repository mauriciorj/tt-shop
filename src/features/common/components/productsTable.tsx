'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import RevenueSparkline from '@/components/revenueSparkline'
import { IProductDto } from '@/types/index'
import { normalizeUrl } from '@/utils/string'

const ProductsTable = ({ data }: { data: IProductDto[] }) => {
  const router = useRouter()
  if (!data) return null
  return (
    <>
      <div className="text-lg font-semibold text-foreground mt-10 mb-3">
        Top Produtos
      </div>
      <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="w-full">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      #
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Imagem
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Preço Unitário
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Receita Total
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Vendas Totais
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Histórico de Receita
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr
                      key={item?.name}
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
                          {item?.image && (
                            <Image
                              src={item?.image}
                              alt={item?.name}
                              width={100}
                              height={100}
                              style={{
                                borderRadius: '10px',
                              }}
                            />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{item?.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item?.unit_price)}
                      </td>
                      <td className="p-4 font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item?.revenue)}
                      </td>
                      <td className="p-4 font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item?.sales || 0)}
                      </td>
                      <td className="p-4 font-medium">
                        <RevenueSparkline data={item?.revenue_history} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductsTable
