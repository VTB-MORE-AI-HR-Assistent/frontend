// Phase 6.4: Browser Notifications Service
"use client"

export type NotificationType = 
  | 'ai-joined'
  | 'connection-lost'
  | 'connection-restored'
  | 'interview-ending'
  | 'interview-completed'
  | 'microphone-muted'
  | 'microphone-unmuted'
  | 'error'

interface NotificationConfig {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
  silent?: boolean
  vibrate?: number[]
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

export class BrowserNotificationService {
  private static permission: NotificationPermission = 'default'
  private static notifications: Map<string, Notification> = new Map()
  private static isSupported = typeof window !== 'undefined' && 'Notification' in window
  private static vtbIcon = '/icon-192x192.png' // VTB icon path
  private static vtbBadge = '/icon-48x48.png' // VTB badge path

  /**
   * Initialize notification service and request permission
   */
  static async init(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Browser notifications are not supported')
      return false
    }

    // Check current permission status
    this.permission = Notification.permission

    // Request permission if not already granted or denied
    if (this.permission === 'default') {
      try {
        this.permission = await Notification.requestPermission()
      } catch (error) {
        console.error('Failed to request notification permission:', error)
        return false
      }
    }

    return this.permission === 'granted'
  }

  /**
   * Check if notifications are enabled
   */
  static isEnabled(): boolean {
    return this.isSupported && this.permission === 'granted'
  }

  /**
   * Get notification configuration for different types
   */
  private static getNotificationConfig(type: NotificationType): NotificationConfig {
    const configs: Record<NotificationType, NotificationConfig> = {
      'ai-joined': {
        title: 'AI Interviewer Joined',
        body: 'The AI interviewer has joined the interview. You can begin when ready.',
        tag: 'ai-joined',
        silent: false,
        vibrate: [200, 100, 200]
      },
      'connection-lost': {
        title: 'Connection Lost',
        body: 'Your connection to the interview has been interrupted. Attempting to reconnect...',
        tag: 'connection',
        requireInteraction: true,
        vibrate: [500]
      },
      'connection-restored': {
        title: 'Connection Restored',
        body: 'Your connection has been restored. The interview can continue.',
        tag: 'connection',
        silent: false,
        vibrate: [100, 50, 100]
      },
      'interview-ending': {
        title: 'Interview Ending Soon',
        body: 'Your interview will end in 5 minutes. Please prepare to conclude.',
        tag: 'interview-time',
        requireInteraction: false,
        vibrate: [200]
      },
      'interview-completed': {
        title: 'Interview Completed',
        body: 'Thank you for completing your interview. HR will contact you with results.',
        tag: 'interview-complete',
        silent: false,
        vibrate: [100, 100, 100]
      },
      'microphone-muted': {
        title: 'Microphone Muted',
        body: 'Your microphone is now muted.',
        tag: 'microphone',
        silent: true
      },
      'microphone-unmuted': {
        title: 'Microphone Unmuted',
        body: 'Your microphone is now active.',
        tag: 'microphone',
        silent: true
      },
      'error': {
        title: 'Interview Error',
        body: 'An error occurred during the interview. Please check your connection.',
        tag: 'error',
        requireInteraction: true,
        vibrate: [1000]
      }
    }

    return configs[type]
  }

  /**
   * Show a browser notification
   */
  static async show(
    type: NotificationType,
    customOptions?: Partial<NotificationConfig>
  ): Promise<void> {
    if (!this.isEnabled()) {
      console.log(`Notification (${type}) - notifications not enabled`)
      return
    }

    const config = this.getNotificationConfig(type)
    const options: NotificationOptions = {
      body: customOptions?.body || config.body,
      icon: customOptions?.icon || config.icon || this.vtbIcon,
      badge: customOptions?.badge || config.badge || this.vtbBadge,
      tag: customOptions?.tag || config.tag,
      requireInteraction: customOptions?.requireInteraction ?? config.requireInteraction,
      silent: customOptions?.silent ?? config.silent,
      vibrate: customOptions?.vibrate || config.vibrate,
      data: {
        type,
        timestamp: Date.now()
      }
    }

    try {
      // Close existing notification with same tag if any
      if (options.tag) {
        const existing = this.notifications.get(options.tag)
        if (existing) {
          existing.close()
        }
      }

      // Create new notification
      const notification = new Notification(
        customOptions?.title || config.title,
        options
      )

      // Store notification reference
      if (options.tag) {
        this.notifications.set(options.tag, notification)
      }

      // Set up event handlers
      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      notification.onerror = (error) => {
        console.error('Notification error:', error)
      }

      // Auto-close after 10 seconds (unless requireInteraction is true)
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close()
        }, 10000)
      }

    } catch (error) {
      console.error('Failed to show notification:', error)
    }
  }

  /**
   * Close a specific notification by tag
   */
  static close(tag: string) {
    const notification = this.notifications.get(tag)
    if (notification) {
      notification.close()
      this.notifications.delete(tag)
    }
  }

  /**
   * Close all notifications
   */
  static closeAll() {
    this.notifications.forEach(notification => notification.close())
    this.notifications.clear()
  }

  /**
   * Show interview milestone notifications
   */
  static showMilestone(
    title: string,
    body: string,
    options?: Partial<NotificationConfig>
  ) {
    this.show('ai-joined', {
      title,
      body,
      ...options
    })
  }

  /**
   * Check if page is visible
   */
  static isPageVisible(): boolean {
    if (typeof document === 'undefined') return true
    return document.visibilityState === 'visible'
  }

  /**
   * Only show notification if page is not visible
   */
  static showIfHidden(
    type: NotificationType,
    customOptions?: Partial<NotificationConfig>
  ) {
    if (!this.isPageVisible()) {
      this.show(type, customOptions)
    }
  }
}

// Custom hook for using notifications
import { useEffect, useCallback, useState } from 'react'

export function useBrowserNotifications() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    const initNotifications = async () => {
      setIsSupported(typeof window !== 'undefined' && 'Notification' in window)
      const enabled = await BrowserNotificationService.init()
      setIsEnabled(enabled)
    }

    initNotifications()

    // Clean up on unmount
    return () => {
      BrowserNotificationService.closeAll()
    }
  }, [])

  const showNotification = useCallback(
    (type: NotificationType, options?: Partial<NotificationConfig>) => {
      BrowserNotificationService.show(type, options)
    },
    []
  )

  const showIfHidden = useCallback(
    (type: NotificationType, options?: Partial<NotificationConfig>) => {
      BrowserNotificationService.showIfHidden(type, options)
    },
    []
  )

  const requestPermission = useCallback(async () => {
    const enabled = await BrowserNotificationService.init()
    setIsEnabled(enabled)
    return enabled
  }, [])

  return {
    isEnabled,
    isSupported,
    showNotification,
    showIfHidden,
    requestPermission
  }
}

// Interview-specific notification scheduler
export class InterviewNotificationScheduler {
  private static timers: Map<string, NodeJS.Timeout> = new Map()

  /**
   * Schedule a notification for interview ending
   */
  static scheduleEndingNotification(minutesBeforeEnd: number = 5) {
    const timerId = 'ending-notification'
    
    // Clear existing timer if any
    this.clearScheduled(timerId)

    // Schedule new timer
    const timer = setTimeout(() => {
      BrowserNotificationService.show('interview-ending', {
        body: `Your interview will end in ${minutesBeforeEnd} minutes. Please prepare to conclude your answers.`
      })
    }, (minutesBeforeEnd * 60 - minutesBeforeEnd) * 60 * 1000) // Notify X minutes before end

    this.timers.set(timerId, timer)
  }

  /**
   * Clear a scheduled notification
   */
  static clearScheduled(timerId: string) {
    const timer = this.timers.get(timerId)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(timerId)
    }
  }

  /**
   * Clear all scheduled notifications
   */
  static clearAll() {
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
  }
}

// Notification permission prompt component
export function NotificationPermissionPrompt({ 
  onAllow,
  onDeny 
}: {
  onAllow?: () => void
  onDeny?: () => void
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setShow(Notification.permission === 'default')
    }
  }, [])

  const handleAllow = async () => {
    const enabled = await BrowserNotificationService.init()
    setShow(false)
    if (enabled && onAllow) {
      onAllow()
    } else if (!enabled && onDeny) {
      onDeny()
    }
  }

  const handleDeny = () => {
    setShow(false)
    if (onDeny) {
      onDeny()
    }
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-[#1B4F8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            Enable Notifications
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Get notified about important interview events
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleAllow}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-[#1B4F8C] hover:bg-[#143A66]"
            >
              Allow
            </button>
            <button
              onClick={handleDeny}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}