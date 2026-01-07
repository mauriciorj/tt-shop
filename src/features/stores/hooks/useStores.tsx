import { getStores } from "@/src/app/actions/stores";
import { useQuery } from "@tanstack/react-query";

const useStores = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["top_stores"],
    queryFn: async () => getStores(),
  });

  return {
    data,
    isLoading,
  };
};

export default useStores;
