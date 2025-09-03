"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { ROUTES } from '@/lib/constants'
import { LoadingScreen } from '@/components/ui/loading-screen'

interface RouteGuardProps {
  children: React.ReactNode
}

// Public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/403',
  '/404',
  '/',
  '/mock-email',
  '/test-interview',
  '/test-daily'
]

// Routes that should be publicly accessible with any path (like interview sessions)
const publicRoutePrefixes = [
  '/interview/'  // All interview sessions are public
]

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Wait for auth check to complete
    if (isLoading) return

    // Check if route is public (exact match or prefix match)
    const isPublicRoute = publicRoutes.includes(pathname) || 
                         publicRoutePrefixes.some(prefix => pathname.startsWith(prefix))
    
    if (isPublicRoute) {
      // Public routes are always accessible
      return
    }

    // Check if user is authenticated for protected routes
    if (!user) {
      // Redirect to login if not authenticated
      router.push(ROUTES.LOGIN)
      return
    }
  }, [isLoading, user, pathname, router])

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />
  }

  // Check if this is a public route (exact match or prefix match)
  const isPublicRoute = publicRoutes.includes(pathname) || 
                       publicRoutePrefixes.some(prefix => pathname.startsWith(prefix))
  
  // For protected routes, ensure user is authenticated
  if (!isPublicRoute && !user) {
    // Don't render protected content if not authenticated
    return null
  }

  // Render children
  return <>{children}</>
}