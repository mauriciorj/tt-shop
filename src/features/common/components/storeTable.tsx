import {
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
export interface Store {
  id: number;
  rank: number;
  name: string;
  category: string;
  followers: string;
  products: number;
  revenue: string;
  rating: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
  avatar: string;
}

interface StoreTableProps {
  stores: Store[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type SortKey =
  | "rank"
  | "followers"
  | "products"
  | "revenue"
  | "rating"
  | "trend";
type SortOrder = "asc" | "desc";

const StoreTable = ({
  stores,
  currentPage,
  totalPages,
  onPageChange,
}: StoreTableProps) => {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null;
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const sortedStores = [...stores].sort((a, b) => {
    let comparison = 0;
    switch (sortKey) {
      case "rank":
        comparison = a.rank - b.rank;
        break;
      case "followers":
        comparison = parseFloat(a.followers) - parseFloat(b.followers);
        break;
      case "products":
        comparison = a.products - b.products;
        break;
      case "revenue":
        comparison =
          parseFloat(a.revenue.replace(/[^0-9.]/g, "")) -
          parseFloat(b.revenue.replace(/[^0-9.]/g, ""));
        break;
      case "rating":
        comparison = a.rating - b.rating;
        break;
      case "trend":
        comparison = a.trendValue - b.trendValue;
        break;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div className="w-full">
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                  <button
                    onClick={() => handleSort("rank")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Rank
                    <SortIcon columnKey="rank" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                  Loja
                </th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                  Categoria
                </th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                  <button
                    onClick={() => handleSort("followers")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Seguidores
                    <SortIcon columnKey="followers" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                  <button
                    onClick={() => handleSort("products")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Produtos
                    <SortIcon columnKey="products" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                  <button
                    onClick={() => handleSort("revenue")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Est. Receita
                    <SortIcon columnKey="revenue" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                  <button
                    onClick={() => handleSort("rating")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Avaliação
                    <SortIcon columnKey="rating" />
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                  <button
                    onClick={() => handleSort("trend")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Trend
                    <SortIcon columnKey="trend" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStores.map((store, index) => (
                <tr
                  key={store.id}
                  onClick={() => router.push(`/store/${store.id}`)}
                  className="table-row-hover border-b border-border/30 last:border-0 cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="p-4">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                        store.rank === 1
                          ? "bg-primary text-primary-foreground"
                          : store.rank === 2
                            ? "bg-accent text-accent-foreground"
                            : store.rank === 3
                              ? "bg-orange-500 text-white"
                              : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {store.rank}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={store.avatar}
                        alt={store.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <span className="font-semibold">{store.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground">
                      {store.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{store.followers}</td>
                  <td className="p-4 font-medium">{store.products}</td>
                  <td className="p-4 font-semibold text-accent">
                    {store.revenue}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{store.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        store.trend === "up"
                          ? "text-green-400"
                          : store.trend === "down"
                            ? "text-red-400"
                            : "text-muted-foreground"
                      }`}
                    >
                      {store.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : store.trend === "down" ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : null}
                      {store.trendValue > 0 ? "+" : ""}
                      {store.trendValue}%
                    </div>
                  </td>
                  {/* <td className="p-4">
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors"
          >
            Anterior
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary/80 transition-colors"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreTable;
