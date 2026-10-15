import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API;

export async function getContainers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/containers`);

    return response.data.data;
  } catch (error) {
    console.error("Error with loading all containers via API:", error);
    throw error;
  }
}

export async function getContainerDetails(id: string): Promise<any> {
  try {
    const response = await axios.get(`${API_BASE_URL}/containers/${id}`);

    return response.data.data;
  } catch (error) {
    console.error("Error with loading container detail via API:", error);
    throw error;
  }
}

export async function startContainer(id: string): Promise<void> {
  await axios.post(`${API_BASE_URL}/containers/${id}/start`);
}

export async function stopContainer(id: string): Promise<void> {
  await axios.post(`${API_BASE_URL}/containers/${id}/stop`);
}

export async function removeContainer(id: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/containers/${id}`);
}

export async function getContainerLogs(id: string): Promise<string> {
  try {
    const response = await axios.get(`${API_BASE_URL}/containers/${id}/logs`);
    const logs = response.data.data || "No logs available.";

    return logs;
  } catch (error) {
    console.error(`Failed to fetch logs for container ${id}:`, error);
    throw error;
  }
}
