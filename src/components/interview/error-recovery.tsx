// Phase 4.2: Error Recovery Components for Interview
"use client"

import { useState, useEffect } from 'react'
import { AlertCircle, WifiOff, Mic, MicOff, Chrome, RefreshCw, Bot, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { InterviewError, InterviewErrorType, InterviewErrorHandler } from '@/lib/interview/error-handler'
import { cn } from '@/lib/utils'

interface ErrorRecoveryProps {
  error: InterviewError
  onRetry?: () => void | Promise<void>
  onCancel?: () => void
  onReport?: (error: InterviewError) => void
}

export function ErrorRecovery({ error, onRetry, onCancel, onReport }: ErrorRecoveryProps) {
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCountdown, setRetryCountdown] = useState(0)

  // Auto-retry for recoverable errors
  useEffect(() => {
    if (error.recoverable && error.type === InterviewErrorType.CONNECTION_LOST) {
      setRetryCountdown(5)
      const timer = setInterval(() => {
        setRetryCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            handleRetry()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [error])

  const handleRetry = async () => {
    if (isRetrying) return
    setIsRetrying(true)
    
    try {
      if (onRetry) {
        await onRetry()
      }
    } finally {
      setIsRetrying(false)
    }
  }

  const handleReport = () => {
    if (error.reportable && onReport) {
      onReport(error)
    }
  }

  // Get icon based on error type
  const getErrorIcon = () => {
    switch (error.type) {
      case InterviewErrorType.NETWORK_OFFLINE:
      case InterviewErrorType.NETWORK_SLOW:
      case InterviewErrorType.CONNECTION_LOST:
        return <WifiOff className="h-8 w-8" />
      
      case InterviewErrorType.MICROPHONE_DENIED:
      case InterviewErrorType.MICROPHONE_NOT_FOUND:
      case InterviewErrorType.MICROPHONE_BUSY:
        return <MicOff className="h-8 w-8" />
      
      case InterviewErrorType.BROWSER_INCOMPATIBLE:
      case InterviewErrorType.BROWSER_OUTDATED:
      case InterviewErrorType.WEBRTC_NOT_SUPPORTED:
        return <Chrome className="h-8 w-8" />
      
      case InterviewErrorType.AI_BOT_TIMEOUT:
      case InterviewErrorType.AI_BOT_DISCONNECTED:
      case InterviewErrorType.AI_BOT_ERROR:
        return <Bot className="h-8 w-8" />
      
      case InterviewErrorType.SESSION_EXPIRED:
        return <Clock className="h-8 w-8" />
      
      default:
        return <AlertCircle className="h-8 w-8" />
    }
  }

  // Get error severity color
  const getErrorColor = () => {
    if (!error.recoverable) return 'text-red-600 bg-red-100'
    if (error.type.includes('NETWORK_SLOW')) return 'text-yellow-600 bg-yellow-100'
    return 'text-amber-600 bg-amber-100'
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-8">
      <div className="space-y-6">
        {/* Error Icon and Title */}
        <div className="flex flex-col items-center space-y-4">
          <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", getErrorColor())}>
            {getErrorIcon()}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{error.message}</h2>
        </div>

        {/* Error Details */}
        <Alert className={cn(
          "border-l-4",
          error.recoverable ? "border-amber-400" : "border-red-400"
        )}>
          <AlertDescription className="text-gray-700">
            {error.details}
          </AlertDescription>
        </Alert>

        {/* Auto-retry countdown */}
        {retryCountdown > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 text-center">
              Retrying in {retryCountdown} seconds...
            </p>
            <Progress value={(5 - retryCountdown) * 20} className="h-2" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {error.recoverable && onRetry && (
            <Button
              onClick={handleRetry}
              disabled={isRetrying || retryCountdown > 0}
              className="flex-1 bg-[#1B4F8C] hover:bg-[#143A66]"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
          )}

          {onCancel && (
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel Interview
            </Button>
          )}
        </div>

        {/* Report Issue Link */}
        {error.reportable && onReport && (
          <div className="text-center">
            <button
              onClick={handleReport}
              className="text-sm text-[#1B4F8C] hover:underline"
            >
              Report this issue to support
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}

// Microphone Permission Component
interface MicrophonePermissionProps {
  onPermissionGranted: () => void
  onPermissionDenied: () => void
}

export function MicrophonePermission({ onPermissionGranted, onPermissionDenied }: MicrophonePermissionProps) {
  const [checking, setChecking] = useState(false)
  const [status, setStatus] = useState<'checking' | 'granted' | 'denied' | 'prompt'>('checking')

  useEffect(() => {
    checkPermission()
  }, [])

  const checkPermission = async () => {
    setChecking(true)
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName })
      setStatus(result.state as any)
      
      if (result.state === 'granted') {
        onPermissionGranted()
      } else if (result.state === 'denied') {
        onPermissionDenied()
      }

      // Listen for permission changes
      result.addEventListener('change', () => {
        setStatus(result.state as any)
        if (result.state === 'granted') {
          onPermissionGranted()
        } else if (result.state === 'denied') {
          onPermissionDenied()
        }
      })
    } catch (error) {
      console.error('Permission check failed:', error)
      // Fallback to requesting permission directly
      requestPermission()
    } finally {
      setChecking(false)
    }
  }

  const requestPermission = async () => {
    setChecking(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setStatus('granted')
      onPermissionGranted()
    } catch (error) {
      setStatus('denied')
      onPermissionDenied()
    } finally {
      setChecking(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto p-8">
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center",
            status === 'granted' ? "bg-green-100" : 
            status === 'denied' ? "bg-red-100" : 
            "bg-blue-100"
          )}>
            {status === 'granted' ? (
              <Mic className="h-8 w-8 text-green-600" />
            ) : status === 'denied' ? (
              <MicOff className="h-8 w-8 text-red-600" />
            ) : (
              <Mic className="h-8 w-8 text-blue-600" />
            )}
          </div>

          <h3 className="text-xl font-semibold">
            {status === 'granted' ? 'Microphone Ready' :
             status === 'denied' ? 'Microphone Access Blocked' :
             'Microphone Permission Required'}
          </h3>
        </div>

        {status === 'prompt' && (
          <>
            <p className="text-gray-600 text-center">
              We need access to your microphone for the audio interview. 
              Please click "Allow" when your browser asks for permission.
            </p>
            <Button
              onClick={requestPermission}
              disabled={checking}
              className="w-full bg-[#1B4F8C] hover:bg-[#143A66]"
            >
              {checking ? 'Requesting...' : 'Request Microphone Access'}
            </Button>
          </>
        )}

        {status === 'denied' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-900">Access Blocked</AlertTitle>
            <AlertDescription className="text-red-700 mt-2">
              Microphone access has been blocked. To participate in the interview:
              <ol className="mt-2 ml-4 list-decimal">
                <li>Click the lock icon in your browser's address bar</li>
                <li>Find "Microphone" in the permissions</li>
                <li>Change it to "Allow"</li>
                <li>Refresh this page</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        {status === 'granted' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Your microphone is ready for the interview!
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  )
}

// AI Bot Timeout Component
interface AIBotTimeoutProps {
  onRetry: () => void
  onCancel: () => void
  timeoutSeconds?: number
}

export function AIBotTimeout({ onRetry, onCancel, timeoutSeconds = 30 }: AIBotTimeoutProps) {
  const [timeLeft, setTimeLeft] = useState(timeoutSeconds)
  const [status, setStatus] = useState<'waiting' | 'timeout'>('waiting')

  useEffect(() => {
    if (timeLeft > 0 && status === 'waiting') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && status === 'waiting') {
      setStatus('timeout')
    }
  }, [timeLeft, status])

  const progress = ((timeoutSeconds - timeLeft) / timeoutSeconds) * 100

  return (
    <Card className="w-full max-w-md mx-auto p-8">
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center",
            status === 'waiting' ? "bg-blue-100 animate-pulse" : "bg-amber-100"
          )}>
            <Bot className={cn(
              "h-8 w-8",
              status === 'waiting' ? "text-blue-600" : "text-amber-600"
            )} />
          </div>

          <h3 className="text-xl font-semibold">
            {status === 'waiting' 
              ? 'Waiting for AI Interviewer...'
              : 'AI Interviewer Taking Longer Than Expected'}
          </h3>
        </div>

        {status === 'waiting' ? (
          <>
            <p className="text-gray-600 text-center">
              The AI interviewer will join shortly. This usually takes just a moment.
            </p>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 text-center">
                {timeLeft} seconds remaining
              </p>
            </div>
          </>
        ) : (
          <>
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                The AI interviewer is taking longer than expected to join. 
                This could be due to high demand or a technical issue.
              </AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button
                onClick={onRetry}
                className="flex-1 bg-[#1B4F8C] hover:bg-[#143A66]"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}