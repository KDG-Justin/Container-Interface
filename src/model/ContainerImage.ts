export interface ContainerImage {
  id: string;
  shortId: string;
  tags: string[];
  size: string;
  created: string;
  containers: Array<{
    id: string;
    name: string;
  }>;
}