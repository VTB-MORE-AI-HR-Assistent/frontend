"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import interviewsApi from "@/lib/api/interviews"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar,
  Clock,
  CheckCircle,
  User,
  Briefcase,
  Building,
  MapPin,
  Video,
  AlertCircle
} from "lucide-react"

interface TimeSlot {
  date: string
  time: string
  available: boolean
}

interface InterviewData {
  candidateName: string
  candidateEmail: string
  position: string
  company: string
  department: string
  location: string
  interviewType: string
  duration: string
  description: string
}

export default function InterviewSchedulePage() {
  const params = useParams()
  const interviewId = params.id as string
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInterviewData()
  }, [interviewId])

  const loadInterviewData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Load interview details and available time slots
      const [interview, slots] = await Promise.all([
        interviewsApi.getInterview(interviewId),
        interviewsApi.getAvailableTimeSlots(interviewId)
      ])
      
      setInterviewData({
        candidateName: interview.candidateName,
        candidateEmail: interview.candidateEmail,
        position: interview.jobTitle,
        company: "VTB Bank",
        department: interview.department || "HR Department",
        location: "Moscow, Russia",
        interviewType: "Video Interview",
        duration: `${interview.duration} minutes`,
        description: interview.jobDescription || "Technical interview for the selected position."
      })
      
      setTimeSlots(slots)
    } catch (error) {
      console.error('Failed to load interview data:', error)
      setError('Failed to load interview details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async () => {
    if (!selectedSlot || !interviewData) return
    
    try {
      setIsSubmitting(true)
      
      // Schedule the interview with selected time slot
      await interviewsApi.scheduleInterview(interviewId, {
        timeSlot: selectedSlot,
        candidateEmail: interviewData.candidateEmail
      })
      
      setIsConfirmed(true)
    } catch (error) {
      console.error('Failed to schedule interview:', error)
      setError('Failed to schedule interview. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading interview details...</p>
        </div>
      </div>
    )
  }

  if (error || !interviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Interview</h2>
            <p className="text-slate-600 mb-4">{error || 'Interview not found'}</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const originalHandleConfirm = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsConfirmed(true)
    setIsSubmitting(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Card className="border-green-200 bg-white/80 backdrop-blur">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Interview Scheduled Successfully!
              </h2>
              <p className="text-slate-600 mb-6">
                Your interview has been confirmed for:
              </p>
              <div className="inline-flex items-center gap-4 p-4 bg-blue-50 rounded-lg mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-slate-900">
                    {selectedSlot.split('-')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-slate-900">
                    {selectedSlot.split('-')[1]}
                  </span>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <p>A confirmation email has been sent to <strong>{interviewData.candidateEmail}</strong></p>
                <p>You will receive a video interview link 24 hours before the interview.</p>
              </div>
              <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium text-amber-900 mb-1">Preparation Tips</p>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• Test your camera and microphone before the interview</li>
                      <li>• Choose a quiet location with good lighting</li>
                      <li>• Have your resume and portfolio ready</li>
                      <li>• Prepare questions about the role and company</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* VTB Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">VTB</span>
            </div>
            <span className="text-2xl font-semibold text-slate-900">Interview Scheduling</span>
          </div>
        </div>

        {/* Welcome Card */}
        <Card className="mb-6 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">Schedule Your Interview</CardTitle>
            <CardDescription className="text-base">
              Hello {interviewData.candidateName}, please select a convenient time for your interview
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Position Details */}
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Position</span>
                </div>
                <p className="font-medium text-slate-900">{interviewData.position}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Department</span>
                </div>
                <p className="font-medium text-slate-900">{interviewData.department}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Location</span>
                </div>
                <p className="font-medium text-slate-900">{interviewData.location}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Interview Type</span>
                </div>
                <p className="font-medium text-slate-900">{interviewData.interviewType}</p>
              </div>
            </div>

            {/* Interview Description */}
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-slate-700">
                <strong>About this interview:</strong> {interviewData.description}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Time Slot Selection */}
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Available Time Slots</CardTitle>
            <CardDescription>
              Select your preferred interview time (Duration: {interviewData.duration})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* Group slots by date */}
              {Array.from(new Set(timeSlots.map(slot => slot.date))).map(date => (
                <div key={date} className="space-y-3">
                  <h3 className="font-medium text-slate-900 text-sm">
                    {formatDate(date)}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timeSlots
                      .filter(slot => slot.date === date)
                      .map((slot) => {
                        const slotId = `${slot.date}-${slot.time}`
                        const isSelected = selectedSlot === slotId
                        
                        return (
                          <Button
                            key={slotId}
                            variant={isSelected ? "default" : "outline"}
                            className={`h-auto py-3 px-4 ${
                              !slot.available 
                                ? "opacity-50 cursor-not-allowed" 
                                : isSelected 
                                  ? "bg-[#1B4F8C] hover:bg-[#163c6e]"
                                  : "hover:bg-slate-50"
                            }`}
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot(slotId)}
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{slot.time}</span>
                            </div>
                          </Button>
                        )
                      })}
                  </div>
                </div>
              ))}
            </div>

            {selectedSlot && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-900 font-medium">
                      Selected: {formatDate(selectedSlot.split('-')[0])} at {selectedSlot.split('-')[1]}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setSelectedSlot("")}
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button
                className="bg-[#1B4F8C] hover:bg-[#163c6e] min-w-[200px]"
                disabled={!selectedSlot || isSubmitting}
                onClick={handleConfirm}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Interview Time
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p>Need to reschedule? Contact us at hr@vtb.com</p>
          <p className="mt-2">Interview ID: {interviewId}</p>
        </div>
      </div>
    </div>
  )
}