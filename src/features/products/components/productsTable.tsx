"use client";

import Image from "next/image";
import useProducts from "@/products/hooks/useProducts";
import { TrendingDown, TrendingUp } from "lucide-react";

export function ProductsTable() {
  const { data, isPending, isError, error } = useProducts();

  return (
    <div className="bg-background max-w-7xl mx-auto px-6 py-4  w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">
              #
            </th>
            <th className="px-4 py-3 text-center font-medium text-muted-foreground">
              Produto
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
          {data?.map((product, index) => (
            <tr
              key={product.id}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              <td className="px-4 py-3 text-center">
                {/* <button
                  onClick={() => toggleFavorite(product?.id)}
                  className="text-muted-foreground hover:text-blue-500 transition-colors"
                >
                  <Star
                    className={`w-4 h-4 ${favorites.includes(product?.id) ? "fill-blue-500 text-blue-500" : ""}`}
                  />
                </button> */}
                {index + 1}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-row items-center justify-center gap-3">
                  <div className="min-w-[80px] h-[80px]">
                    <Image
                      src={`/images/products/${product?.product_id}.png`}
                      alt={product?.name}
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="font-medium text-foreground ml-3">
                    {product?.name}
                  </div>
                </div>
              </td>
              {/* <td className="px-4 py-3">
                <div className="flex gap-2">
                  {product?.bestSellingProducts.map((_, idx) => (
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
                {product?.revenue}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="h-12 flex justify-center items-center">
                  <div className="w-16 h-6 bg-gradient-to-r from-blue-200 to-blue-100 rounded" />
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center items-center gap-2">
                  {typeof product?.revenue_growth_rate === "number" ||
                  parseFloat(product?.revenue_growth_rate) > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-600">
                        {product?.revenue_growth_rate}%
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-600">
                        {product?.revenue_growth_rate}%
                      </span>
                    </>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-foreground font-medium text-center">
                {product?.sales}
              </td>
              {/* <td className="px-4 py-3 text-foreground font-medium text-center">
                {product?.avgUnitPrice}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
