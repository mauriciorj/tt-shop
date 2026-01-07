import { getProducts } from "@/src/app/actions/products";
import { useQuery } from "@tanstack/react-query";

const useProducts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => getProducts(),
  });

  return {
    data,
    isLoading,
  };
};

export default useProducts;
