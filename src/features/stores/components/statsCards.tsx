"use client";

import { Store, TrendingUp, Users } from "lucide-react";

const StatsCards = ({
  totalStores,
  totalProducts,
}: {
  totalStores: number;
  totalProducts: number;
}) => {
  const stats = [
    {
      label: "Lojas",
      value: totalStores.toString(),
      icon: Store,
    },
    {
      label: "Produtos",
      value: totalProducts.toString(),
      icon: Users,
    },
    {
      label: "Videos",
      value: "24",
      icon: TrendingUp,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="glass-card rounded-2xl p-6 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="p-3 rounded-xl bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
