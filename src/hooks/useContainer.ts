import { useQuery } from "@tanstack/react-query";
import { getContainerDetails } from "../services/ContainerService";
import type { ContainerItem } from "../model/Container";

export function useContainer(id: string){
  const {data: container, isError, isLoading,} = useQuery<ContainerItem>({
    queryKey: ["container-detail", id],
    queryFn: () => getContainerDetails(id),
    enabled: !!id, // wordt gefetched als id aanwezig is
  });

  return { container, isError, isLoading };
}
