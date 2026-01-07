import { getStores } from "@/src/app/actions/stores";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const useStores = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["topStores", page],
    queryFn: async () => getStores(page),
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

export default useStores;
