// Phase 2.3: Participant Card Component with avatar, audio indicator, and status display
"use client"

import { useEffect, useState } from 'react'
import { User, Bot, Mic, MicOff, Wifi, WifiOff, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ParticipantCardProps {
  name: string
  role: 'candidate' | 'ai-interviewer'
  isLocal?: boolean
  isMuted?: boolean
  isActiveSpeaker?: boolean
  audioLevel?: number // 0-100
  connectionQuality?: 'good' | 'fair' | 'poor' | 'disconnected'
  initials?: string
}

export function ParticipantCard({
  name,
  role,
  isLocal = false,
  isMuted = false,
  isActiveSpeaker = false,
  audioLevel = 0,
  connectionQuality = 'good',
  initials
}: ParticipantCardProps) {
  const [animatedAudioLevel, setAnimatedAudioLevel] = useState(0)
  const [speakingAnimation, setSpeakingAnimation] = useState(false)

  // Animate audio level changes
  useEffect(() => {
    const targetLevel = isMuted ? 0 : audioLevel
    const interval = setInterval(() => {
      setAnimatedAudioLevel(current => {
        const diff = targetLevel - current
        const step = diff * 0.3 // Smooth animation
        
        if (Math.abs(diff) < 0.5) {
          clearInterval(interval)
          return targetLevel
        }
        
        return current + step
      })
    }, 50)

    return () => clearInterval(interval)
  }, [audioLevel, isMuted])

  // Speaking indicator animation
  useEffect(() => {
    if (isActiveSpeaker && !isMuted) {
      setSpeakingAnimation(true)
      const timeout = setTimeout(() => setSpeakingAnimation(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [isActiveSpeaker, isMuted])

  // Generate avatar initials if not provided
  const avatarInitials = initials || name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  // Connection quality colors
  const connectionColors = {
    good: 'text-green-500',
    fair: 'text-yellow-500',
    poor: 'text-red-500',
    disconnected: 'text-gray-400'
  }

  // Connection status badge
  const ConnectionBadge = () => {
    if (connectionQuality === 'disconnected') {
      return (
        <div className="flex items-center gap-1">
          <WifiOff className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-400">Disconnected</span>
        </div>
      )
    }
    
    return (
      <div className="flex items-center gap-1">
        <Wifi className={cn("h-3 w-3", connectionColors[connectionQuality])} />
        <span className={cn("text-xs capitalize", connectionColors[connectionQuality])}>
          {connectionQuality}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative p-6 rounded-xl border-2 bg-white transition-all duration-300",
        isActiveSpeaker && !isMuted && "border-green-500 shadow-lg shadow-green-100",
        !isActiveSpeaker && "border-gray-200",
        speakingAnimation && "animate-pulse-subtle"
      )}
    >
      {/* Connection Status Badge */}
      <div className="absolute top-3 right-3">
        <ConnectionBadge />
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4">
        {/* Avatar with speaking ring */}
        <div className="relative">
          {/* Speaking ring animation */}
          {isActiveSpeaker && !isMuted && (
            <div className="absolute inset-0 -m-2">
              <div className="w-full h-full rounded-full border-4 border-green-400 animate-ping-slow opacity-30" />
              <div className="absolute inset-0 w-full h-full rounded-full border-2 border-green-500 animate-pulse" />
            </div>
          )}
          
          {/* Avatar */}
          <div className={cn(
            "relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden transition-all",
            role === 'ai-interviewer' 
              ? "bg-gradient-to-br from-[#1B4F8C] to-[#2563EB]"
              : "bg-gradient-to-br from-gray-400 to-gray-600",
            isActiveSpeaker && !isMuted && "scale-105"
          )}>
            {role === 'ai-interviewer' ? (
              <Bot className="h-12 w-12 text-white" />
            ) : (
              <div className="text-white">
                {initials ? (
                  <span className="text-2xl font-semibold">{avatarInitials}</span>
                ) : (
                  <User className="h-12 w-12" />
                )}
              </div>
            )}
          </div>

          {/* Mute indicator overlay */}
          {isMuted && (
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
              <MicOff className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        {/* Name and Role */}
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
          <p className="text-sm text-gray-600">
            {role === 'ai-interviewer' ? 'AI Interviewer' : isLocal ? 'You' : 'Candidate'}
          </p>
        </div>

        {/* Audio Level Indicator */}
        <div className="w-full space-y-2">
          {/* Audio status */}
          <div className="flex items-center justify-center gap-2">
            {isMuted ? (
              <div className="flex items-center gap-1 text-red-500">
                <MicOff className="h-4 w-4" />
                <span className="text-sm">Muted</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-green-500">
                <Mic className="h-4 w-4" />
                <span className="text-sm">Active</span>
              </div>
            )}
          </div>

          {/* Audio level visualization */}
          <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
            {/* Background bars */}
            <div className="absolute inset-0 flex items-center justify-center gap-1 px-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-3 bg-gray-200 rounded-full"
                />
              ))}
            </div>
            
            {/* Active audio level */}
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-100 flex items-center justify-center"
              style={{ width: `${animatedAudioLevel}%` }}
            >
              {animatedAudioLevel > 10 && (
                <Volume2 className="h-3 w-3 text-white ml-auto mr-1 animate-pulse" />
              )}
            </div>
          </div>

          {/* Audio level text */}
          {!isMuted && animatedAudioLevel > 0 && (
            <div className="text-center">
              <span className="text-xs text-gray-500">
                Audio Level: {Math.round(animatedAudioLevel)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Speaking indicator text */}
      {isActiveSpeaker && !isMuted && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-bounce-subtle">
            Speaking
          </div>
        </div>
      )}
    </div>
  )
}