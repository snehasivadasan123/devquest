import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
export async function createQuest(data: QuestData) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed')
  }
}