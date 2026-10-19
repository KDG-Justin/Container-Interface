import { useQuery } from "@tanstack/react-query";
import type { ContainerVolume } from "../../model/Volume";
import { getVolumes } from "../../services/VolumeService";

export function useVolumes() {
  const {
    data: volumes,
    isError,
    isLoading,
  } = useQuery<ContainerVolume[]>({
    queryKey: ["volumes"],
    queryFn: getVolumes,
    refetchInterval: 3000,
  });

  return {
    volumes,
    isError,
    isLoading,
  };
}
