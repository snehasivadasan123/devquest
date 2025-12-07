import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export async function getUserProgress(userId: string) {
  try {
    const response = await axios.get(`${API_URL}/quest/getUserProgress`, {
      params: { userId }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch user progress');
  } 
}

export async function createOrUpdateProgress(data: { 
  userId: string; 
  questId: string; 
  completed: boolean; 
  pointsEarned: number; 
}) {
  try {
    const response = await axios.post(`${API_URL}/quest/createOrUpdateProgress`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to create or update progress');
  } 
}