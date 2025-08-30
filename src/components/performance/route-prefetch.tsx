"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Routes to prefetch on app load
const PRIORITY_ROUTES = [
  '/dashboard',
  '/candidates',
  '/vacancies',
]

// Routes to prefetch on hover/focus
const SECONDARY_ROUTES = [
  '/interview-prep',
  '/candidates/pipeline',
]

export function RoutePrefetch() {
  const router = useRouter()

  useEffect(() => {
    // Prefetch priority routes after initial load
    const prefetchTimer = setTimeout(() => {
      PRIORITY_ROUTES.forEach(route => {
        router.prefetch(route)
      })
    }, 2000) // Wait 2 seconds after load

    // Prefetch secondary routes after priority routes
    const secondaryTimer = setTimeout(() => {
      SECONDARY_ROUTES.forEach(route => {
        router.prefetch(route)
      })
    }, 5000) // Wait 5 seconds after load

    return () => {
      clearTimeout(prefetchTimer)
      clearTimeout(secondaryTimer)
    }
  }, [router])

  return null
}

// Hook to prefetch on interaction
export function usePrefetchOnHover(href: string) {
  const router = useRouter()

  const handleMouseEnter = () => {
    router.prefetch(href)
  }

  const handleFocus = () => {
    router.prefetch(href)
  }

  return {
    onMouseEnter: handleMouseEnter,
    onFocus: handleFocus,
  }
}