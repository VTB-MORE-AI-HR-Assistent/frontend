"use client"

import { useEffect, useRef, useState } from 'react'
import DailyIframe from '@daily-co/daily-js'
import { Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface DailyPrebuiltInterviewProps {
  roomUrl?: string
  token?: string
  onInterviewEnd?: () => void
  candidateName?: string
  jobTitle?: string
}

export function DailyPrebuiltInterview({
  roomUrl,
  token,
  onInterviewEnd,
  candidateName = 'Candidate',
  jobTitle = 'Interview'
}: DailyPrebuiltInterviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [callFrame, setCallFrame] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [showMockUI, setShowMockUI] = useState(false)

  useEffect(() => {
    console.log('[DailyPrebuiltInterview] roomUrl:', roomUrl)
    console.log('[DailyPrebuiltInterview] token:', token)
    
    // Check if we have real Daily.co credentials
    // Mock token will include '.mock' at the end
    const isMockToken = !token || token.includes('.mock')
    const hasRealCredentials = roomUrl && roomUrl.includes('daily.co') && !isMockToken
    
    console.log('[DailyPrebuiltInterview] isMockToken:', isMockToken)
    console.log('[DailyPrebuiltInterview] hasRealCredentials:', hasRealCredentials)
    
    if (!hasRealCredentials) {
      console.log('[DailyPrebuiltInterview] Showing mock UI')
      // Show mock UI for testing
      setShowMockUI(true)
      setIsLoading(false)
      return
    }
    
    // Wait for container to be available
    if (!containerRef.current) return

    // Create Daily.co prebuilt iframe
    const initializeDaily = async () => {
      try {
        setIsLoading(true)
        
        // Create the Daily.co iframe with prebuilt UI
        const frame = DailyIframe.createFrame(containerRef.current, {
          iframeStyle: {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            border: '0',
            borderRadius: '12px'
          },
          showLeaveButton: true,
          showFullscreenButton: true,
          // Customize the prebuilt UI theme
          theme: {
            colors: {
              accent: '#1B4F8C',
              accentText: '#FFFFFF',
              background: '#FFFFFF',
              backgroundAccent: '#F3F4F6',
              baseText: '#1F2937',
              border: '#E5E7EB',
              mainAreaBg: '#FFFFFF',
              mainAreaBgAccent: '#F9FAFB',
              mainAreaText: '#1F2937',
              supportiveText: '#6B7280'
            }
          }
        })

        // Join the room
        await frame.join({
          url: roomUrl,
          token: token,
          userName: candidateName,
        })

        setCallFrame(frame)
        setIsLoading(false)

        // Listen for leave event
        frame.on('left-meeting', () => {
          frame.destroy()
          if (onInterviewEnd) {
            onInterviewEnd()
          }
        })

      } catch (err: any) {
        console.error('Failed to initialize Daily.co:', err)
        setError('Failed to connect to interview room. Please check your connection.')
        setIsLoading(false)
        setShowMockUI(true)
      }
    }

    initializeDaily()

    // Cleanup
    return () => {
      if (callFrame) {
        callFrame.destroy()
      }
    }
  }, [roomUrl, token, candidateName, onInterviewEnd])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#1B4F8C]" />
            <h3 className="text-xl font-semibold">Connecting to Interview Room</h3>
            <p className="text-gray-600 text-center">Setting up your interview session...</p>
          </div>
        </Card>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Show mock UI when no Daily.co credentials
  if (showMockUI) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Mock Daily.co prebuilt UI */}
        <div className="flex-1 relative">
          {/* Main video area */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="grid grid-cols-2 gap-4 max-w-5xl w-full p-8">
              {/* Participant 1 - User */}
              <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-[#1B4F8C] rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">АИ</span>
                    </div>
                    <p className="text-white font-medium">{candidateName}</p>
                    <p className="text-gray-400 text-sm">You</p>
                  </div>
                </div>
                {/* Mute indicator */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-gray-900/80 px-3 py-1 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white text-sm">Unmuted</span>
                  </div>
                </div>
              </div>

              {/* Participant 2 - AI */}
              <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">AI</span>
                    </div>
                    <p className="text-white font-medium">AI Interviewer</p>
                    <p className="text-gray-400 text-sm">VTB Assistant</p>
                  </div>
                </div>
                {/* Speaking indicator */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-gray-900/80 px-3 py-1 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm">Speaking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom control bar (Daily.co style) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur">
            <div className="flex items-center justify-center gap-4 p-4">
              {/* Microphone button */}
              <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              {/* Camera button (disabled for audio-only) */}
              <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors opacity-50 cursor-not-allowed">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>

              {/* Screen share button */}
              <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>

              {/* Leave button */}
              <button 
                onClick={() => onInterviewEnd && onInterviewEnd()}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-white font-medium">Leave</span>
              </button>
            </div>
          </div>

          {/* Top bar with meeting info */}
          <div className="absolute top-0 left-0 right-0 bg-gray-900/80 backdrop-blur p-4">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <p className="font-medium">{jobTitle}</p>
                <p className="text-sm text-gray-400">Interview Room</p>
              </div>
              <div className="text-white text-sm">
                <span className="px-3 py-1 bg-red-600 rounded-full">● REC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Note about mock UI */}
        <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-2">
          <p className="text-yellow-800 text-sm text-center">
            <strong>Mock Interface:</strong> This is a simulation of Daily.co's prebuilt UI. 
            With real Daily.co credentials, you'll see their actual video conference interface.
          </p>
        </div>
      </div>
    )
  }

  // Show the Daily.co iframe container
  return (
    <div className="relative h-screen w-full bg-gray-100">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  )
}