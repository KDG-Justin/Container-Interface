export interface MountItem {
  type: string;
  name?: string;
  source: string;
  destination: string;
  driver?: string;
  rw: boolean;
}