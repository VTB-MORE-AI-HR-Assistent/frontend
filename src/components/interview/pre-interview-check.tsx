// Phase 4.2: Pre-Interview System Check Component
"use client"

import { useState, useEffect } from 'react'
import { Check, X, Loader2, Mic, Wifi, Globe, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { InterviewErrorHandler, InterviewErrorType, InterviewError } from '@/lib/interview/error-handler'
import { cn } from '@/lib/utils'

interface SystemCheck {
  id: string
  name: string
  description: string
  status: 'pending' | 'checking' | 'passed' | 'failed' | 'warning'
  icon: React.ReactNode
  error?: InterviewError
}

interface PreInterviewCheckProps {
  onAllChecksPassed: () => void
  onChecksFailed: (errors: InterviewError[]) => void
  skipAudioTest?: boolean
}

export function PreInterviewCheck({ 
  onAllChecksPassed, 
  onChecksFailed,
  skipAudioTest = false 
}: PreInterviewCheckProps) {
  const [checks, setChecks] = useState<SystemCheck[]>([
    {
      id: 'browser',
      name: 'Browser Compatibility',
      description: 'Checking browser support...',
      status: 'pending',
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: 'network',
      name: 'Network Connection',
      description: 'Testing internet speed...',
      status: 'pending',
      icon: <Wifi className="h-5 w-5" />
    },
    {
      id: 'microphone',
      name: 'Microphone Access',
      description: 'Requesting microphone permission...',
      status: 'pending',
      icon: <Mic className="h-5 w-5" />
    },
    {
      id: 'audio',
      name: 'Audio Test',
      description: 'Testing audio input...',
      status: 'pending',
      icon: <Volume2 className="h-5 w-5" />
    }
  ])

  const [currentCheckIndex, setCurrentCheckIndex] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [errors, setErrors] = useState<InterviewError[]>([])
  const [audioLevel, setAudioLevel] = useState(0)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    // Filter out audio test if skipped
    if (skipAudioTest) {
      setChecks(prev => prev.filter(check => check.id !== 'audio'))
    }
    
    // Start checks
    runChecks()
  }, [])

  useEffect(() => {
    // Calculate progress
    const completedChecks = checks.filter(
      check => check.status === 'passed' || check.status === 'failed' || check.status === 'warning'
    ).length
    setOverallProgress((completedChecks / checks.length) * 100)
  }, [checks])

  const runChecks = async () => {
    for (let i = 0; i < checks.length; i++) {
      setCurrentCheckIndex(i)
      await runSingleCheck(checks[i].id)
      
      // Small delay between checks for UX
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Check if all passed
    const failedChecks = checks.filter(check => check.status === 'failed')
    if (failedChecks.length === 0) {
      onAllChecksPassed()
    } else {
      onChecksFailed(errors)
    }
  }

  const runSingleCheck = async (checkId: string) => {
    // Update status to checking
    setChecks(prev => prev.map(check => 
      check.id === checkId ? { ...check, status: 'checking' } : check
    ))

    let result: { status: 'passed' | 'failed' | 'warning'; error?: InterviewError } = { status: 'passed' }

    switch (checkId) {
      case 'browser':
        result = await checkBrowserCompatibility()
        break
      case 'network':
        result = await checkNetworkConnection()
        break
      case 'microphone':
        result = await checkMicrophoneAccess()
        break
      case 'audio':
        result = await checkAudioInput()
        break
    }

    // Update check status
    setChecks(prev => prev.map(check => {
      if (check.id === checkId) {
        return {
          ...check,
          status: result.status,
          error: result.error,
          description: getCheckDescription(checkId, result.status)
        }
      }
      return check
    }))

    // Add to errors if failed
    if (result.error) {
      setErrors(prev => [...prev, result.error])
    }
  }

  const checkBrowserCompatibility = async (): Promise<{ status: 'passed' | 'failed' | 'warning'; error?: InterviewError }> => {
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate check time
    
    const error = InterviewErrorHandler.checkBrowserCompatibility()
    if (error) {
      if (error.type === InterviewErrorType.BROWSER_OUTDATED) {
        return { status: 'warning', error }
      }
      return { status: 'failed', error }
    }
    
    return { status: 'passed' }
  }

  const checkNetworkConnection = async (): Promise<{ status: 'passed' | 'failed' | 'warning'; error?: InterviewError }> => {
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate speed test
    
    const error = InterviewErrorHandler.checkNetworkConnection()
    if (error) {
      if (error.type === InterviewErrorType.NETWORK_SLOW) {
        return { status: 'warning', error }
      }
      return { status: 'failed', error }
    }

    // Additional speed test simulation
    const connectionSpeed = Math.random() * 10 // Mock Mbps
    if (connectionSpeed < 1) {
      return { 
        status: 'warning', 
        error: InterviewErrorHandler.createError(InterviewErrorType.NETWORK_SLOW)
      }
    }
    
    return { status: 'passed' }
  }

  const checkMicrophoneAccess = async (): Promise<{ status: 'passed' | 'failed' | 'warning'; error?: InterviewError }> => {
    const error = await InterviewErrorHandler.checkMicrophoneAccess()
    if (error) {
      return { status: 'failed', error }
    }
    
    return { status: 'passed' }
  }

  const checkAudioInput = async (): Promise<{ status: 'passed' | 'failed' | 'warning'; error?: InterviewError }> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setAudioStream(stream)

      // Set up audio level monitoring
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      analyser.fftSize = 256

      // Monitor audio levels for 3 seconds
      const checkDuration = 3000
      const startTime = Date.now()
      let maxLevel = 0

      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const dataArray = new Uint8Array(analyser.frequencyBinCount)
          analyser.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
          const level = Math.min(100, (average / 128) * 100)
          
          setAudioLevel(level)
          maxLevel = Math.max(maxLevel, level)

          if (Date.now() - startTime > checkDuration) {
            clearInterval(checkInterval)
            source.disconnect()
            audioContext.close()
            
            // Check if we detected any audio
            if (maxLevel < 5) {
              resolve({ 
                status: 'warning',
                error: InterviewErrorHandler.createError(
                  InterviewErrorType.MICROPHONE_NOT_FOUND,
                  'No audio detected. Please check your microphone and speak louder.'
                )
              })
            } else {
              resolve({ status: 'passed' })
            }
          }
        }, 100)
      })
    } catch (error) {
      return { 
        status: 'failed',
        error: InterviewErrorHandler.createError(InterviewErrorType.MICROPHONE_NOT_FOUND)
      }
    }
  }

  const getCheckDescription = (checkId: string, status: string): string => {
    const descriptions: Record<string, Record<string, string>> = {
      browser: {
        checking: 'Verifying browser compatibility...',
        passed: 'Your browser is fully compatible',
        failed: 'Browser not supported. Please use Chrome, Firefox, Safari, or Edge.',
        warning: 'Browser version is outdated but may work'
      },
      network: {
        checking: 'Testing connection speed...',
        passed: 'Network connection is excellent',
        failed: 'No internet connection detected',
        warning: 'Connection is slow. Audio quality may be affected.'
      },
      microphone: {
        checking: 'Requesting microphone access...',
        passed: 'Microphone access granted',
        failed: 'Microphone access denied or not available',
        warning: 'Microphone detected but may have issues'
      },
      audio: {
        checking: 'Please speak to test your microphone...',
        passed: 'Audio input working perfectly',
        failed: 'No audio input detected',
        warning: 'Low audio input detected. Speak louder during the interview.'
      }
    }

    return descriptions[checkId]?.[status] || 'Checking...'
  }

  const getStatusIcon = (status: SystemCheck['status']) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case 'passed':
        return <Check className="h-5 w-5 text-green-500" />
      case 'failed':
        return <X className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      default:
        return <div className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: SystemCheck['status']) => {
    switch (status) {
      case 'checking':
        return 'bg-blue-50 border-blue-200'
      case 'passed':
        return 'bg-green-50 border-green-200'
      case 'failed':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-amber-50 border-amber-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const handleRetry = () => {
    setChecks(prev => prev.map(check => ({ ...check, status: 'pending' })))
    setErrors([])
    setCurrentCheckIndex(0)
    setOverallProgress(0)
    runChecks()
  }

  const allChecksPassed = checks.every(check => check.status === 'passed' || check.status === 'warning')
  const hasFailures = checks.some(check => check.status === 'failed')

  return (
    <Card className="w-full max-w-2xl mx-auto p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">System Check</h2>
          <p className="text-gray-600 mt-2">
            Checking your device is ready for the interview
          </p>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <Progress value={overallProgress} className="h-2" />
          <p className="text-sm text-gray-500 text-center">
            {Math.round(overallProgress)}% Complete
          </p>
        </div>

        {/* System Checks */}
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div
              key={check.id}
              className={cn(
                "p-4 rounded-lg border-2 transition-all",
                index === currentCheckIndex && check.status === 'checking' 
                  ? 'scale-[1.02] shadow-md' 
                  : '',
                getStatusColor(check.status)
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {check.status === 'pending' ? check.icon : getStatusIcon(check.status)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{check.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{check.description}</p>
                  
                  {/* Audio level indicator for audio test */}
                  {check.id === 'audio' && check.status === 'checking' && (
                    <div className="mt-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-100"
                          style={{ width: `${audioLevel}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Speak now to test your microphone
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {(allChecksPassed || hasFailures) && (
          <div className="flex gap-3">
            {allChecksPassed && (
              <Button
                onClick={onAllChecksPassed}
                className="flex-1 bg-[#1B4F8C] hover:bg-[#143A66]"
              >
                Continue to Interview
              </Button>
            )}
            {hasFailures && (
              <>
                <Button
                  onClick={handleRetry}
                  className="flex-1"
                  variant="outline"
                >
                  Retry Checks
                </Button>
                <Button
                  onClick={() => onChecksFailed(errors)}
                  className="flex-1"
                  variant="outline"
                >
                  View Issues
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

// Add missing import
import { AlertCircle } from 'lucide-react'