import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getImage, removeImage } from "../../services/ImageService";
import type { ContainerImage } from "../../model/ContainerImage";

export function useImage(id: string) {
  const queryClient = new QueryClient();

  const {
    data: image,
    isError,
    isLoading,
  } = useQuery<ContainerImage>({
    queryKey: ["image-detail", id],
    queryFn: () => getImage(id),
    enabled: !!id,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
  });

  return {
    image,
    isError,
    isLoading,
    removeImage: removeMutation.mutateAsync,
  };
}
