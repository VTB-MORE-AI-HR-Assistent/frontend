"use client"

import { AuthProvider } from '@/contexts/auth-context'
import { RouteGuard } from '@/components/auth/route-guard'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <RouteGuard>
        {children}
      </RouteGuard>
    </AuthProvider>
  )
}