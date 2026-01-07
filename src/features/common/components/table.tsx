"use client";

import Image from "next/image";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ITopProducts } from "@/products/types";
import { ITopStores } from "@/stores/types";

interface ITable {
  data?: ITopStores[] | ITopProducts[];
  isLoading: boolean;
  type: "products" | "stores";
}

export function Table({ data, isLoading, type }: ITable) {
  return (
    <div className="bg-background max-w-7xl mx-auto px-6 py-4  w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">
              #
            </th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">
              Loja
            </th>
            {/* <th className="px-4 py-3 text-center font-medium text-muted-foreground">
              Best-selling Products
            </th> */}
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">
              Vendas
            </th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">
              Vendas
            </th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">
              Taxa de crescimento
            </th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">
              Itens Vendidos
            </th>
            {/* <th className="px-4 py-3 text-center font-medium text-muted-foreground">
              Preço médio
            </th> */}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-center">
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-row items-center justify-center gap-3">
                        <Skeleton className="h-[80px] w-[80px]" />
                        <div className="ml-3 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="h-12 flex justify-center items-center">
                      <Skeleton className="h-6 w-16 rounded" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </td>
                </tr>
              ))
            : data?.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-center">
                    {/* <button
                  onClick={() => toggleFavorite(store.id)}
                  className="text-muted-foreground hover:text-blue-500 transition-colors"
                >
                  <Star
                    className={`w-4 h-4 ${favorites.includes(store.id) ? "fill-blue-500 text-blue-500" : ""}`}
                  />
                </button> */}
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-row items-center justify-center gap-3">
                        <div className="min-w-[80px] h-[80px]">
                          <Image
                            src={`/images/${type}/${item?.id}.png`}
                            alt={item?.name}
                            width={80}
                            height={80}
                          />
                        </div>
                        <div className="font-medium text-foreground ml-3">
                          <div className="font-medium text-foreground">
                            {item?.name}
                          </div>
                          {item?.type && (
                            <div className="text-xs text-muted-foreground">
                              {item.type}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* <td className="px-4 py-3">
                <div className="flex gap-2">
                  {store.bestSellingProducts.map((_, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs"
                    >
                      🎁
                    </div>
                  ))}
                </div>
              </td> */}
                  <td className="px-4 py-3 font-semibold text-blue-600 text-center">
                    {item?.revenue}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="h-12 flex justify-center items-center">
                      <div className="w-16 h-6 bg-gradient-to-r from-blue-200 to-blue-100 rounded" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-2">
                      {typeof item?.revenue_growth_rate === "number" ||
                      parseFloat(item?.revenue_growth_rate) > 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-600">
                            {item?.revenue_growth_rate}%
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-600" />
                          <span className="font-medium text-red-600">
                            {item?.revenue_growth_rate}%
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground font-medium text-center">
                    {item?.sales}
                  </td>
                  {/* <td className="px-4 py-3 text-foreground font-medium text-center">
                {store.avgUnitPrice}
              </td> */}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
