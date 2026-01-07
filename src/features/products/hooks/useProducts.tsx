import { getProducts } from "@/src/app/actions/products";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useProducts = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["topProducts", page],
    queryFn: async () => getProducts(page),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    totalPages: Math.ceil((data?.total || 0) / 10),
    page,
    setPage,
    isLoading,
  };
};

export default useProducts;
