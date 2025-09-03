"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Video, CheckCircle, AlertCircle } from 'lucide-react'

export default function TestDailyPage() {
  const [status, setStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle')
  const [roomData, setRoomData] = useState<any>(null)
  const [error, setError] = useState<string>('')

  const testDailyApi = async () => {
    setStatus('creating')
    setError('')
    
    try {
      // Create a test room
      const response = await fetch('/api/daily/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: `test-${Date.now()}`,
          candidateName: 'Test User',
          duration: 30
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create room')
      }

      const data = await response.json()
      setRoomData(data)
      setStatus('success')
      
      console.log('Room created successfully:', data)
    } catch (err: any) {
      console.error('Error creating room:', err)
      setError(err.message || 'Failed to create Daily.co room')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Daily.co API Test</h1>
            <p className="text-gray-600">Test real Daily.co room creation with your API key</p>
          </div>

          {status === 'idle' && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will create a real Daily.co room using your API key:
                  <br />
                  <strong>Domain:</strong> hraiassistant.daily.co
                  <br />
                  <strong>API Key:</strong> {process.env.NEXT_PUBLIC_DAILY_API_KEY ? '✅ Configured' : '❌ Not found'}
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={testDailyApi}
                className="w-full bg-[#1B4F8C] hover:bg-[#143A66]"
                size="lg"
              >
                <Video className="mr-2 h-5 w-5" />
                Create Test Room
              </Button>
            </div>
          )}

          {status === 'creating' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-[#1B4F8C]" />
              <p className="text-gray-600">Creating Daily.co room...</p>
            </div>
          )}

          {status === 'success' && roomData && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Room created successfully!
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-gray-900 mb-3">Room Details:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room URL:</span>
                    <a 
                      href={roomData.roomUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {roomData.roomUrl}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Token:</span>
                    <span className="font-mono text-xs text-gray-700 break-all">
                      {roomData.token?.substring(0, 50)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires:</span>
                    <span className="text-gray-900">
                      {new Date(roomData.expiresAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => window.open(roomData.roomUrl, '_blank')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Video className="mr-2 h-5 w-5" />
                  Open Room in New Tab
                </Button>
                
                <Button 
                  onClick={testDailyApi}
                  variant="outline"
                  className="w-full"
                >
                  Create Another Room
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={testDailyApi}
                className="w-full bg-[#1B4F8C] hover:bg-[#143A66]"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}