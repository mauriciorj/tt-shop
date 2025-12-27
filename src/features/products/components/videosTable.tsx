"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Store {
  id: number;
  name: string;
  type: string;
  logo: string;
  bestSellingProducts: string[];
  revenue: string;
  revenueLastMonth: string;
  growthRate: number;
  itemsSold: string;
  avgUnitPrice: string;
}

const STORES: Store[] = [
  {
    id: 1,
    name: "Always Fit...",
    type: "BRAND",
    logo: "🏋️",
    bestSellingProducts: ["Product 1", "Product 2", "Product 3"],
    revenue: "$1.82m",
    revenueLastMonth: "$1.75m",
    growthRate: 0.7,
    itemsSold: "229.1k",
    avgUnitPrice: "$7.95",
  },
  {
    id: 2,
    name: "Bodyaction",
    type: "BRAND",
    logo: "⚡",
    bestSellingProducts: ["Product 1", "Product 2", "Product 3"],
    revenue: "$954.72k",
    revenueLastMonth: "$1.12m",
    growthRate: -16.5,
    itemsSold: "85.84k",
    avgUnitPrice: "$11.12",
  },
  {
    id: 3,
    name: "Beauty Store",
    type: "BRAND",
    logo: "💄",
    bestSellingProducts: ["Product 1", "Product 2", "Product 3"],
    revenue: "$781.20k",
    revenueLastMonth: "$575k",
    growthRate: 35.4,
    itemsSold: "54.88k",
    avgUnitPrice: "$14.23",
  },
  {
    id: 4,
    name: "Tech Hub",
    type: "BRAND",
    logo: "🛠️",
    bestSellingProducts: ["Product 1", "Product 2", "Product 3"],
    revenue: "$728.93k",
    revenueLastMonth: "$428k",
    growthRate: 35,
    itemsSold: "62.4k",
    avgUnitPrice: "$11.68",
  },
  {
    id: 5,
    name: "Home Essentials",
    type: "BRAND",
    logo: "🏠",
    bestSellingProducts: ["Product 1", "Product 2", "Product 3"],
    revenue: "$720.44k",
    revenueLastMonth: "$710k",
    growthRate: 1.7,
    itemsSold: "166.38k",
    avgUnitPrice: "$4.33",
  },
  {
    id: 6,
    name: "Fashion Forward",
    type: "BRAND",
    logo: "👜",
    bestSellingProducts: ["Product 1", "Product 2", "Product 3"],
    revenue: "$703.54k",
    revenueLastMonth: "$1.0m",
    growthRate: -29.6,
    itemsSold: "29.36k",
    avgUnitPrice: "$23.96",
  },
  {
    id: 7,
    name: "Wellness Co",
    type: "BRAND",
    logo: "💪",
    bestSellingProducts: ["Product 1", "Product 2", "Product 3"],
    revenue: "$645.11k",
    revenueLastMonth: "$1.02m",
    growthRate: -36.6,
    itemsSold: "81.01k",
    avgUnitPrice: "$7.96",
  },
  {
    id: 8,
    name: "Electronics Plus",
    type: "BRAND",
    logo: "📱",
    bestSellingProducts: ["Product 1", "Product 2", "Product 3"],
    revenue: "$597.20k",
    revenueLastMonth: "$467k",
    growthRate: 27.5,
    itemsSold: "60.05k",
    avgUnitPrice: "$9.95",
  },
  {
    id: 9,
    name: "Skincare Studio",
    type: "BRAND",
    logo: "✨",
    bestSellingProducts: ["Product 1", "Product 2", "Product 3"],
    revenue: "$579.96k",
    revenueLastMonth: "$677k",
    growthRate: -14.9,
    itemsSold: "51.85k",
    avgUnitPrice: "$11.19",
  },
  {
    id: 10,
    name: "Toy World",
    type: "BRAND",
    logo: "🎮",
    bestSellingProducts: ["Product 1", "Product 2", "Product 3"],
    revenue: "$517.51k",
    revenueLastMonth: "$1.08m",
    growthRate: -52.3,
    itemsSold: "42.86k",
    avgUnitPrice: "$12.08",
  },
];

export function VideosTable() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <Card className="w-full mt-10">
      <CardHeader>
        <CardTitle>Videos</CardTitle>
        <CardDescription>Melhores performances</CardDescription>
      </CardHeader>
      <CardContent className=" bg-background max-w-7xl mx-auto px-6 py-4  w-full overflow-x-auto">
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
            {STORES.map((store, index) => (
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
                    <div className="text-2xl">{store.logo}</div>
                    <div>
                      <div className="font-medium text-foreground">
                        {store.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {store.type}
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
                  {store.revenue}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="h-12 flex justify-center items-center">
                    <div className="w-16 h-6 bg-gradient-to-r from-blue-200 to-blue-100 rounded" />
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center items-center gap-2">
                    {store.growthRate > 0 ? (
                      <>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-600">
                          {store.growthRate}%
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-600">
                          {store.growthRate}%
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground font-medium text-center">
                  {store.itemsSold}
                </td>
                {/* <td className="px-4 py-3 text-foreground font-medium text-center">
                {store.avgUnitPrice}
              </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
