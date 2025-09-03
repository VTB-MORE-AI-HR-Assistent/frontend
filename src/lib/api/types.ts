// API Types based on OpenAPI specification

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UserDto {
  id: number
  email: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: UserDto
}

export interface RefreshResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface ApiError {
  message: string
  status: number
  error?: string
  path?: string
  timestamp?: string
}