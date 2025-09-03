"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User } from '@/types'
import { ROUTES } from '@/lib/constants'
import * as authApi from '@/lib/api/auth'
import { tokenManager } from '@/lib/auth/token-manager'
import { UserDto } from '@/lib/api/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Convert UserDto to User type
function convertUserDtoToUser(userDto: UserDto): User {
  return {
    id: userDto.id.toString(),
    email: userDto.email,
    firstName: userDto.firstName,
    lastName: userDto.lastName,
    name: `${userDto.firstName} ${userDto.lastName}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Check if we have a token
      const token = tokenManager.getAccessToken()
      
      if (token && !tokenManager.isTokenExpired()) {
        // Try to get current user data
        const userDto = await authApi.getCurrentUser()
        const user = convertUserDtoToUser(userDto)
        setUser(user)
        
        // Store user data in localStorage for persistence
        localStorage.setItem('vtb_user', JSON.stringify(user))
      } else if (tokenManager.getRefreshToken()) {
        // Try to refresh token if we have refresh token
        const refreshToken = tokenManager.getRefreshToken()
        if (refreshToken) {
          try {
            await authApi.refreshToken(refreshToken)
            const userDto = await authApi.getCurrentUser()
            const user = convertUserDtoToUser(userDto)
            setUser(user)
            localStorage.setItem('vtb_user', JSON.stringify(user))
          } catch (error) {
            // Refresh failed, clear everything
            tokenManager.clearTokens()
            localStorage.removeItem('vtb_user')
            setUser(null)
          }
        }
      } else {
        // No tokens, check localStorage for cached user data
        const storedUser = localStorage.getItem('vtb_user')
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser)
            // If we have user data but no token, clear it
            localStorage.removeItem('vtb_user')
            setUser(null)
          } catch (e) {
            localStorage.removeItem('vtb_user')
            setUser(null)
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authApi.login({ email, password })
      const user = convertUserDtoToUser(response.user)
      
      // Store user data
      setUser(user)
      localStorage.setItem('vtb_user', JSON.stringify(user))
      
      // Redirect to dashboard
      router.push(ROUTES.HR_DASHBOARD)
    } catch (error: any) {
      setError(error.message || 'Failed to login')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authApi.register({ email, password, firstName, lastName })
      const user = convertUserDtoToUser(response.user)
      
      // Store user data
      setUser(user)
      localStorage.setItem('vtb_user', JSON.stringify(user))
      
      // Redirect to dashboard
      router.push(ROUTES.HR_DASHBOARD)
    } catch (error: any) {
      setError(error.message || 'Failed to register')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear all auth data
    authApi.logout()
    localStorage.removeItem('vtb_user')
    setUser(null)
    setError(null)
    
    // Redirect to login
    router.push(ROUTES.LOGIN)
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}