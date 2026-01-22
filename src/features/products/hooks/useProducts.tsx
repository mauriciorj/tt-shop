import { getProducts } from "@/src/app/actions/products";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useProducts = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("k_revenue");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading } = useQuery({
    queryKey: ["topProducts", page, sortBy, order],
    queryFn: async () => getProducts(page, 10, sortBy, order),
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("desc"); // Default to desc for new metric columns
    }
    setPage(1); // Reset to page 1 on sort change
  };

  return {
    data: data?.data || [],
    total: data?.total || 0,
    totalPages: Math.ceil((data?.total || 0) / 10),
    page,
    setPage,
    sortBy,
    order,
    handleSort,
    isLoading,
  };
};

export default useProducts;
