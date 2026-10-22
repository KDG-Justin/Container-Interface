import { useQuery } from "@tanstack/react-query";
import type { ContainerVolume } from "../../model/Volume";
import { getVolume } from "../../services/VolumeService";


export function useVolume(name: string) {
  const {
    data: volume,
    isError,
    isLoading,
  } = useQuery<ContainerVolume>({
    queryKey: ["volume-detail", name],
    queryFn: () => getVolume(name),
    enabled: !!name,
  });

  return {
    volume,
    isError,
    isLoading
  };
}
