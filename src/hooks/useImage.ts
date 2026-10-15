import { useQuery } from "@tanstack/react-query";
import type { ContainerImage } from "../model/ContainerImage";
import { getImage } from "../services/ImageService";


export function useImage(id: string){
  const {data: image, isError, isLoading,} = useQuery<ContainerImage>({
    queryKey: ["container-detail", id],
    queryFn: () => getImage(id),
    enabled: !!id, // wordt gefetched als id aanwezig is
  });

  return { image, isError, isLoading };
}
