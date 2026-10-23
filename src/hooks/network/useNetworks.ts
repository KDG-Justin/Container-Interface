import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import type { NetworkItem } from "../../model/Network";
import { getNetworks, removeNetwork } from "../../services/NetworkService";


export function useNetworks() {
  const queryClient = new QueryClient();


  const {
    data: networks,
    isError,
    isLoading,
  } = useQuery<NetworkItem[]>({
    queryKey: ["networks"],
    queryFn: getNetworks,
    refetchInterval: 5000,
  });

   const removeMutation = useMutation({
      mutationFn: (id: string) => removeNetwork(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["networks"] });
      },
  });

  return {
    networks,
    isError,
    isLoading,
    removeNetwork: removeMutation.mutateAsync
  };
}