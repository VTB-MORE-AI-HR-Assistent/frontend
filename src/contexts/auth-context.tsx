"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User } from '@/types'
import { ROUTES } from '@/lib/constants'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock function to simulate API call
const mockCheckAuth = (): User | null => {
  // Check if user is stored in localStorage (mock auth)
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('vtb_user')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        // Clean up any old data with role field
        const { role, ...cleanUser } = parsed
        // Return clean user object
        return {
          id: cleanUser.id || '1',
          email: cleanUser.email || '',
          firstName: cleanUser.firstName || 'John',
          lastName: cleanUser.lastName || 'Doe',
          name: cleanUser.name || 'John Doe',
          createdAt: cleanUser.createdAt ? new Date(cleanUser.createdAt) : new Date(),
          updatedAt: cleanUser.updatedAt ? new Date(cleanUser.updatedAt) : new Date(),
        }
      } catch (e) {
        // If parsing fails, clear the invalid data
        localStorage.removeItem('vtb_user')
        return null
      }
    }
  }
  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication status on mount
  useEffect(() => {
    // Clear any old data with role field on mount
    const stored = localStorage.getItem('vtb_user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.role !== undefined) {
          // Old data detected, clear it
          localStorage.removeItem('vtb_user')
        }
      } catch (e) {
        localStorage.removeItem('vtb_user')
      }
    }
    checkAuth()
  }, [])

  const checkAuth = () => {
    setIsLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      const mockUser = mockCheckAuth()
      if (mockUser) {
        // Update localStorage with clean data
        localStorage.setItem('vtb_user', JSON.stringify(mockUser))
      }
      setUser(mockUser)
      setIsLoading(false)
    }, 500)
  }

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would be an API call
    const mockUser: User = {
      id: '1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    // Store in localStorage (mock persistence)
    localStorage.setItem('vtb_user', JSON.stringify(mockUser))
    setUser(mockUser)
    
    // Redirect to dashboard
    router.push(ROUTES.HR_DASHBOARD)
  }

  const logout = () => {
    // Clear user data
    localStorage.removeItem('vtb_user')
    setUser(null)
    
    // Redirect to login
    router.push(ROUTES.LOGIN)
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
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