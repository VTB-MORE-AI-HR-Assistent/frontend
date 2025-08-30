"use client"

import { useEffect } from 'react'
import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP } from 'web-vitals'

export function WebVitalsReporter() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    // Function to send analytics
    const sendToAnalytics = (metric: { name: string; value: number; rating?: string; delta?: number; id?: string; navigationType?: string }) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Web Vitals]', metric)
        return
      }

      // Send to your analytics endpoint
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      })

      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/vitals', body)
      } else {
        // Fallback to fetch
        fetch('/api/vitals', {
          body,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          keepalive: true,
        }).catch(() => {
          // Silently fail - we don't want to impact user experience
        })
      }
    }

    // Report all Web Vitals
    try {
      onCLS(sendToAnalytics)   // Cumulative Layout Shift
      onFCP(sendToAnalytics)   // First Contentful Paint
      onFID(sendToAnalytics)   // First Input Delay (deprecated, use INP)
      onLCP(sendToAnalytics)   // Largest Contentful Paint
      onTTFB(sendToAnalytics)  // Time to First Byte
      onINP(sendToAnalytics)   // Interaction to Next Paint (replaces FID)
    } catch (error) {
      console.error('Failed to initialize Web Vitals reporting:', error)
    }
  }, [])

  return null
}

// Performance marks for custom metrics
export function measurePerformance(markName: string) {
  if (typeof window === 'undefined') return

  try {
    performance.mark(markName)
  } catch (error) {
    console.error(`Failed to mark performance: ${markName}`, error)
  }
}

// Measure between two marks
export function measureBetween(startMark: string, endMark: string, measureName: string) {
  if (typeof window === 'undefined') return

  try {
    performance.measure(measureName, startMark, endMark)
    const measure = performance.getEntriesByName(measureName)[0]
    
    if (measure) {
      console.log(`[Performance] ${measureName}: ${measure.duration.toFixed(2)}ms`)
    }
  } catch (error) {
    console.error(`Failed to measure performance: ${measureName}`, error)
  }
}