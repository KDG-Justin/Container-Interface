import axios from 'axios';
import type { NetworkItem } from '../model/Network';


const API_BASE_URL = import.meta.env.VITE_BACKEND_API;



export async function getNetworks(): Promise<NetworkItem[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/networks`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch networks:', error);
    throw error;
  }
}

export async function removeNetwork(id: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/networks/${encodeURIComponent(id)}`);
  } catch (error) {
    console.error(`Failed to remove network `, error);
    throw error;
  }
}