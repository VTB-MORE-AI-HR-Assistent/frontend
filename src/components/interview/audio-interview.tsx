"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import DailyIframe, { DailyCall, DailyParticipant, DailyEventObject } from '@daily-co/daily-js'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InterviewLayout } from './interview-layout'
import { ParticipantCard } from './participant-card'
import { InterviewControls } from './interview-controls'
import { cn } from '@/lib/utils'

// Phase 3: Custom UI Implementation with VTB branding

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
  audioLevel: number // 0-100 for visualization
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
  const [localAudioLevel, setLocalAudioLevel] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
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

  // Audio level monitoring
  const startAudioLevelMonitoring = (track: MediaStreamTrack) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    const stream = new MediaStream([track])
    const source = audioContextRef.current.createMediaStreamSource(stream)
    const analyser = audioContextRef.current.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.5
    
    source.connect(analyser)
    analyserRef.current = analyser
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    
    const updateLevel = () => {
      if (!analyserRef.current) return
      
      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
      const normalizedLevel = Math.min(100, (average / 128) * 100)
      
      setLocalAudioLevel(normalizedLevel)
    }
    
    audioLevelIntervalRef.current = setInterval(updateLevel, 100)
  }

  const stopAudioLevelMonitoring = () => {
    if (audioLevelIntervalRef.current) {
      clearInterval(audioLevelIntervalRef.current)
      audioLevelIntervalRef.current = null
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect()
      analyserRef.current = null
    }
  }

  // Handle participant updates
  const handleParticipantUpdate = (participant: DailyParticipant) => {
    const participantInfo: ParticipantInfo = {
      id: participant.session_id,
      name: participant.user_name || (participant.local ? candidateName : 'AI Interviewer'),
      isLocal: participant.local,
      isMuted: participant.audio === false,
      isActiveSpeaker: false,
      audioLevel: 0,

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
        
        // Start audio level monitoring for local participant
        if (participant.local) {
          startAudioLevelMonitoring(track)
        }
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
        
        // Stop audio level monitoring for local participant
        if (participant.local) {
          stopAudioLevelMonitoring()
        }
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
    stopAudioLevelMonitoring()
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
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
      <InterviewLayout interviewDuration={0} sessionTitle={jobTitle}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md p-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-[#1B4F8C]" />
              <h3 className="text-xl font-semibold">Connecting to Interview Room</h3>
              <p className="text-gray-600 text-center">Setting up audio connection...</p>
            </div>
          </Card>
        </div>
      </InterviewLayout>
    )
  }

  // Render error state
  if (connectionState === 'error') {
    return (
      <InterviewLayout interviewDuration={0} sessionTitle={jobTitle}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md p-8">
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
        </div>
      </InterviewLayout>
    )
  }

  // Render interview ended state
  if (connectionState === 'left') {
    return (
      <InterviewLayout interviewDuration={interviewDuration} sessionTitle={jobTitle}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">Interview Completed</h3>
              <p className="text-gray-600">Thank you for participating in the interview</p>
              <p className="text-sm text-gray-500">Total Duration: {formatDuration(interviewDuration)}</p>
            </div>
          </Card>
        </div>
      </InterviewLayout>
    )
  }

  // Render connected state with custom UI
  return (
    <InterviewLayout 
      interviewDuration={interviewDuration} 
      sessionTitle={jobTitle}
    >
      <div className="space-y-6">
        {/* Participants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {Array.from(participants.values()).map(participant => {
            // Calculate dynamic audio level for participants
            const audioLevel = participant.isLocal 
              ? (isMuted ? 0 : localAudioLevel)
              : (participant.isActiveSpeaker && !participant.isMuted ? Math.random() * 60 + 20 : 0)
            
            return (
              <ParticipantCard
                key={participant.id}
                name={participant.name}
                role={participant.isLocal ? 'candidate' : 'ai-interviewer'}
                isLocal={participant.isLocal}
                isMuted={participant.isMuted}
                isActiveSpeaker={participant.isActiveSpeaker}
                audioLevel={audioLevel}
                connectionQuality={networkQuality}
                initials={participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              />
            )
          })}
        </div>

        {/* Interview Controls */}
        <InterviewControls
          isMuted={isMuted}
          onMuteToggle={toggleMute}
          onLeaveInterview={leaveInterview}
          connectionQuality={networkQuality}
          audioInputLevel={localAudioLevel}
          isRecording={true}
          interviewDuration={interviewDuration}
          showAdvancedSettings={true}
        />
      </div>
    </InterviewLayout>
  )
}