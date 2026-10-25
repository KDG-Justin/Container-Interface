import axios from 'axios';
import type { ContainerVolume } from '../model/Volume';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API;


export async function getVolumes(): Promise<ContainerVolume[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/volumes`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch volumes:', error);
    throw error;
  }
}

export async function getVolume(name: string): Promise<ContainerVolume>{
  try {
    const response = await axios.get(`${API_BASE_URL}/volumes/${encodeURIComponent(name)}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch volume:', error);
    throw error;
  }
}


export async function removeVolume(name: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/volumes/${encodeURIComponent(name)}`);
  } catch (error) {
    console.error(`Failed to remove volume `, error);
    throw error;
  }
}