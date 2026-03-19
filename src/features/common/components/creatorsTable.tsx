import Image from 'next/image'
import { ICreatorDto } from '@/types/index'

const CreatorsTable = ({
  data,
  isBlog,
}: {
  data: ICreatorDto[]
  isBlog?: boolean
}) => {
  if (!data) return null
  return (
    <>
      <div className="text-lg font-semibold text-foreground mt-10 mb-3">
        Top Criadores
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
                      Conta TikTok
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Apelido
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Seguidores
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Receita
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                      Vendas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr
                      key={item?.tt_account}
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
                            {isBlog && index < 7
                              ? 'n/a'
                              : item?.image && (
                                  <Image
                                    src={item.image}
                                    alt={item?.tt_account}
                                    width={40}
                                    height={40}
                                    style={{
                                      borderRadius: '10px',
                                    }}
                                  />
                                )}
                          </div>
                          <span className="font-semibold">
                            {isBlog && index < 7
                              ? 'n/a'
                              : `@${item?.tt_account}`}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {isBlog && index < 7
                          ? 'n/a'
                          : item?.tt_nickname && (
                              <span className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground">
                                {item?.tt_nickname}
                              </span>
                            )}
                      </td>
                      <td className="p-4 font-medium">
                        {isBlog && index < 7
                          ? 'n/a'
                          : new Intl.NumberFormat('pt-BR').format(
                              item?.tt_followers
                            )}
                      </td>
                      <td className="p-4 font-medium">
                        {isBlog && index < 7
                          ? 'n/a'
                          : new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(item?.revenue)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {isBlog && index < 7
                            ? 'n/a'
                            : item?.sales && (
                                <span className="font-medium">
                                  {new Intl.NumberFormat('pt-BR').format(
                                    item?.sales
                                  )}
                                </span>
                              )}
                        </div>
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

export default CreatorsTable
