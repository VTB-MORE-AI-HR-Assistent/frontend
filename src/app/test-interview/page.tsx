// Test Page for Daily.co Interview Integration
"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmailLinkService } from '@/lib/interview/email-link-service'
import { registerTestSession } from '@/lib/api/interview'
import { Copy, ExternalLink, CheckCircle, Calendar, User, Mail, Clock, FileText, ArrowRight } from 'lucide-react'

export default function TestInterviewPage() {
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    candidateName: 'Test Candidate',
    candidateEmail: 'candidate@example.com',
    position: 'Senior Frontend Developer',
    sessionId: `test-${Date.now()}`,
    duration: 30,
    scheduledIn: 0 // minutes from now
  })

  const generateTestLink = () => {
    // Calculate interview date based on scheduledIn
    const interviewDate = new Date()
    interviewDate.setMinutes(interviewDate.getMinutes() + formData.scheduledIn)

    // Register the session in our mock API
    registerTestSession({
      sessionId: formData.sessionId,
      candidateName: formData.candidateName,
      candidateEmail: formData.candidateEmail,
      position: formData.position,
      scheduledTime: interviewDate,
      duration: formData.duration
    })

    // Generate the link using our EmailLinkService
    const link = EmailLinkService.generateInterviewLink({
      sessionId: formData.sessionId,
      candidateEmail: formData.candidateEmail,
      candidateName: formData.candidateName,
      interviewDate: interviewDate,
      duration: formData.duration,
      position: formData.position
    })

    setGeneratedLink(link)
    setCopied(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const openInNewTab = () => {
    window.open(generatedLink, '_blank')
  }

  const presetScenarios = [
    { label: 'Immediate Interview', scheduledIn: 0 },
    { label: 'In 5 minutes', scheduledIn: 5 },
    { label: 'In 15 minutes', scheduledIn: 15 },
    { label: 'In 1 hour', scheduledIn: 60 },
    { label: 'Tomorrow', scheduledIn: 24 * 60 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daily.co Interview Test Generator
          </h1>
          <p className="text-gray-600">
            Generate test links to verify the interview functionality
          </p>
        </div>

        {/* Instructions Card */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Testing Instructions
          </h2>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <span>Fill in the test interview details below (or use defaults)</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <span>Choose when the interview should be scheduled</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <span>Click "Generate Test Link" to create an interview link</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">4.</span>
              <span>Open the link in a new tab to test the interview flow</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">5.</span>
              <span>Note: Audio/video won't work without Daily.co room credentials</span>
            </li>
          </ol>
        </Card>

        {/* Configuration Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Interview Configuration
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Candidate Name */}
            <div>
              <Label htmlFor="candidateName">
                <User className="inline h-4 w-4 mr-1" />
                Candidate Name
              </Label>
              <Input
                id="candidateName"
                value={formData.candidateName}
                onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
                placeholder="Enter candidate name"
              />
            </div>

            {/* Candidate Email */}
            <div>
              <Label htmlFor="candidateEmail">
                <Mail className="inline h-4 w-4 mr-1" />
                Candidate Email
              </Label>
              <Input
                id="candidateEmail"
                type="email"
                value={formData.candidateEmail}
                onChange={(e) => setFormData({...formData, candidateEmail: e.target.value})}
                placeholder="Enter email"
              />
            </div>

            {/* Position */}
            <div>
              <Label htmlFor="position">
                <FileText className="inline h-4 w-4 mr-1" />
                Position
              </Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                placeholder="Enter position"
              />
            </div>

            {/* Duration */}
            <div>
              <Label htmlFor="duration">
                <Clock className="inline h-4 w-4 mr-1" />
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 30})}
                min="5"
                max="120"
              />
            </div>

            {/* Session ID */}
            <div>
              <Label htmlFor="sessionId">
                Session ID
              </Label>
              <Input
                id="sessionId"
                value={formData.sessionId}
                onChange={(e) => setFormData({...formData, sessionId: e.target.value})}
                placeholder="Unique session ID"
              />
            </div>

            {/* Schedule Time */}
            <div>
              <Label htmlFor="scheduledIn">
                <Calendar className="inline h-4 w-4 mr-1" />
                Schedule In (minutes from now)
              </Label>
              <Input
                id="scheduledIn"
                type="number"
                value={formData.scheduledIn}
                onChange={(e) => setFormData({...formData, scheduledIn: parseInt(e.target.value) || 0})}
                min="0"
                max="10080"
              />
            </div>
          </div>

          {/* Preset Scenarios */}
          <div className="mt-4">
            <Label>Quick Schedule Options</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {presetScenarios.map((scenario) => (
                <Button
                  key={scenario.scheduledIn}
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({...formData, scheduledIn: scenario.scheduledIn})}
                  className={formData.scheduledIn === scenario.scheduledIn ? 'bg-blue-50 border-blue-400' : ''}
                >
                  {scenario.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateTestLink}
            className="w-full mt-6 bg-[#1B4F8C] hover:bg-[#143A66]"
            size="lg"
          >
            Generate Test Link
          </Button>
        </Card>

        {/* Generated Link Display */}
        {generatedLink && (
          <Card className="p-6 border-green-200 bg-green-50">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-900">
                Test Link Generated Successfully
              </h3>
            </div>

            {/* Link Display */}
            <div className="bg-white rounded-lg p-3 mb-4 break-all">
              <code className="text-sm text-gray-700">{generatedLink}</code>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex-1"
              >
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button
                onClick={openInNewTab}
                className="flex-1 bg-[#1B4F8C] hover:bg-[#143A66]"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </Button>
            </div>

            {/* Interview Details */}
            <div className="mt-4 pt-4 border-t border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Interview Details:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
                <div>
                  <span className="font-medium">Candidate:</span> {formData.candidateName}
                </div>
                <div>
                  <span className="font-medium">Position:</span> {formData.position}
                </div>
                <div>
                  <span className="font-medium">Scheduled:</span> {
                    formData.scheduledIn === 0 
                      ? 'Now' 
                      : `In ${formData.scheduledIn} minutes`
                  }
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {formData.duration} minutes
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Test Scenarios */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Scenarios to Verify
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <ArrowRight className="h-5 w-5 text-[#1B4F8C] mr-2 mt-0.5" />
              <div>
                <strong>Immediate Join:</strong> Set "Schedule In" to 0 - Should allow immediate access
              </div>
            </div>
            <div className="flex items-start">
              <ArrowRight className="h-5 w-5 text-[#1B4F8C] mr-2 mt-0.5" />
              <div>
                <strong>Early Access:</strong> Set to 30+ minutes - Should show "not scheduled yet" message
              </div>
            </div>
            <div className="flex items-start">
              <ArrowRight className="h-5 w-5 text-[#1B4F8C] mr-2 mt-0.5" />
              <div>
                <strong>Pre-Interview Window:</strong> Set to 10 minutes - Should allow joining
              </div>
            </div>
            <div className="flex items-start">
              <ArrowRight className="h-5 w-5 text-[#1B4F8C] mr-2 mt-0.5" />
              <div>
                <strong>Identity Verification:</strong> Should show verification screen before interview
              </div>
            </div>
            <div className="flex items-start">
              <ArrowRight className="h-5 w-5 text-[#1B4F8C] mr-2 mt-0.5" />
              <div>
                <strong>Error Handling:</strong> Try invalid session ID or expired link
              </div>
            </div>
          </div>
        </Card>

        {/* Notes */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertDescription className="text-amber-800">
            <strong>Note:</strong> This generates mock interview links for testing the UI flow. 
            Actual Daily.co video/audio functionality requires valid Daily.co room credentials and API keys. 
            The mock implementation will show all UI states but won't establish real WebRTC connections.
          </AlertDescription>
        </Alert>

        {/* Technical Info */}
        <Card className="p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Technical Information
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Links expire after 48 hours</p>
            <p>• Interview window: 15 minutes before to 60 minutes after scheduled time</p>
            <p>• JWT tokens are generated with mock signing (production needs real RSA keys)</p>
            <p>• Session data stored in memory (production needs database)</p>
            <p>• All API calls use mock endpoints with simulated delays</p>
          </div>
        </Card>

        {/* Direct Test Link - No Token Required */}
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            🚀 Quick Test Without Token
          </h3>
          <p className="text-sm text-green-800 mb-4">
            Want to test immediately without generating links? Use this direct URL:
          </p>
          <div className="bg-white rounded-lg p-3 mb-4 break-all border border-green-300">
            <code className="text-sm text-gray-700">
              http://localhost:3000/interview/test-session-123
            </code>
          </div>
          <Button
            onClick={() => window.open('/interview/test-session-123', '_blank')}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Test Interview Directly
          </Button>
          <p className="text-xs text-green-700 mt-3">
            <strong>Note:</strong> This bypasses all token validation and uses hardcoded test data. 
            Perfect for quick UI testing without the link generation flow.
          </p>
        </Card>
      </div>
    </div>
  )
}