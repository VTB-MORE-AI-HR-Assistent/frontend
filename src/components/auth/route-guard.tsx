"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { ROUTES } from '@/lib/constants'
import { LoadingScreen } from '@/components/ui/loading-screen'

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: string[]
  redirectTo?: string
}

// Public routes that don't require authentication
const publicRoutes = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  '/forgot-password',
  '/',
  '/about',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
  '/help',
]

// HR-only routes
const hrOnlyRoutes = [
  ROUTES.HR_DASHBOARD,
  '/hr/candidates',
  '/hr/vacancies',
  '/hr/interviews',
  '/hr/analytics',
  '/hr/reports',
  '/hr/team',
  '/hr/company',
  '/hr/settings',
]

// Candidate-only routes
const candidateOnlyRoutes = [
  ROUTES.CANDIDATE_PORTAL,
  '/candidate/applications',
  '/candidate/profile',
  '/candidate/jobs',
  '/candidate/interviews',
]

export function RouteGuard({ 
  children, 
  requireAuth = true,
  requireRole = [],
  redirectTo = ROUTES.LOGIN 
}: RouteGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Wait for auth check to complete
    if (isLoading) return

    const checkAuthorization = () => {
      // Check if route is public
      const isPublicRoute = publicRoutes.includes(pathname)
      
      if (isPublicRoute) {
        // Public routes are always accessible
        setIsAuthorized(true)
        return
      }

      // Check if user is authenticated
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push(redirectTo)
        return
      }

      // Check role-based access
      if (user) {
        // Check if route requires specific role
        const isHRRoute = hrOnlyRoutes.some(route => pathname.startsWith(route))
        const isCandidateRoute = candidateOnlyRoutes.some(route => pathname.startsWith(route))

        if (isHRRoute && user.role !== 'HR_MANAGER') {
          // Redirect to 403 if trying to access HR route without HR role
          router.push('/403')
          return
        }

        if (isCandidateRoute && user.role !== 'CANDIDATE') {
          // Redirect to 403 if trying to access candidate route without candidate role
          router.push('/403')
          return
        }

        // Check if specific roles are required
        if (requireRole.length > 0 && !requireRole.includes(user.role)) {
          router.push('/403')
          return
        }

        // User is authorized
        setIsAuthorized(true)
      }
    }

    checkAuthorization()
  }, [isLoading, isAuthenticated, user, pathname, router, redirectTo, requireRole])

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />
  }

  // Show loading screen while checking authorization
  if (!isAuthorized && requireAuth && !publicRoutes.includes(pathname)) {
    return <LoadingScreen />
  }

  // Render children if authorized or on public route
  return <>{children}</>
}