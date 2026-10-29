import type { MountItem } from "./Mount";

export interface ContainerItem{
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
  created: string;
  ports: string;
  portsDetail: Record<string, any>;
  mounts: MountItem[];
  networks: Record<string, any>;
  env: string[];
}

export interface ContainerFormData {
  name: string;
  image: string;
  port?: string;
  volume?: string;
}

export interface ContainerStats {
  cpu: String; 
  memory: string; 
}