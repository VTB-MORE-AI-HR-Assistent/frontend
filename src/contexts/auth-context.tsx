"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User, UserRole } from '@/types'
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
      return JSON.parse(storedUser)
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
    checkAuth()
  }, [])

  const checkAuth = () => {
    setIsLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      const mockUser = mockCheckAuth()
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
      role: 'HR_MANAGER' as UserRole,
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