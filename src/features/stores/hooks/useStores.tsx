import { getStores } from "@/src/app/actions/stores";
import { useQuery } from "@tanstack/react-query";

const useStores = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["top_stores"],
    queryFn: async () => getStores(),
  });

  return {
    isPending,
    isError,
    data,
    error,
  };
};

export default useStores;
