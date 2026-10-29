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

export async function createContainer(data: {name: string; image: string; port?: string; volume?: string;}): Promise<void> {
  try{
    await axios.post(`${API_BASE_URL}/containers`, data);
  }catch (error){
    console.error("Error with creating container: ", error);
    throw error;  
  }
}

export async function getContainerDetails(id: string): Promise<any> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/containers/${encodeURIComponent(id)}`,
    );

    return response.data.data;
  } catch (error) {
    console.error("Error with loading container detail via API:", error);
    throw error;
  }
}

export async function getContainerStats(id: string): Promise<any> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/containers/${encodeURIComponent(id)}/stats`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error with loading container stats via API:", error);
    throw error;
  }
}

export async function startContainer(id: string): Promise<void> {
  try {
    await axios.post(
      `${API_BASE_URL}/containers/${encodeURIComponent(id)}/start`,
    );
  } catch (error) {
    console.error(`Failed to start container `, error);
    throw error;
  }
}

export async function stopContainer(id: string): Promise<void> {
  try {
    await axios.post(
      `${API_BASE_URL}/containers/${encodeURIComponent(id)}/stop`,
    );
  } catch (error) {
    console.error(`Failed to stop container `, error);
    throw error;
  }
}

export async function removeContainer(id: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/containers/${encodeURIComponent(id)}`);
  } catch (error) {
    console.error(`Failed to remove container `, error);
    throw error;
  }
}

export async function getContainerLogs(id: string): Promise<string> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/containers/${encodeURIComponent(id)}/logs`,
    );
    const logs = response.data.data || "No logs available.";

    return logs;
  } catch (error) {
    console.error(
      `Failed to fetch logs for container ${encodeURIComponent(id)}:`,
      error,
    );
    throw error;
  }
}
