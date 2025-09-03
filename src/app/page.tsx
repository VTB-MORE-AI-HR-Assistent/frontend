// Home Page - Entry point for testing the interview flow
"use client"

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Video, TestTube, ArrowRight, CheckCircle, User } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] rounded-xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">VTB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI HR Assistant</h1>
                <p className="text-sm text-gray-500">Interview Platform Demo</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Test the Interview Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the complete interview flow from receiving an email invitation to completing your AI-powered interview
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Realistic User Flow */}
          <Card className="p-8 border-2 border-[#1B4F8C] bg-blue-50">
            <div className="flex items-center mb-4">
              <User className="h-8 w-8 text-[#1B4F8C] mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Start as Real Candidate</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              You are <strong>Александр Иванов</strong>, a candidate who applied for Senior Frontend Developer position at VTB Bank. Check your email for the interview invitation.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-700">Open your Gmail inbox</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-700">Find VTB interview invitation</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-700">Click the interview link</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <span className="text-gray-700">Complete your AI interview</span>
              </div>
            </div>

            <Button 
              onClick={() => router.push('/mock-email')}
              className="w-full bg-[#1B4F8C] hover:bg-[#143A66] text-white py-4 text-lg group"
            >
              <Mail className="mr-2 h-5 w-5" />
              Open Gmail Inbox
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <p className="text-xs text-gray-600 mt-3 text-center">
              Experience the complete candidate journey from email to interview
            </p>
          </Card>

          {/* Test Tools */}
          <Card className="p-8">
            <div className="flex items-center mb-4">
              <TestTube className="h-8 w-8 text-gray-600 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Developer Tools</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Quick access to testing utilities and direct interview links for development.
            </p>

            <div className="space-y-4">
              <Button 
                onClick={() => router.push('/test-interview')}
                variant="outline"
                className="w-full py-3"
              >
                <Video className="mr-2 h-4 w-4" />
                Test Link Generator
              </Button>
              
              <Button 
                onClick={() => window.open('/interview/test-123?token=mock', '_blank')}
                variant="outline"
                className="w-full py-3"
              >
                Direct Interview Access
              </Button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">
                <strong>Note:</strong> Daily.co audio/video requires real API credentials. 
                UI and flow are fully functional.
              </p>
            </div>
          </Card>
        </div>

        {/* Implementation Status */}
        <Card className="mt-12 p-8 max-w-4xl mx-auto bg-green-50 border-green-200">
          <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
            <CheckCircle className="mr-2 h-6 w-6" />
            Implementation Complete
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-2">✅ Working Features</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Email invitation flow</li>
                <li>• Token-based authentication</li>
                <li>• Pre-interview system checks</li>
                <li>• Loading states & animations</li>
                <li>• Error handling (19 scenarios)</li>
                <li>• Interview end flow & feedback</li>
                <li>• Accessibility (WCAG 2.1 AA)</li>
                <li>• Keyboard navigation</li>
                <li>• Browser notifications</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">⏳ Requires Backend</h4>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>• Daily.co room creation</li>
                <li>• Real WebRTC connection</li>
                <li>• AI bot integration</li>
                <li>• Database persistence</li>
                <li>• Email delivery (SMTP)</li>
                <li>• JWT signing (RSA keys)</li>
                <li>• Session management</li>
                <li>• Recording functionality</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-[#1B4F8C]">6</div>
            <div className="text-sm text-gray-600">Phases Completed</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-[#1B4F8C]">19</div>
            <div className="text-sm text-gray-600">Error Scenarios</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-[#1B4F8C]">100%</div>
            <div className="text-sm text-gray-600">UI Complete</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-[#1B4F8C]">WCAG</div>
            <div className="text-sm text-gray-600">2.1 AA Compliant</div>
          </Card>
        </div>
      </main>
    </div>
  )
}