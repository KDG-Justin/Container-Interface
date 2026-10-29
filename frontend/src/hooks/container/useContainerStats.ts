import { useQuery } from "@tanstack/react-query";
import type { ContainerStats } from "../../model/Container";
import { getContainerStats } from "../../services/ContainerService";


export function useContainerStats(id: string){
  const {data: stats, isError: isStatsError, isLoading: isStatsLoading} = useQuery<ContainerStats>({
    queryKey: ["container-stats", id],
    queryFn: () => getContainerStats(id),
    enabled: !!id, 
    refetchInterval: 1000,
  });

  return { stats, isStatsError, isStatsLoading };
}