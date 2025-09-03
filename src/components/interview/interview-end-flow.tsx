// Phase 6.2: Interview End Flow Component
"use client"

import { useState } from 'react'
import { CheckCircle, Star, MessageSquare, Home, FileText, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface InterviewEndFlowProps {
  candidateName: string
  position: string
  duration: number // in seconds
  onFeedbackSubmit?: (feedback: FeedbackData) => void
  onReturnHome?: () => void
}

export interface FeedbackData {
  rating: number
  experience: 'excellent' | 'good' | 'fair' | 'poor'
  technicalIssues: boolean
  issueDescription?: string
  comments?: string
  wouldRecommend: boolean
}

export function InterviewEndFlow({
  candidateName,
  position,
  duration,
  onFeedbackSubmit,
  onReturnHome
}: InterviewEndFlowProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<Partial<FeedbackData>>({
    rating: 0,
    technicalIssues: false,
    wouldRecommend: true
  })

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} minutes ${secs} seconds`
  }

  const handleRatingClick = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }))
  }

  const handleFeedbackSubmit = () => {
    if (onFeedbackSubmit && feedback.rating && feedback.experience) {
      onFeedbackSubmit(feedback as FeedbackData)
      setFeedbackSubmitted(true)
      setTimeout(() => {
        setShowFeedback(false)
      }, 2000)
    }
  }

  if (showFeedback && !feedbackSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Interview Feedback</h2>
              <p className="text-gray-600 mt-2">
                Help us improve your experience
              </p>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                How would you rate your interview experience?
              </Label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    className="transition-transform hover:scale-110"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={cn(
                        "h-10 w-10 transition-colors",
                        feedback.rating && feedback.rating >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Overall, how was your experience?
              </Label>
              <RadioGroup
                value={feedback.experience}
                onValueChange={(value) => 
                  setFeedback(prev => ({ ...prev, experience: value as FeedbackData['experience'] }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="excellent" />
                  <Label htmlFor="excellent">Excellent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="good" />
                  <Label htmlFor="good">Good</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fair" id="fair" />
                  <Label htmlFor="fair">Fair</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="poor" id="poor" />
                  <Label htmlFor="poor">Poor</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Technical Issues */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Did you experience any technical issues?
              </Label>
              <RadioGroup
                value={feedback.technicalIssues ? 'yes' : 'no'}
                onValueChange={(value) => 
                  setFeedback(prev => ({ ...prev, technicalIssues: value === 'yes' }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no-issues" />
                  <Label htmlFor="no-issues">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes-issues" />
                  <Label htmlFor="yes-issues">Yes</Label>
                </div>
              </RadioGroup>
              
              {feedback.technicalIssues && (
                <Textarea
                  placeholder="Please describe the technical issues you experienced..."
                  value={feedback.issueDescription || ''}
                  onChange={(e) => 
                    setFeedback(prev => ({ ...prev, issueDescription: e.target.value }))
                  }
                  className="mt-2"
                  rows={3}
                />
              )}
            </div>

            {/* Comments */}
            <div className="space-y-3">
              <Label htmlFor="comments" className="text-sm font-medium">
                Additional comments (optional)
              </Label>
              <Textarea
                id="comments"
                placeholder="Share any additional feedback..."
                value={feedback.comments || ''}
                onChange={(e) => 
                  setFeedback(prev => ({ ...prev, comments: e.target.value }))
                }
                rows={4}
              />
            </div>

            {/* Would Recommend */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Would you recommend this interview process to others?
              </Label>
              <RadioGroup
                value={feedback.wouldRecommend ? 'yes' : 'no'}
                onValueChange={(value) => 
                  setFeedback(prev => ({ ...prev, wouldRecommend: value === 'yes' }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="would-recommend" />
                  <Label htmlFor="would-recommend">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="would-not-recommend" />
                  <Label htmlFor="would-not-recommend">No</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => setShowFeedback(false)}
                variant="outline"
                className="flex-1"
              >
                Skip
              </Button>
              <Button
                onClick={handleFeedbackSubmit}
                disabled={!feedback.rating || !feedback.experience}
                className="flex-1 bg-[#1B4F8C] hover:bg-[#143A66]"
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (feedbackSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
              <p className="text-gray-600 mt-2">
                Your feedback has been submitted successfully
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="space-y-8">
          {/* Success Icon */}
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Interview Completed!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for participating, {candidateName}
            </p>
          </div>

          {/* Interview Summary */}
          <div className="bg-blue-50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-3">Interview Summary</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Position
                </span>
                <span className="font-medium text-gray-900">{position}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Duration
                </span>
                <span className="font-medium text-gray-900">{formatDuration(duration)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Status
                </span>
                <span className="font-medium text-green-600">Completed</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ChevronRight className="h-5 w-5 mr-2 text-[#1B4F8C]" />
              What Happens Next?
            </h3>
            
            <ol className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="font-semibold text-[#1B4F8C] mr-3">1.</span>
                <span>Your interview responses are being analyzed by our AI system</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-[#1B4F8C] mr-3">2.</span>
                <span>HR team will review your assessment within 2-3 business days</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-[#1B4F8C] mr-3">3.</span>
                <span>You will receive an email with the results and next steps</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-[#1B4F8C] mr-3">4.</span>
                <span>If selected, you'll be invited for the next round of interviews</span>
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => setShowFeedback(true)}
              className="w-full bg-[#1B4F8C] hover:bg-[#143A66] py-6 text-lg"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Provide Feedback
            </Button>
            
            <Button
              onClick={onReturnHome}
              variant="outline"
              className="w-full py-6 text-lg"
            >
              <Home className="mr-2 h-5 w-5" />
              Return to Main Site
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500">
            If you have any questions, please contact our HR team at{' '}
            <a href="mailto:hr@vtb.ru" className="text-[#1B4F8C] hover:underline">
              hr@vtb.ru
            </a>
          </p>
        </div>
      </Card>
    </div>
  )
}