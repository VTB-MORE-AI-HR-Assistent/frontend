"use client"

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, Loader2, Clock, Calendar, User, Mail } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { interviewApi, type InterviewSession, type RoomCredentials } from '@/lib/api/interview'
import { AudioInterview } from '@/components/interview/audio-interview'
import { EmailLinkService, LinkValidationResult, verifyCandidateIdentity, isWithinScheduledWindow } from '@/lib/interview/email-link-service'

// Phase 4.1 + Phase 5: Interview Page with API Integration and Email Link Validation

type InterviewStatus = 
  | 'loading' 
  | 'validating' 
  | 'ready' 
  | 'expired' 
  | 'invalid' 
  | 'error' 
  | 'no-token'
  | 'not-scheduled'
  | 'already-used'
  | 'identity-verification'

interface InterviewPageState {
  session: InterviewSession | null
  roomCredentials: RoomCredentials | null
  showInterview: boolean
  linkValidation: LinkValidationResult | null
  candidateEmail: string
}

export default function InterviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Extract sessionId from params and token from search params
  const sessionId = params.sessionId as string
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<InterviewStatus>('loading')
  const [pageState, setPageState] = useState<InterviewPageState>({
    session: null,
    roomCredentials: null,
    showInterview: false,
    linkValidation: null,
    candidateEmail: ''
  })
  const [error, setError] = useState<string>('')
  const [countdown, setCountdown] = useState(5)
  const [timeUntilInterview, setTimeUntilInterview] = useState<number | null>(null)

  // Check for token presence immediately
  useEffect(() => {
    if (!token) {
      setStatus('no-token')
      return
    }
    
    // Start validation process
    setStatus('validating')
    validateInterviewAccess()
  }, [token, sessionId])

  // Countdown timer for redirect
  useEffect(() => {
    if (status === 'expired' || status === 'invalid') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            router.push('/')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [status, router])

  const validateInterviewAccess = async () => {
    try {
      // Phase 5: First validate the link using EmailLinkService
      const linkValidation = await EmailLinkService.validateLink(sessionId, token || '')
      
      setPageState(prev => ({
        ...prev,
        linkValidation
      }))

      if (!linkValidation.valid) {
        // Handle different validation failure reasons
        switch (linkValidation.reason) {
          case 'expired':
            setStatus('expired')
            setError('This interview link has expired. Please contact HR for a new link.')
            break
          case 'invalid':
            setStatus('invalid')
            setError('This interview link is invalid. Please use the link from your email invitation.')
            break
          case 'not_found':
            setStatus('invalid')
            setError('Interview session not found. Please contact HR for assistance.')
            break
          case 'already_used':
            setStatus('already-used')
            setError('This interview has already been completed or is currently in progress.')
            break
          case 'not_scheduled':
            setStatus('not-scheduled')
            setTimeUntilInterview(linkValidation.timeUntilInterview || 0)
            setError(`Your interview is scheduled for later. You can join ${linkValidation.timeUntilInterview} minutes before the scheduled time.`)
            break
          default:
            setStatus('error')
            setError('Unable to validate interview link.')
        }
        return
      }

      // If link is valid, verify with backend API
      const response = await interviewApi.validateSession(sessionId, token || undefined)
      
      if (response.success && response.data) {
        setPageState(prev => ({
          ...prev,
          session: response.data!.session!,
          candidateEmail: linkValidation.interviewData?.candidateEmail || ''
        }))
        
        // Check if we need identity verification
        if (linkValidation.interviewData?.candidateEmail) {
          setStatus('identity-verification')
        } else {
          setStatus('ready')
        }
      } else if (response.error) {
        // Handle API error
        setStatus('error')
        setError(response.error.message)
      }
    } catch (err) {
      console.error('Validation error:', err)
      setStatus('error')
      setError('Unable to validate interview session. Please try again later.')
    }
  }

  const handleRetry = () => {
    setStatus('validating')
    setError('')
    validateInterviewAccess()
  }

  const handleStartInterview = async () => {
    try {
      setStatus('loading')
      
      // Phase 5: Update interview status in EmailLinkService
      EmailLinkService.setInterviewStatus(sessionId, 'in_progress')
      
      // Get room credentials from API
      const response = await interviewApi.joinInterview(sessionId)
      
      if (response.success && response.data) {
        setPageState(prev => ({
          ...prev,
          roomCredentials: response.data!,
          showInterview: true
        }))
        setStatus('ready')
      } else if (response.error) {
        setStatus('error')
        setError(response.error.message)
      }
    } catch (err) {
      console.error('Failed to start interview:', err)
      setStatus('error')
      setError('Failed to start interview. Please try again.')
    }
  }

  const handleIdentityVerification = async () => {
    // In production, this would include actual verification steps
    // For now, we'll simulate verification with the email from token
    const verified = await verifyCandidateIdentity(token || '', pageState.candidateEmail)
    
    if (verified) {
      setStatus('ready')
    } else {
      setStatus('error')
      setError('Identity verification failed. Please contact HR for assistance.')
    }
  }

  const handleRequestNewLink = async () => {
    // In production, this would trigger email to candidate
    const newLink = await EmailLinkService.regenerateLink(sessionId, token || '')
    if (newLink) {
      setError('A new interview link has been sent to your email address.')
    } else {
      setError('Unable to generate new link. Please contact HR for assistance.')
    }
  }

  const handleInterviewEnd = async () => {
    try {
      // Phase 5: Update interview status
      EmailLinkService.setInterviewStatus(sessionId, 'completed')
      
      // Report interview ended to API
      await interviewApi.endInterview(sessionId, 0) // Duration will be tracked by interview component
      
      // Navigate back to home or show completion message
      setPageState(prev => ({
        ...prev,
        showInterview: false
      }))
      setStatus('left')
    } catch (err) {
      console.error('Failed to end interview properly:', err)
    }
  }

  // Render different states
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#1B4F8C]" />
            <h2 className="text-xl font-semibold text-gray-900">Loading Interview Session</h2>
            <p className="text-gray-600 text-center">Please wait while we prepare your interview...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (status === 'no-token') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-900">Missing Access Token</AlertTitle>
            <AlertDescription className="text-red-700 mt-2">
              No access token found. Please use the interview link from your email invitation.
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Button 
              onClick={() => router.push('/')}
              className="bg-[#1B4F8C] hover:bg-[#143A66]"
            >
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (status === 'validating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-[#1B4F8C]" />
              <CheckCircle className="h-6 w-6 absolute -bottom-1 -right-1 text-green-500 animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Validating Access</h2>
            <p className="text-gray-600 text-center">Verifying your interview session...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-[#1B4F8C] h-2 rounded-full animate-progress" />
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (status === 'expired' || status === 'invalid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-900">
              {status === 'expired' ? 'Link Expired' : 'Invalid Link'}
            </AlertTitle>
            <AlertDescription className="text-amber-700 mt-2">
              {error}
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 space-y-4">
            {status === 'expired' && (
              <Button 
                onClick={handleRequestNewLink}
                className="w-full bg-[#1B4F8C] hover:bg-[#143A66]"
              >
                <Mail className="mr-2 h-4 w-4" />
                Request New Link
              </Button>
            )}
            <p className="text-sm text-gray-600 text-center">
              Redirecting to homepage in {countdown} seconds...
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={handleRetry}
                variant="outline"
                className="flex-1"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => router.push('/')}
                className="flex-1 bg-[#1B4F8C] hover:bg-[#143A66]"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (status === 'not-scheduled') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Clock className="h-8 w-8 text-[#1B4F8C]" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900">Interview Not Yet Available</h2>
              <p className="text-gray-600 mt-2">Your interview is scheduled for later</p>
            </div>

            {pageState.linkValidation?.interviewData && (
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Position:</span>
                  <span className="font-semibold">{pageState.linkValidation.interviewData.position}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Scheduled Time:</span>
                  <span className="font-semibold">
                    {new Date(pageState.linkValidation.interviewData.interviewDate).toLocaleString('ru-RU')}
                  </span>
                </div>
                {timeUntilInterview !== null && timeUntilInterview > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Time Until Interview:</span>
                    <span className="font-semibold text-[#1B4F8C]">
                      {Math.floor(timeUntilInterview / 60)}h {timeUntilInterview % 60}m
                    </span>
                  </div>
                )}
              </div>
            )}

            <Alert className="border-blue-200 bg-blue-50">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                You can join the interview 15 minutes before the scheduled time. Please check back later.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={handleRetry}
              className="w-full bg-[#1B4F8C] hover:bg-[#143A66]"
            >
              Check Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (status === 'already-used') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900">Interview Already Completed</h2>
              <p className="text-gray-600 mt-2">This interview session has already been used</p>
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Thank you for completing your interview. HR will contact you with the results soon.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/')}
                className="w-full bg-[#1B4F8C] hover:bg-[#143A66]"
              >
                Return to Home
              </Button>
              <p className="text-sm text-gray-500">
                If you believe this is an error, please contact HR for assistance.
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (status === 'identity-verification') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-[#1B4F8C] rounded-full flex items-center justify-center mx-auto">
              <User className="h-8 w-8 text-white" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900">Identity Verification</h2>
              <p className="text-gray-600 mt-2">Please verify your identity to continue</p>
            </div>

            {pageState.session && (
              <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-left">
                <div>
                  <span className="text-sm text-gray-600">Candidate Name:</span>
                  <p className="font-semibold">{pageState.session.candidateName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Position:</span>
                  <p className="font-semibold">{pageState.session.jobTitle}</p>
                </div>
                {pageState.candidateEmail && (
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-semibold">{pageState.candidateEmail}</p>
                  </div>
                )}
              </div>
            )}

            <Alert className="border-blue-200 bg-blue-50">
              <User className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Click the button below to verify your identity and proceed to the interview.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button 
                onClick={handleIdentityVerification}
                className="w-full bg-[#1B4F8C] hover:bg-[#143A66]"
              >
                Verify Identity & Continue
              </Button>
              <p className="text-xs text-gray-500">
                Your identity will be verified using the information from your interview invitation.
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-900">Connection Error</AlertTitle>
            <AlertDescription className="text-red-700 mt-2">
              {error}
            </AlertDescription>
          </Alert>
          
          <div className="mt-6">
            <Button 
              onClick={handleRetry}
              className="w-full bg-[#1B4F8C] hover:bg-[#143A66]"
            >
              Retry Connection
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // If showing interview component
  if (pageState.showInterview && pageState.roomCredentials) {
    return (
      <AudioInterview
        roomUrl={pageState.roomCredentials.roomUrl}
        token={pageState.roomCredentials.token}
        candidateName={pageState.session?.candidateName || 'Candidate'}
        jobTitle={pageState.session?.jobTitle || 'Position'}
        onInterviewEnd={handleInterviewEnd}
      />
    )
  }

  if (status === 'ready' && pageState.session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8">
          <div className="text-center space-y-6">
            {/* VTB Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">VTB</span>
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Interview Session Ready
              </h1>
              <p className="text-gray-600">
                Your AI interview is ready to begin
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-left space-y-3">
              <div>
                <p className="text-sm text-gray-600">Candidate</p>
                <p className="font-semibold text-gray-900">{pageState.session.candidateName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Position</p>
                <p className="font-semibold text-gray-900">{pageState.session.jobTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Session ID</p>
                <p className="font-mono text-sm text-gray-700">{pageState.session.sessionId}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleStartInterview}
                className="w-full bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] hover:from-[#143A66] hover:to-[#1B4F8C] text-white py-6 text-lg"
              >
                Start Interview
              </Button>
              
              <p className="text-xs text-gray-500">
                By starting, you agree to the interview being recorded for evaluation purposes
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return null
}