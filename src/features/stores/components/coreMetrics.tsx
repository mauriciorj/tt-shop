"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function CoreMetrics({ productId }: { productId: string }) {
  const metrics = [
    {
      label: "Receita",
      value: "$403.8k",
      change: "+12.5%",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      label: "Pedidos",
      value: "58.6k",
      change: "+8.2%",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      label: "Preço Médio",
      value: "$10.52",
      change: "-2.1%",
      isPositive: false,
      icon: TrendingDown,
    },
    {
      label: "Taxa de Crescimento",
      value: "+11.1%",
      change: "+3.4pp",
      isPositive: true,
      icon: TrendingUp,
    },
  ];

  return (
    <div>
      <Card>
        <CardContent className="flex flex-col grid grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div className="flex flex-col justify-center items-center">
                <div className="flex flex-row">
                  <p className="text-sm text-muted-foreground mb-1">
                    {metric.label}
                  </p>
                  <Icon
                    className={`w-5 h-5 ml-2 ${metric.isPositive ? "text-green-600" : "text-red-600"}`}
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
