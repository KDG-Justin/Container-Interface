// Detailed verison of mount
export interface ContainerVolume {
  name: string;
  type: string;
  source: string;
  destination: string;
  rw: boolean;
  driver: string;
  mountpoint: string;
  created: string;
  containers: Array<{
    id: string;
    name: string;
  }>;
}
