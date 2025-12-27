"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import useStores from "@/stores/hooks/useStores";

export function StoresTable() {
  const { data, isPending, isError, error } = useStores();

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
          {data?.map((store, index) => (
            <tr
              key={store.id}
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
                  <div className="text-2xl">{store?.logo}</div>
                  <div>
                    <div className="font-medium text-foreground">
                      {store?.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {store?.type}
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
                {store?.revenue}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="h-12 flex justify-center items-center">
                  <div className="w-16 h-6 bg-gradient-to-r from-blue-200 to-blue-100 rounded" />
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center items-center gap-2">
                  {typeof store?.revenue_growth_rate === "number" ||
                  parseFloat(store?.revenue_growth_rate) > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-600">
                        {store?.revenue_growth_rate}%
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-600">
                        {store?.revenue_growth_rate}%
                      </span>
                    </>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-foreground font-medium text-center">
                {store?.sales}
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
