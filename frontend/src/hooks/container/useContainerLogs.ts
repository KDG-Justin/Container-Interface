import { useQuery } from "@tanstack/react-query";
import { getContainerLogs } from "../../services/ContainerService";




export function useContainerLogs(id: string, isOpen : boolean){
  const {data: containerLogs, isError, isLoading,} = useQuery({
    queryKey: ["container-logs", id],
    queryFn: () => getContainerLogs(id),
    enabled: Boolean(id) && isOpen,
    refetchInterval: isOpen ? 3000 : false,
    refetchOnMount: "always",
  });

  return { containerLogs, isError, isLoading };
}