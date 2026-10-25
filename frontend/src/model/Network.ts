
export interface NetworkItem{
    id: string; 
    shortId: string; 
    name: string; 
    driver: string; 
    scope: string; 
    subnet: string;
    gateway: string; 
    isSystem: boolean; 
    containers: Array<{
    id: string;
    name: string;
  }>;
}