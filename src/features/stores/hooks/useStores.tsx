import { getStores } from "@/src/app/actions/stores";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useStores = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("k_revenue");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading } = useQuery({
    queryKey: ["topStores", page, sortBy, order],
    queryFn: async () => getStores(page, 10, sortBy, order),
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("desc"); // Default to desc for new metrics usually
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

export default useStores;
