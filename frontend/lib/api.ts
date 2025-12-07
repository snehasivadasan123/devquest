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
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Registration failed'
    throw new Error(message)
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data)
    console.log("Login response data:", response.data);
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Login failed'
    throw new Error(message)
  }
}

export async function getMe() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found. Please login.');
    }
    
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || error.message || 'Failed to get user data';
    throw new Error(message);
  }
}
