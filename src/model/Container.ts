import type { MountItem } from "./Mount";

export interface ContainerItem{
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
  created: string;
  ports: Record<string, any>;
  mounts: MountItem[];
  networks: Record<string, any>;
  env: string[];
}