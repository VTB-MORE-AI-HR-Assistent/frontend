'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, Square, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Message {
  id: string
  sender: string
  content: string
  type: 'user' | 'bot' | 'system'
  timestamp: Date
}

interface WebSocketAudioInterviewProps {
  sessionId: string
  candidateName: string
  wsUrl?: string
}

export default function WebSocketAudioInterview({
  sessionId,
  candidateName,
  wsUrl = 'ws://localhost:8000/ws'
}: WebSocketAudioInterviewProps) {
  // Connection state
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [audioLevel, setAudioLevel] = useState(0)

  // Refs
  const wsRef = useRef<WebSocket | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioPlayerRef = useRef<HTMLAudioElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setConnectionState('connecting')
    
    try {
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log('[WebSocket] Connected to server')
        setConnectionState('connected')
        
        // Send session info
        wsRef.current?.send(JSON.stringify({
          type: 'session_start',
          sessionId,
          candidateName
        }))
      }

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'audio') {
            // Add bot message
            const message: Message = {
              id: Date.now().toString(),
              sender: 'AI Interviewer',
              content: data.text || 'Audio response received',
              type: 'bot',
              timestamp: new Date()
            }
            setMessages(prev => [...prev, message])

            // Play audio response
            if (data.data && audioPlayerRef.current) {
              const audioBlob = base64ToBlob(data.data, 'audio/mpeg')
              const audioUrl = URL.createObjectURL(audioBlob)
              audioPlayerRef.current.src = audioUrl
              audioPlayerRef.current.play().catch(e => 
                console.log('[Audio] Auto-play prevented:', e)
              )
            }
          } else if (data.type === 'transcription') {
            // Add user message from transcription
            const message: Message = {
              id: Date.now().toString(),
              sender: candidateName,
              content: data.text,
              type: 'user',
              timestamp: new Date()
            }
            setMessages(prev => [...prev, message])
          } else if (data.type === 'error') {
            const message: Message = {
              id: Date.now().toString(),
              sender: 'System',
              content: data.message || 'An error occurred',
              type: 'system',
              timestamp: new Date()
            }
            setMessages(prev => [...prev, message])
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error)
        }
      }

      wsRef.current.onclose = () => {
        console.log('[WebSocket] Connection closed')
        setConnectionState('disconnected')
        
        // Auto-reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000)
      }

      wsRef.current.onerror = (error) => {
        console.error('[WebSocket] Connection error:', error)
        setConnectionState('disconnected')
      }
    } catch (error) {
      console.error('[WebSocket] Failed to connect:', error)
      setConnectionState('disconnected')
    }
  }, [wsUrl, sessionId, candidateName])

  // Audio recording
  const startRecording = async () => {
    try {
      console.log('[Audio] Requesting microphone access...')
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      })

      console.log('[Audio] Microphone access granted')
      
      // Debug stream info
      const tracks = stream.getTracks()
      console.log('[Audio] Stream tracks:', tracks.length)
      tracks.forEach((track, index) => {
        console.log(`[Audio] Track ${index}:`, {
          kind: track.kind,
          enabled: track.enabled,
          readyState: track.readyState,
          muted: track.muted
        })
      })

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        
        // Convert to base64 and send
        const reader = new FileReader()
        reader.onload = () => {
          const base64Audio = (reader.result as string).split(',')[1]
          
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              type: 'audio',
              data: base64Audio,
              sessionId
            }))
          }
        }
        reader.readAsDataURL(audioBlob)
      }

      mediaRecorderRef.current.start(1000) // Record in 1-second chunks
      
      // Setup audio visualization BEFORE setting isRecording to true
      setupAudioVisualization(stream)
      
      setIsRecording(true)

    } catch (error) {
      console.error('[Audio] Recording error:', error)
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Microphone access denied. Please allow microphone permissions and try again.')
        } else if (error.name === 'NotFoundError') {
          alert('No microphone found. Please connect a microphone and try again.')
        } else if (error.name === 'NotSupportedError') {
          alert('Your browser does not support audio recording. Please use Chrome, Firefox, or Safari.')
        } else {
          alert(`Microphone error: ${error.message}`)
        }
      } else {
        alert('Failed to access microphone. Please check permissions and try again.')
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop())
      setIsRecording(false)

      // Stop visualization
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }

      // Clear canvas
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  // Audio visualization
  const setupAudioVisualization = (stream: MediaStream) => {
    console.log('[Audio] Setting up visualization...')
    
    // Debug AudioContext creation
    try {
      audioContextRef.current = new AudioContext()
      console.log('[Audio] AudioContext created:', {
        state: audioContextRef.current.state,
        sampleRate: audioContextRef.current.sampleRate
      })
      
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      
      console.log('[Audio] MediaStreamSource created')
      
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256
      analyserRef.current.smoothingTimeConstant = 0.8
      
      console.log('[Audio] Analyser configured:', {
        fftSize: analyserRef.current.fftSize,
        frequencyBinCount: analyserRef.current.frequencyBinCount,
        smoothingTimeConstant: analyserRef.current.smoothingTimeConstant
      })
    } catch (error) {
      console.error('[Audio] Visualization setup error:', error)
    }

    const bufferLength = analyserRef.current?.frequencyBinCount || 128
    const dataArray = new Uint8Array(bufferLength)

    function draw() {
      // Don't check isRecording state here - let it run while recording is active
      // The animation will be stopped by cancelAnimationFrame in stopRecording

      animationFrameRef.current = requestAnimationFrame(draw)

      if (!analyserRef.current) {
        console.log('[Audio] Draw stopped - no analyser')
        return
      }

      // Get frequency data for visualization
      analyserRef.current.getByteFrequencyData(dataArray)
      
      // Debug first few values (reduced logging now that it works)
      if (Math.random() < 0.01) { // 1% of the time
        console.log('[Audio] Frequency values:', Array.from(dataArray.slice(0, 10)), 'Max:', Math.max(...dataArray))
      }

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Clear canvas
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw audio bars
      const barWidth = (canvas.width / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#667eea')
        gradient.addColorStop(1, '#764ba2')

        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }

      // Calculate average audio level AFTER drawing (like working HTML)
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      const avgLevel = sum / bufferLength / 255
      setAudioLevel(avgLevel)
      
      // Debug logging
      if (Math.random() < 0.1) { // Log 10% of the time to avoid spam
        console.log('[Audio] Level:', Math.round(avgLevel * 100) + '%', 'Raw sum:', sum, 'Buffer length:', bufferLength)
      }
    }

    draw()
  }

  // Helper function
  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  }

  // Effects
  useEffect(() => {
    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (mediaRecorderRef.current && isRecording) {
        stopRecording()
      }
    }
  }, [connectWebSocket])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎙️ AI Interview Session
          </h1>
          <p className="text-gray-600">Session: {sessionId}</p>
          <p className="text-gray-600">Candidate: {candidateName}</p>
        </div>

        {/* Connection Status */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className={`flex items-center justify-center p-4 rounded-lg font-medium ${
              connectionState === 'connected' 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : connectionState === 'connecting'
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {connectionState === 'connected' && '🟢 Connected to AI Server'}
              {connectionState === 'connecting' && '🟡 Connecting to AI Server...'}
              {connectionState === 'disconnected' && '🔴 Disconnected from AI Server'}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-center gap-4 mb-6">
              <Button
                onClick={startRecording}
                disabled={isRecording}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
              
              <Button
                onClick={stopRecording}
                disabled={!isRecording}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop Recording
              </Button>
            </div>

            {/* Audio Visualization */}
            <div className="bg-slate-50 rounded-lg p-4 border">
              <canvas
                ref={canvasRef}
                width={800}
                height={120}
                className="w-full h-20 rounded"
              />
              {isRecording && (
                <div className="mt-2 flex items-center justify-center text-sm text-gray-600">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Audio Level: {Math.round(audioLevel * 100)}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversation */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              💬 Interview Conversation
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Your conversation will appear here...
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg shadow-sm ${
                      message.type === 'user'
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : message.type === 'bot'
                        ? 'bg-green-50 border-l-4 border-green-500'
                        : 'bg-gray-50 border-l-4 border-gray-500'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-600 mb-1">
                      {message.sender}
                    </div>
                    <div className="text-gray-900">
                      {message.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hidden audio player */}
        <audio ref={audioPlayerRef} className="hidden" />
      </div>
    </div>
  )
}
