import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface RegisterData {
  username: string
  email: string
  password: string
}

interface LoginData {
  email: string
  password: string
}

interface AuthResponse {
  token: string
  user: {
    id: string
    username: string
    email: string
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed')
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed')
  }
}
