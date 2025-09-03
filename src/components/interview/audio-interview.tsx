"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import DailyIframe, { DailyCall, DailyParticipant, DailyEventObject } from '@daily-co/daily-js'
import { Loader2, Mic, MicOff, PhoneOff, Users, WifiOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Phase 2.2: Audio Interview Component with Daily.co integration

interface AudioInterviewProps {
  roomUrl: string
  token: string
  onInterviewEnd?: () => void
  candidateName?: string
  jobTitle?: string
}

type ConnectionState = 
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'error'
  | 'left'
  | 'reconnecting'

interface ParticipantInfo {
  id: string
  name: string
  isLocal: boolean
  audioTrack?: MediaStreamTrack
  isMuted: boolean
  isActiveSpeaker: boolean
}

export function AudioInterview({
  roomUrl,
  token,
  onInterviewEnd,
  candidateName = 'Candidate',
  jobTitle = 'Position'
}: AudioInterviewProps) {
  // Daily.co call object reference
  const callRef = useRef<DailyCall | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Connection and participant state
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle')
  const [participants, setParticipants] = useState<Map<string, ParticipantInfo>>(new Map())
  const [localParticipant, setLocalParticipant] = useState<ParticipantInfo | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string>('')
  const [networkQuality, setNetworkQuality] = useState<'good' | 'fair' | 'poor'>('good')
  const [interviewDuration, setInterviewDuration] = useState(0)
  
  // Interview timer
  useEffect(() => {
    if (connectionState === 'connected') {
      const timer = setInterval(() => {
        setInterviewDuration(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [connectionState])

  // Initialize Daily.co call object
  const initializeDaily = useCallback(async () => {
    try {
      setConnectionState('connecting')
      setError('')

      // Create call object (audio-only configuration)
      const callObject = DailyIframe.createCallObject({
        audioSource: true,
        videoSource: false, // Audio-only interview
        dailyConfig: {
          experimentalChromeVideoMuteLightOff: true,
        }
      })

      // Store reference
      callRef.current = callObject

      // Set up event listeners
      setupEventListeners(callObject)

      // Join the room
      await callObject.join({
        url: roomUrl,
        token: token,
        userName: candidateName,
      })

      // Successfully connected
      setConnectionState('connected')
      
    } catch (err) {
      console.error('Failed to initialize Daily.co:', err)
      setError('Failed to connect to interview room. Please check your connection.')
      setConnectionState('error')
    }
  }, [roomUrl, token, candidateName])

  // Set up Daily.co event listeners
  const setupEventListeners = (callObject: DailyCall) => {
    // Participant joined
    callObject.on('participant-joined', (event: DailyEventObject) => {
      if (event.participant) {
        handleParticipantUpdate(event.participant)
      }
    })

    // Participant updated (mute/unmute, etc.)
    callObject.on('participant-updated', (event: DailyEventObject) => {
      if (event.participant) {
        handleParticipantUpdate(event.participant)
      }
    })

    // Participant left
    callObject.on('participant-left', (event: DailyEventObject) => {
      if (event.participant) {
        setParticipants(prev => {
          const updated = new Map(prev)
          updated.delete(event.participant.session_id)
          return updated
        })
      }
    })

    // Active speaker change
    callObject.on('active-speaker-change', (event: DailyEventObject) => {
      handleActiveSpeakerChange(event.activeSpeaker?.peerId)
    })

    // Network quality
    callObject.on('network-quality-change', (event: DailyEventObject) => {
      if (event.threshold) {
        if (event.threshold === 'good') setNetworkQuality('good')
        else if (event.threshold === 'low') setNetworkQuality('fair')
        else setNetworkQuality('poor')
      }
    })

    // Connection error
    callObject.on('error', (event: DailyEventObject) => {
      console.error('Daily.co error:', event.errorMsg)
      setError(event.errorMsg || 'An error occurred during the interview')
      setConnectionState('error')
    })

    // Left meeting
    callObject.on('left-meeting', () => {
      setConnectionState('left')
      cleanup()
    })

    // Track started (audio stream available)
    callObject.on('track-started', (event: DailyEventObject) => {
      if (event.participant && event.track && event.track.kind === 'audio') {
        handleAudioTrackStarted(event.participant, event.track)
      }
    })

    // Track stopped
    callObject.on('track-stopped', (event: DailyEventObject) => {
      if (event.participant && event.track && event.track.kind === 'audio') {
        handleAudioTrackStopped(event.participant)
      }
    })
  }

  // Handle participant updates
  const handleParticipantUpdate = (participant: DailyParticipant) => {
    const participantInfo: ParticipantInfo = {
      id: participant.session_id,
      name: participant.user_name || (participant.local ? candidateName : 'AI Interviewer'),
      isLocal: participant.local,
      isMuted: participant.audio === false,
      isActiveSpeaker: false,
    }

    if (participant.local) {
      setLocalParticipant(participantInfo)
      setIsMuted(participant.audio === false)
    }

    setParticipants(prev => {
      const updated = new Map(prev)
      updated.set(participant.session_id, participantInfo)
      return updated
    })
  }

  // Handle active speaker change
  const handleActiveSpeakerChange = (speakerId?: string) => {
    if (!speakerId) return
    
    setParticipants(prev => {
      const updated = new Map(prev)
      // Reset all speakers
      updated.forEach(p => {
        p.isActiveSpeaker = false
      })
      // Set active speaker
      const speaker = updated.get(speakerId)
      if (speaker) {
        speaker.isActiveSpeaker = true
      }
      return new Map(updated)
    })
  }

  // Handle audio track started
  const handleAudioTrackStarted = (participant: DailyParticipant, track: MediaStreamTrack) => {
    setParticipants(prev => {
      const updated = new Map(prev)
      const participantInfo = updated.get(participant.session_id)
      if (participantInfo) {
        participantInfo.audioTrack = track
      }
      return new Map(updated)
    })
  }

  // Handle audio track stopped
  const handleAudioTrackStopped = (participant: DailyParticipant) => {
    setParticipants(prev => {
      const updated = new Map(prev)
      const participantInfo = updated.get(participant.session_id)
      if (participantInfo) {
        participantInfo.audioTrack = undefined
      }
      return new Map(updated)
    })
  }

  // Toggle mute
  const toggleMute = () => {
    if (callRef.current) {
      callRef.current.setLocalAudio(!isMuted)
      setIsMuted(!isMuted)
    }
  }

  // Leave interview
  const leaveInterview = async () => {
    if (callRef.current) {
      await callRef.current.leave()
      cleanup()
      if (onInterviewEnd) {
        onInterviewEnd()
      }
    }
  }

  // Cleanup
  const cleanup = () => {
    if (callRef.current) {
      callRef.current.destroy()
      callRef.current = null
    }
    setParticipants(new Map())
    setLocalParticipant(null)
    setConnectionState('left')
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Initialize on mount
  useEffect(() => {
    if (roomUrl && token && connectionState === 'idle') {
      initializeDaily()
    }

    // Cleanup on unmount
    return () => {
      cleanup()
    }
  }, [roomUrl, token])

  // Render loading state
  if (connectionState === 'connecting') {
    return (
      <Card className="w-full max-w-4xl mx-auto p-8">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#1B4F8C]" />
          <h3 className="text-xl font-semibold">Connecting to Interview Room</h3>
          <p className="text-gray-600">Setting up audio connection...</p>
        </div>
      </Card>
    )
  }

  // Render error state
  if (connectionState === 'error') {
    return (
      <Card className="w-full max-w-4xl mx-auto p-8">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-900">Connection Failed</AlertTitle>
          <AlertDescription className="text-red-700 mt-2">
            {error}
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex gap-3">
          <Button 
            onClick={initializeDaily}
            className="flex-1"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => onInterviewEnd && onInterviewEnd()}
            variant="outline"
            className="flex-1"
          >
            Cancel Interview
          </Button>
        </div>
      </Card>
    )
  }

  // Render interview ended state
  if (connectionState === 'left') {
    return (
      <Card className="w-full max-w-4xl mx-auto p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <PhoneOff className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold">Interview Ended</h3>
          <p className="text-gray-600">Thank you for participating in the interview</p>
          <p className="text-sm text-gray-500">Duration: {formatDuration(interviewDuration)}</p>
        </div>
      </Card>
    )
  }

  // Render connected state
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Interview in Progress</h2>
            <p className="text-gray-600">{jobTitle}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Duration</p>
            <p className="text-xl font-mono font-semibold text-[#1B4F8C]">
              {formatDuration(interviewDuration)}
            </p>
          </div>
        </div>

        {/* Network Quality Indicator */}
        <div className="flex items-center gap-2 text-sm">
          <WifiOff className={`h-4 w-4 ${
            networkQuality === 'good' ? 'text-green-500' : 
            networkQuality === 'fair' ? 'text-yellow-500' : 
            'text-red-500'
          }`} />
          <span className="text-gray-600">
            Connection: {networkQuality === 'good' ? 'Excellent' : 
                       networkQuality === 'fair' ? 'Fair' : 'Poor'}
          </span>
        </div>
      </Card>

      {/* Participants */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Interview Participants</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {Array.from(participants.values()).map(participant => (
            <div 
              key={participant.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                participant.isActiveSpeaker 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {participant.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {participant.isLocal ? 'You' : 'AI Interviewer'}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  participant.isMuted ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {participant.isMuted ? (
                    <MicOff className="h-5 w-5 text-red-600" />
                  ) : (
                    <Mic className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </div>
              
              {/* Audio visualization placeholder */}
              <div className="mt-3 h-8 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] transition-all ${
                  participant.isActiveSpeaker ? 'animate-pulse w-full' : 'w-0'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={toggleMute}
            size="lg"
            variant={isMuted ? 'destructive' : 'default'}
            className={isMuted ? '' : 'bg-[#1B4F8C] hover:bg-[#143A66]'}
          >
            {isMuted ? (
              <>
                <MicOff className="mr-2 h-5 w-5" />
                Unmute
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                Mute
              </>
            )}
          </Button>

          <Button
            onClick={leaveInterview}
            size="lg"
            variant="destructive"
          >
            <PhoneOff className="mr-2 h-5 w-5" />
            End Interview
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          This interview is being recorded for evaluation purposes
        </p>
      </Card>
    </div>
  )
}