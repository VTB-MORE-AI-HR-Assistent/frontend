"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { LoadingScreen } from '@/components/ui/loading-screen'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (user) {
      // If authenticated, redirect to dashboard
      router.push('/dashboard')
    } else {
      // If not authenticated, redirect to login
      router.push('/login')
    }
  }, [user, isLoading, router])

  // Show loading screen while checking auth
  return <LoadingScreen />
}