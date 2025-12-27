import { getProducts } from "@/src/app/actions/products";
import { useQuery } from "@tanstack/react-query";

const useProducts = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["top_products"],
    queryFn: async () => getProducts(),
  });

  return {
    isPending,
    isError,
    data,
    error,
  };
};

export default useProducts;
