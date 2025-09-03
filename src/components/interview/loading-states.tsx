// Phase 6.1: Enhanced Loading States for Interview
"use client"

import { useEffect, useState } from 'react'
import { Loader2, Wifi, Bot, Headphones, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export type LoadingStage = 
  | 'connecting'
  | 'joining'
  | 'waiting-ai'
  | 'reconnecting'
  | 'preparing-audio'
  | 'almost-ready'

interface LoadingStateProps {
  stage: LoadingStage
  progress?: number
  message?: string
  subMessage?: string
  error?: boolean
  onTimeout?: () => void
  timeoutDuration?: number
}

export function LoadingState({ 
  stage, 
  progress = 0,
  message,
  subMessage,
  error = false,
  onTimeout,
  timeoutDuration = 30000
}: LoadingStateProps) {
  const [animationStep, setAnimationStep] = useState(0)
  const [timeoutCountdown, setTimeoutCountdown] = useState(Math.floor(timeoutDuration / 1000))

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (onTimeout) {
      const timeout = setTimeout(onTimeout, timeoutDuration)
      const countdownInterval = setInterval(() => {
        setTimeoutCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        clearTimeout(timeout)
        clearInterval(countdownInterval)
      }
    }
  }, [onTimeout, timeoutDuration])

  const getStageIcon = () => {
    switch (stage) {
      case 'connecting':
        return <Wifi className={cn("h-8 w-8", error ? "text-red-500" : "text-[#1B4F8C]")} />
      case 'joining':
      case 'waiting-ai':
        return <Bot className={cn("h-8 w-8", error ? "text-red-500" : "text-[#1B4F8C]")} />
      case 'preparing-audio':
        return <Headphones className={cn("h-8 w-8", error ? "text-red-500" : "text-[#1B4F8C]")} />
      case 'reconnecting':
        return <AlertCircle className="h-8 w-8 text-amber-500" />
      case 'almost-ready':
        return <CheckCircle className="h-8 w-8 text-green-500" />
      default:
        return <Loader2 className="h-8 w-8 text-[#1B4F8C]" />
    }
  }

  const getDefaultMessage = () => {
    switch (stage) {
      case 'connecting':
        return 'Connecting to interview room...'
      case 'joining':
        return 'Joining interview session...'
      case 'waiting-ai':
        return 'Waiting for AI interviewer...'
      case 'reconnecting':
        return 'Reconnecting to interview...'
      case 'preparing-audio':
        return 'Preparing audio devices...'
      case 'almost-ready':
        return 'Almost ready to start...'
      default:
        return 'Loading...'
    }
  }

  const getDefaultSubMessage = () => {
    switch (stage) {
      case 'connecting':
        return 'Establishing secure connection'
      case 'joining':
        return 'Setting up your interview space'
      case 'waiting-ai':
        return 'The AI interviewer will join shortly'
      case 'reconnecting':
        return 'Please wait while we restore your connection'
      case 'preparing-audio':
        return 'Configuring microphone and speakers'
      case 'almost-ready':
        return 'Starting interview in a moment'
      default:
        return ''
    }
  }

  const dots = '.'.repeat(animationStep)
  const displayMessage = message || getDefaultMessage()
  const displaySubMessage = subMessage || getDefaultSubMessage()

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="text-center space-y-6">
        {/* Animated Icon Container */}
        <div className="relative">
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto",
            error ? "bg-red-100" : "bg-blue-100",
            stage === 'reconnecting' && "bg-amber-100",
            stage === 'almost-ready' && "bg-green-100"
          )}>
            <div className={cn(
              "absolute inset-0 rounded-full",
              !error && stage !== 'almost-ready' && "animate-ping-slow",
              error ? "bg-red-200" : "bg-blue-200",
              stage === 'reconnecting' && "bg-amber-200",
              stage === 'almost-ready' && "bg-green-200",
              "opacity-50"
            )} />
            <div className="relative">
              {stage === 'waiting-ai' ? (
                <AIBotAnimation />
              ) : stage === 'connecting' || stage === 'joining' ? (
                <div className={cn(
                  "transition-transform duration-500",
                  !error && "animate-spin-slow"
                )}>
                  {getStageIcon()}
                </div>
              ) : (
                getStageIcon()
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h3 className={cn(
            "text-xl font-semibold",
            error ? "text-red-900" : "text-gray-900"
          )}>
            {displayMessage}{!error && dots}
          </h3>
          {displaySubMessage && (
            <p className={cn(
              "text-sm",
              error ? "text-red-600" : "text-gray-600"
            )}>
              {displaySubMessage}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {progress > 0 && !error && (
          <div className="w-64 mx-auto space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500">{Math.round(progress)}% Complete</p>
          </div>
        )}

        {/* Timeout Warning */}
        {stage === 'waiting-ai' && timeoutCountdown <= 10 && timeoutCountdown > 0 && (
          <p className="text-xs text-amber-600">
            Timeout in {timeoutCountdown} seconds...
          </p>
        )}

        {/* Connection Quality Indicator */}
        {(stage === 'connecting' || stage === 'reconnecting') && !error && (
          <ConnectionQualityIndicator />
        )}
      </div>
    </div>
  )
}

// AI Bot Animation Component
function AIBotAnimation() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % 3)
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <Bot className="h-8 w-8 text-[#1B4F8C]" />
      <div className="absolute -top-1 -right-1">
        <div className={cn(
          "w-2 h-2 rounded-full",
          frame === 0 && "bg-blue-400",
          frame === 1 && "bg-blue-500",
          frame === 2 && "bg-blue-600",
          "animate-pulse"
        )} />
      </div>
    </div>
  )
}

// Connection Quality Indicator
function ConnectionQualityIndicator() {
  const [quality, setQuality] = useState<'checking' | 'poor' | 'fair' | 'good'>('checking')

  useEffect(() => {
    // Simulate connection quality check
    const timeout = setTimeout(() => {
      const random = Math.random()
      if (random < 0.1) setQuality('poor')
      else if (random < 0.3) setQuality('fair')
      else setQuality('good')
    }, 2000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex items-center justify-center space-x-4">
      <span className="text-xs text-gray-500">Connection:</span>
      <div className="flex space-x-1">
        <div className={cn(
          "w-1 h-3 rounded-full",
          quality === 'checking' && "bg-gray-300",
          quality === 'poor' && "bg-red-500",
          quality === 'fair' && "bg-amber-500",
          quality === 'good' && "bg-green-500"
        )} />
        <div className={cn(
          "w-1 h-4 rounded-full",
          quality === 'checking' && "bg-gray-300",
          quality === 'poor' && "bg-gray-300",
          quality === 'fair' && "bg-amber-500",
          quality === 'good' && "bg-green-500"
        )} />
        <div className={cn(
          "w-1 h-5 rounded-full",
          quality === 'checking' && "bg-gray-300",
          quality === 'poor' && "bg-gray-300",
          quality === 'fair' && "bg-gray-300",
          quality === 'good' && "bg-green-500"
        )} />
      </div>
      <span className={cn(
        "text-xs",
        quality === 'checking' && "text-gray-500",
        quality === 'poor' && "text-red-500",
        quality === 'fair' && "text-amber-500",
        quality === 'good' && "text-green-500"
      )}>
        {quality === 'checking' ? 'Checking...' : quality.charAt(0).toUpperCase() + quality.slice(1)}
      </span>
    </div>
  )
}

// Reconnection Attempt Component
interface ReconnectionAttemptProps {
  attempt: number
  maxAttempts: number
  onRetry: () => void
  onCancel: () => void
}

export function ReconnectionAttempt({ 
  attempt, 
  maxAttempts, 
  onRetry, 
  onCancel 
}: ReconnectionAttemptProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onRetry()
          return 5
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [onRetry])

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
          <Wifi className="h-8 w-8 text-amber-600 animate-pulse" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Connection Lost
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Reconnection attempt {attempt} of {maxAttempts}
          </p>
        </div>

        <div className="space-y-2">
          <Progress value={(attempt / maxAttempts) * 100} className="h-2" />
          <p className="text-xs text-gray-500">
            Retrying in {countdown} seconds...
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 px-4 py-2 bg-[#1B4F8C] text-white rounded-lg hover:bg-[#143A66] transition-colors"
          >
            Retry Now
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Card>
  )
}