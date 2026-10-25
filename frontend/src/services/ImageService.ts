import axios from 'axios';
import type { ContainerImage } from '../model/ContainerImage';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API;


export async function getImages(): Promise<ContainerImage[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/images`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch images:', error);
    throw error;
  }
}

export async function getImage(id: string): Promise<ContainerImage>{
  try {
    const response = await axios.get(`${API_BASE_URL}/images/${encodeURIComponent(id)}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch image:', error);
    throw error;
  }
}


export async function removeImage(id: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/images/${encodeURIComponent(id)}`);
  } catch (error) {
    console.error(`Failed to remove image `, error);
    throw error;
  }
}