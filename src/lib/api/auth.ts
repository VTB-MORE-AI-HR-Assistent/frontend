import apiClient from './client'
import { tokenManager } from '../auth/token-manager'
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshRequest,
  RefreshResponse,
  UserDto,
} from './types'

// Login user
export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', data)
    
    // Store tokens
    tokenManager.setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    })
    
    return response.data
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Invalid email or password')
    }
    throw new Error(error.response?.data?.message || 'Failed to login')
  }
}

// Register new user
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/register', data)
    
    // Store tokens
    tokenManager.setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    })
    
    return response.data
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error('User with this email already exists')
    }
    if (error.response?.status === 400) {
      throw new Error('Invalid registration data')
    }
    throw new Error(error.response?.data?.message || 'Failed to register')
  }
}

// Refresh access token
export async function refreshToken(refreshToken: string): Promise<RefreshResponse> {
  try {
    const response = await apiClient.post<RefreshResponse>('/api/v1/auth/refresh', {
      refreshToken,
    } as RefreshRequest)
    
    // Update access token
    tokenManager.updateAccessToken(response.data.accessToken, response.data.expiresIn)
    
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to refresh token')
  }
}

// Get current user
export async function getCurrentUser(): Promise<UserDto> {
  try {
    const response = await apiClient.get<UserDto>('/api/v1/users/me')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get user data')
  }
}

// Logout user (client-side only, backend doesn't have logout endpoint)
export function logout(): void {
  tokenManager.clearTokens()
}