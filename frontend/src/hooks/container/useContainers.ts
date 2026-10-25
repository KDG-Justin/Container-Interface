import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import type { ContainerFormData, ContainerItem } from "../../model/Container";
import {
  createContainer,
  getContainers,
  removeContainer,
  startContainer,
  stopContainer,
} from "../../services/ContainerService";

export function useContainers() {
  const queryClient = new QueryClient();

  const {
    data: containers,
    isError,
    isLoading,
  } = useQuery<ContainerItem[]>({
    queryKey: ["containers"],
    queryFn: getContainers,
    refetchInterval: 3000,
  });

  const startMutation = useMutation({
    mutationFn: (id: string) => startContainer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
  });

  const stopMutation = useMutation({
    mutationFn: (id: string) => stopContainer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeContainer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["containers"] });
    },
  });

  const createMutation = useMutation({
      mutationFn: (data: ContainerFormData) => createContainer({
        name: data.name?.trim(),
        image: data.image,
        port: data.port?.trim() || undefined,
        volume: data.volume || undefined,
      }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['containers'] });
      }
    });
  

  return {
    containers,
    isError,
    isLoading,
    startContainer: startMutation.mutateAsync,
    stopContainer: stopMutation.mutateAsync,
    removeContainer: removeMutation.mutateAsync,
    createContainer: createMutation
  };
}
