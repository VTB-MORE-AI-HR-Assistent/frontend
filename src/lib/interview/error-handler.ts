// Phase 4.2: Comprehensive Error Handling System for Interview

export enum InterviewErrorType {
  // Session Errors
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_INVALID = 'SESSION_INVALID',
  SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',
  
  // Network Errors
  NETWORK_OFFLINE = 'NETWORK_OFFLINE',
  NETWORK_SLOW = 'NETWORK_SLOW',
  CONNECTION_LOST = 'CONNECTION_LOST',
  
  // Permission Errors
  MICROPHONE_DENIED = 'MICROPHONE_DENIED',
  MICROPHONE_NOT_FOUND = 'MICROPHONE_NOT_FOUND',
  MICROPHONE_BUSY = 'MICROPHONE_BUSY',
  
  // Browser Errors
  BROWSER_INCOMPATIBLE = 'BROWSER_INCOMPATIBLE',
  BROWSER_OUTDATED = 'BROWSER_OUTDATED',
  WEBRTC_NOT_SUPPORTED = 'WEBRTC_NOT_SUPPORTED',
  
  // AI Bot Errors
  AI_BOT_TIMEOUT = 'AI_BOT_TIMEOUT',
  AI_BOT_DISCONNECTED = 'AI_BOT_DISCONNECTED',
  AI_BOT_ERROR = 'AI_BOT_ERROR',
  
  // Daily.co Specific
  DAILY_ROOM_FULL = 'DAILY_ROOM_FULL',
  DAILY_ROOM_NOT_FOUND = 'DAILY_ROOM_NOT_FOUND',
  DAILY_TOKEN_INVALID = 'DAILY_TOKEN_INVALID',
  
  // Generic
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface InterviewError {
  type: InterviewErrorType
  message: string
  details?: string
  recoverable: boolean
  suggestedAction?: {
    label: string
    action: () => void | Promise<void>
  }
  reportable: boolean
  timestamp: Date
}

export class InterviewErrorHandler {
  private static errorHistory: InterviewError[] = []
  private static maxHistorySize = 50

  /**
   * Create error object based on error type
   */
  static createError(type: InterviewErrorType, details?: string): InterviewError {
    const errorConfigs: Record<InterviewErrorType, Omit<InterviewError, 'type' | 'timestamp'>> = {
      // Session Errors
      [InterviewErrorType.SESSION_EXPIRED]: {
        message: 'Your interview session has expired',
        details: details || 'The interview link is no longer valid. Please contact HR for a new link.',
        recoverable: false,
        reportable: false
      },
      [InterviewErrorType.SESSION_INVALID]: {
        message: 'Invalid interview session',
        details: details || 'The interview link appears to be invalid. Please check your email for the correct link.',
        recoverable: false,
        reportable: false
      },
      [InterviewErrorType.SESSION_NOT_FOUND]: {
        message: 'Interview session not found',
        details: details || 'We could not find this interview session. It may have been cancelled or rescheduled.',
        recoverable: false,
        reportable: true
      },

      // Network Errors
      [InterviewErrorType.NETWORK_OFFLINE]: {
        message: 'No internet connection',
        details: details || 'Please check your internet connection and try again.',
        recoverable: true,
        reportable: false
      },
      [InterviewErrorType.NETWORK_SLOW]: {
        message: 'Poor network connection',
        details: details || 'Your internet connection is slow. This may affect audio quality.',
        recoverable: true,
        reportable: false
      },
      [InterviewErrorType.CONNECTION_LOST]: {
        message: 'Connection lost',
        details: details || 'The connection to the interview room was lost. Attempting to reconnect...',
        recoverable: true,
        reportable: true
      },

      // Permission Errors
      [InterviewErrorType.MICROPHONE_DENIED]: {
        message: 'Microphone access denied',
        details: details || 'Please allow microphone access to participate in the interview. Check your browser settings.',
        recoverable: true,
        reportable: false
      },
      [InterviewErrorType.MICROPHONE_NOT_FOUND]: {
        message: 'No microphone detected',
        details: details || 'Please connect a microphone to your device and refresh the page.',
        recoverable: true,
        reportable: false
      },
      [InterviewErrorType.MICROPHONE_BUSY]: {
        message: 'Microphone is in use',
        details: details || 'Your microphone is being used by another application. Please close other apps and try again.',
        recoverable: true,
        reportable: false
      },

      // Browser Errors
      [InterviewErrorType.BROWSER_INCOMPATIBLE]: {
        message: 'Browser not supported',
        details: details || 'Please use Chrome, Firefox, Safari, or Edge for the best experience.',
        recoverable: false,
        reportable: false
      },
      [InterviewErrorType.BROWSER_OUTDATED]: {
        message: 'Browser needs update',
        details: details || 'Your browser version is outdated. Please update to the latest version.',
        recoverable: false,
        reportable: false
      },
      [InterviewErrorType.WEBRTC_NOT_SUPPORTED]: {
        message: 'WebRTC not supported',
        details: details || 'Your browser does not support WebRTC. Please use a modern browser.',
        recoverable: false,
        reportable: false
      },

      // AI Bot Errors
      [InterviewErrorType.AI_BOT_TIMEOUT]: {
        message: 'AI interviewer is taking longer than expected',
        details: details || 'The AI interviewer is taking time to join. Please wait a moment.',
        recoverable: true,
        reportable: true
      },
      [InterviewErrorType.AI_BOT_DISCONNECTED]: {
        message: 'AI interviewer disconnected',
        details: details || 'The AI interviewer has disconnected. We are attempting to reconnect.',
        recoverable: true,
        reportable: true
      },
      [InterviewErrorType.AI_BOT_ERROR]: {
        message: 'AI interviewer error',
        details: details || 'There was an error with the AI interviewer. Please try again or contact support.',
        recoverable: true,
        reportable: true
      },

      // Daily.co Specific
      [InterviewErrorType.DAILY_ROOM_FULL]: {
        message: 'Interview room is full',
        details: details || 'The interview room has reached its capacity. Please contact support.',
        recoverable: false,
        reportable: true
      },
      [InterviewErrorType.DAILY_ROOM_NOT_FOUND]: {
        message: 'Interview room not found',
        details: details || 'The interview room could not be found. It may have been closed.',
        recoverable: false,
        reportable: true
      },
      [InterviewErrorType.DAILY_TOKEN_INVALID]: {
        message: 'Authentication failed',
        details: details || 'Your authentication token is invalid. Please use the link from your email.',
        recoverable: false,
        reportable: true
      },

      // Generic
      [InterviewErrorType.UNKNOWN_ERROR]: {
        message: 'An unexpected error occurred',
        details: details || 'Something went wrong. Please try again or contact support if the problem persists.',
        recoverable: true,
        reportable: true
      }
    }

    const error: InterviewError = {
      type,
      ...errorConfigs[type],
      timestamp: new Date()
    }

    // Add to history
    this.addToHistory(error)

    return error
  }

  /**
   * Handle Daily.co specific errors
   */
  static handleDailyError(error: any): InterviewError {
    console.error('[Daily.co Error]', error)

    // Map Daily.co error messages to our error types
    if (error.errorMsg?.includes('room is full')) {
      return this.createError(InterviewErrorType.DAILY_ROOM_FULL)
    }
    if (error.errorMsg?.includes('not found')) {
      return this.createError(InterviewErrorType.DAILY_ROOM_NOT_FOUND)
    }
    if (error.errorMsg?.includes('token') || error.errorMsg?.includes('unauthorized')) {
      return this.createError(InterviewErrorType.DAILY_TOKEN_INVALID)
    }
    if (error.errorMsg?.includes('network') || error.errorMsg?.includes('connection')) {
      return this.createError(InterviewErrorType.CONNECTION_LOST)
    }

    return this.createError(InterviewErrorType.UNKNOWN_ERROR, error.errorMsg)
  }

  /**
   * Check browser compatibility
   */
  static checkBrowserCompatibility(): InterviewError | null {
    // Check if browser is supported
    const userAgent = navigator.userAgent.toLowerCase()
    const isChrome = /chrome/.test(userAgent) && !/edge/.test(userAgent)
    const isFirefox = /firefox/.test(userAgent)
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent)
    const isEdge = /edge/.test(userAgent)

    // Check WebRTC support
    const hasWebRTC = !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.RTCPeerConnection
    )

    if (!hasWebRTC) {
      return this.createError(InterviewErrorType.WEBRTC_NOT_SUPPORTED)
    }

    // Check for very old browsers
    if (!isChrome && !isFirefox && !isSafari && !isEdge) {
      return this.createError(InterviewErrorType.BROWSER_INCOMPATIBLE)
    }

    // Check browser versions (simplified check)
    if (isChrome) {
      const chromeVersion = parseInt(userAgent.match(/chrome\/(\d+)/)?.[1] || '0')
      if (chromeVersion < 80) {
        return this.createError(InterviewErrorType.BROWSER_OUTDATED)
      }
    }

    if (isFirefox) {
      const firefoxVersion = parseInt(userAgent.match(/firefox\/(\d+)/)?.[1] || '0')
      if (firefoxVersion < 75) {
        return this.createError(InterviewErrorType.BROWSER_OUTDATED)
      }
    }

    return null
  }

  /**
   * Check microphone permissions and availability
   */
  static async checkMicrophoneAccess(): Promise<InterviewError | null> {
    try {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return this.createError(InterviewErrorType.BROWSER_INCOMPATIBLE)
      }

      // Try to get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Check if we got any audio tracks
      const audioTracks = stream.getAudioTracks()
      if (audioTracks.length === 0) {
        stream.getTracks().forEach(track => track.stop())
        return this.createError(InterviewErrorType.MICROPHONE_NOT_FOUND)
      }

      // Clean up - stop the tracks
      stream.getTracks().forEach(track => track.stop())
      
      return null
    } catch (error: any) {
      console.error('[Microphone Check Error]', error)

      // Handle different error types
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return this.createError(InterviewErrorType.MICROPHONE_DENIED)
      }
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        return this.createError(InterviewErrorType.MICROPHONE_NOT_FOUND)
      }
      if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        return this.createError(InterviewErrorType.MICROPHONE_BUSY)
      }

      return this.createError(InterviewErrorType.UNKNOWN_ERROR, error.message)
    }
  }

  /**
   * Check network connectivity
   */
  static checkNetworkConnection(): InterviewError | null {
    if (!navigator.onLine) {
      return this.createError(InterviewErrorType.NETWORK_OFFLINE)
    }

    // Check connection type if available
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      const effectiveType = connection.effectiveType
      if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        return this.createError(InterviewErrorType.NETWORK_SLOW)
      }
    }

    return null
  }

  /**
   * Add error to history
   */
  private static addToHistory(error: InterviewError): void {
    this.errorHistory.push(error)
    
    // Trim history if too large
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(-this.maxHistorySize)
    }
  }

  /**
   * Get error history
   */
  static getErrorHistory(): InterviewError[] {
    return [...this.errorHistory]
  }

  /**
   * Clear error history
   */
  static clearErrorHistory(): void {
    this.errorHistory = []
  }

  /**
   * Get recent errors of specific type
   */
  static getRecentErrorsOfType(type: InterviewErrorType, minutes: number = 5): InterviewError[] {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000)
    return this.errorHistory.filter(
      error => error.type === type && error.timestamp > cutoffTime
    )
  }

  /**
   * Check if error type occurred recently
   */
  static hasRecentError(type: InterviewErrorType, minutes: number = 5): boolean {
    return this.getRecentErrorsOfType(type, minutes).length > 0
  }
}