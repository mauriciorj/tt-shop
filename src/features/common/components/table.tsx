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
import { IStoreWithCategory } from "@/stores/types";

interface TableProps {
  items: IStoreWithCategory[];
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

const Table = ({
  items,
  currentPage,
  totalPages,
  onPageChange,
}: TableProps) => {
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

  return (
    <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
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
                      Receita
                      <SortIcon columnKey="followers" />
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    <button
                      onClick={() => handleSort("products")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Receita Histórica
                      <SortIcon columnKey="products" />
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    <button
                      onClick={() => handleSort("revenue")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Receita %
                      <SortIcon columnKey="revenue" />
                    </button>
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">
                    <button
                      onClick={() => handleSort("rating")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Vendas
                      <SortIcon columnKey="rating" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => router.push(`/item/${item.id}`)}
                    className="table-row-hover border-b border-border/30 last:border-0 cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                          index + 1 === 1
                            ? "bg-primary text-primary-foreground"
                            : index + 1 === 2
                              ? "bg-accent text-accent-foreground"
                              : index + 1 === 3
                                ? "bg-orange-500 text-white"
                                : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* TODO: add image */}
                        {/* <img
                          src={item.avatar}
                          alt={item?.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        /> */}
                        <span className="font-semibold">{item?.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {item?.category && (
                        <span className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground">
                          {item?.category}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-medium">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item?.revenue)}
                    </td>
                    <td className="p-4 font-medium">
                      {/* {item?.k_revenue_history} */}
                      220,00
                    </td>
                    <td className="p-4 font-semibold text-accent">
                      {item?.revenue_growth_rate}%
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {/* <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> */}
                        <span className="font-medium">
                          {new Intl.NumberFormat("pt-BR").format(item?.sales)}
                        </span>
                      </div>
                    </td>
                    {/* <td className="p-4">
                      <div
                        className={`flex items-center gap-1 text-sm font-medium ${
                          item.trend === "up"
                            ? "text-green-400"
                            : item.trend === "down"
                              ? "text-red-400"
                              : "text-muted-foreground"
                        }`}
                      >
                        {item.trend === "up" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : item.trend === "down" ? (
                          <TrendingDown className="h-4 w-4" />
                        ) : null}
                        {item.trendValue > 0 ? "+" : ""}
                        {item.trendValue}%
                      </div>
                    </td> */}
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
    </div>
  );
};

export default Table;
