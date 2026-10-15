import axios from 'axios';
import type { ContainerImage } from '../model/ContainerImage';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API;


export async function getImages(): Promise<ContainerImage[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/images`);
    console.log(response.data.data); 
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch images:', error);
    throw error;
  }
}