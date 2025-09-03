// Phase 2.4: Interview Controls Component with mute, leave, and quality indicators
"use client"

import { useState, useEffect } from 'react'
import { 
  Mic, 
  MicOff, 
  PhoneOff, 
  Settings,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  AlertCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface InterviewControlsProps {
  isMuted?: boolean
  onMuteToggle?: () => void
  onLeaveInterview?: () => void
  connectionQuality?: 'good' | 'fair' | 'poor' | 'disconnected'
  audioInputLevel?: number // 0-100
  isRecording?: boolean
  interviewDuration?: number // in seconds
  onVolumeChange?: (volume: number) => void
  speakerVolume?: number // 0-100
  showAdvancedSettings?: boolean
}

export function InterviewControls({
  isMuted = false,
  onMuteToggle,
  onLeaveInterview,
  connectionQuality = 'good',
  audioInputLevel = 0,
  isRecording = false,
  interviewDuration = 0,
  onVolumeChange,
  speakerVolume = 75,
  showAdvancedSettings = false
}: InterviewControlsProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [localVolume, setLocalVolume] = useState(speakerVolume)
  const [audioWarning, setAudioWarning] = useState(false)

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Connection quality configuration
  const connectionConfig = {
    good: {
      icon: Wifi,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      label: 'Excellent Connection',
      description: 'Clear audio quality'
    },
    fair: {
      icon: Wifi,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      label: 'Fair Connection',
      description: 'Minor audio delays possible'
    },
    poor: {
      icon: Wifi,
      color: 'text-red-500',
      bgColor: 'bg-red-100',
      label: 'Poor Connection',
      description: 'Audio issues detected'
    },
    disconnected: {
      icon: WifiOff,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      label: 'Disconnected',
      description: 'Reconnecting...'
    }
  }

  const currentConnection = connectionConfig[connectionQuality]
  const ConnectionIcon = currentConnection.icon

  // Check for audio issues
  useEffect(() => {
    if (!isMuted && audioInputLevel < 10 && interviewDuration > 5) {
      setAudioWarning(true)
    } else {
      setAudioWarning(false)
    }
  }, [isMuted, audioInputLevel, interviewDuration])

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setLocalVolume(newVolume)
    if (onVolumeChange) {
      onVolumeChange(newVolume)
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Controls Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        {/* Connection Quality Indicator */}
        <div className="mb-6">
          <div className={cn(
            "flex items-center justify-between p-3 rounded-lg",
            currentConnection.bgColor
          )}>
            <div className="flex items-center gap-3">
              <ConnectionIcon className={cn("h-5 w-5", currentConnection.color)} />
              <div>
                <p className={cn("font-medium text-sm", currentConnection.color)}>
                  {currentConnection.label}
                </p>
                <p className="text-xs text-gray-600">
                  {currentConnection.description}
                </p>
              </div>
            </div>
            {interviewDuration > 0 && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-mono text-lg font-semibold text-gray-900">
                  {formatDuration(interviewDuration)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Audio Warning */}
        {audioWarning && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-amber-800">
                Your microphone input is low. Please check your audio settings.
              </p>
            </div>
          </div>
        )}

        {/* Primary Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          {/* Mute/Unmute Button */}
          <Button
            onClick={onMuteToggle}
            size="lg"
            variant={isMuted ? "destructive" : "default"}
            className={cn(
              "relative min-w-[140px]",
              !isMuted && "bg-[#1B4F8C] hover:bg-[#143A66]"
            )}
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
            {/* Audio input level indicator */}
            {!isMuted && audioInputLevel > 0 && (
              <div 
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-pulse"
                style={{ opacity: audioInputLevel / 100 }}
              />
            )}
          </Button>

          {/* Leave Interview Button */}
          <Button
            onClick={onLeaveInterview}
            size="lg"
            variant="destructive"
            className="min-w-[140px]"
          >
            <PhoneOff className="mr-2 h-5 w-5" />
            End Interview
          </Button>

          {/* Settings Button (if advanced settings enabled) */}
          {showAdvancedSettings && (
            <Button
              onClick={() => setShowSettings(!showSettings)}
              size="lg"
              variant="outline"
              className="min-w-[100px]"
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
              {showSettings ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>This interview is being recorded</span>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Settings Panel */}
      {showAdvancedSettings && showSettings && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-4 animate-in slide-in-from-top-2">
          <h3 className="font-semibold text-gray-900 mb-3">Audio Settings</h3>
          
          {/* Speaker Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                {localVolume > 0 ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
                Speaker Volume
              </label>
              <span className="text-sm text-gray-600">{localVolume}%</span>
            </div>
            <Slider
              value={[localVolume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Microphone Input Level Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Microphone Level
              </label>
              <span className="text-sm text-gray-600">{audioInputLevel}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-300",
                  audioInputLevel < 20 ? "bg-red-500" :
                  audioInputLevel < 50 ? "bg-yellow-500" :
                  "bg-green-500"
                )}
                style={{ width: `${audioInputLevel}%` }}
              />
            </div>
            {audioInputLevel < 20 && (
              <p className="text-xs text-red-600">
                Low input detected. Please speak louder or check your microphone.
              </p>
            )}
          </div>

          {/* Connection Statistics */}
          <div className="pt-3 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Connection Details</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500">Status:</span>
                <span className={cn("ml-2 font-medium", currentConnection.color)}>
                  {connectionQuality}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Latency:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {connectionQuality === 'good' ? '<50ms' :
                   connectionQuality === 'fair' ? '50-150ms' :
                   connectionQuality === 'poor' ? '>150ms' : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      {connectionQuality === 'poor' && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Tips to improve connection:
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Move closer to your WiFi router</li>
            <li>• Close other applications using internet</li>
            <li>• Switch to a wired connection if possible</li>
          </ul>
        </div>
      )}
    </div>
  )
}