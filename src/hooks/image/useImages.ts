import { useQuery } from "@tanstack/react-query";
import type { ContainerImage } from "../../model/ContainerImage";
import { getImages } from "../../services/ImageService";

export function useImages() {
  const {
    data: images,
    isError,
    isLoading,
  } = useQuery<ContainerImage[]>({
    queryKey: ["images"],
    queryFn: getImages,
    refetchInterval: 3000,
  });

  return {
    images,
    isError,
    isLoading,
  };
}
