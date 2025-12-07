import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface QuestData {
  title: string
  description: string
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
}

  export async function createQuest(data: QuestData) {
    try {
      console.log("Creating quest with data:", data);
      const response = await axios.post(`${API_URL}/quest/createQuest`, data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Quest creation failed')
    }
  }


export async function getAllQuest(page = 1, limit = 10) {
  try {
    console.log("Fetching quests - page:", page, "limit:", limit);
    const response = await axios.get(`${API_URL}/quest/getQuest`, {
      params: { page, limit }
    });
    console.log("Fetched quests:", response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch quests');
  }
}

export async function updateQuestById(id: string,updatedData:any) {
  try {
    const response = await axios.put(`${API_URL}/quest/${id}`,updatedData)
    console.log("Updated quest response:", response.data);
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch quest')
  } 
} 


export async function deleteQuestById(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/quest/${id}`)
    console.log(" quest response:", response.data);
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch quest')
  } 
} 