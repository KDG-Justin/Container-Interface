import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import type { ContainerVolume } from "../../model/Volume";
import { getVolumes, removeVolume } from "../../services/VolumeService";

export function useVolumes() {
  const queryClient = new QueryClient();


  const {
    data: volumes,
    isError,
    isLoading,
  } = useQuery<ContainerVolume[]>({
    queryKey: ["volumes"],
    queryFn: getVolumes,
    refetchInterval: 3000,
  });

   const removeMutation = useMutation({
      mutationFn: (name: string) => removeVolume(name),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["volumes"] });
      },
  });

  return {
    volumes,
    isError,
    isLoading,
    removeVolume: removeMutation.mutateAsync
  };
}
