import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API

export async function getContainers(){
    try {
        const response = await axios.get(`${API_BASE_URL}/containers`);
        const rawContainers = response.data.data;
        
        return rawContainers.map((container: any) => ({
            id: container.Id.substring(0, 12), 
            name: container.Names?.[0] ? container.Names[0].replace(/^\//, '') : 'Unnamed',
            image: container.Image,
            imageId: container.ImageID, 
            state: container.State,
            status: container.Status,
            ports: container.Ports && container.Ports.length > 0 ? container.Ports
            .filter((p: any) => p.PublicPort)
            .map((p: any) => `${p.PublicPort}:${p.PrivatePort}`)
            .join(', ') || '-': '-',
            created: container.Created,
        }));
  } catch (error) {
    console.error('Error with loading all containers via API:', error);
    throw error;
  }
}

export async function getContainerDetails(id: string) : Promise<any> {
  const response = await axios.get(`${API_BASE_URL}/containers/${id}`);
  const data = response.data.data; 

  return {
      id: data.Id || id,
      name: data.Name ? data.Name.replace(/^\//, '') : 'Unnamed',
      image: data.Config?.Image || 'Unknown',
      state: data.State?.Status || (data.State?.Running ? 'running' : 'stopped'),
      status: data.State?.Status || '-',
      created: data.Created || '',
      ports: data.NetworkSettings?.Ports || {},
      portsDetail: data.NetworkSettings?.Ports || {},
      mounts: (data.Mounts || []).map((m: any) => ({
        type: m.Type || 'volume',
        name: m.Name || '',
        source: m.Source || m.Name || '-',
        destination: m.Destination || '-',
        driver: m.Driver || '',
        rw: m.RW ?? true,
      })),
      networks: data.NetworkSettings?.Networks || {},
      env: data.Config?.Env || [],
    };
}

export async function startContainer(id: string) : Promise<void> {
  await axios.post(`${API_BASE_URL}/containers/${id}/start`);
}

export async function stopContainer(id: string) : Promise<void>{
  await axios.post(`${API_BASE_URL}/containers/${id}/stop`);
}

export async function removeContainer(id: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/containers/${id}`);
}

export async function getContainerLogs(id: string): Promise<string> {
  try {
    const response = await axios.get(`${API_BASE_URL}/containers/${id}/logs`);
    
    const logs = response.data.data || "No logs available.";

    console.log("Response for container:", id, logs);

    return logs;
  } catch (error) {
    console.error(`Failed to fetch logs for container ${id}:`, error);
    throw error;
  }
}