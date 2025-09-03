// Phase 3.1: VTB Branded Interview Layout Component
"use client"

import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InterviewLayoutProps {
  children: React.ReactNode
  interviewDuration?: number
  sessionTitle?: string
  className?: string
}

export function InterviewLayout({
  children,
  interviewDuration = 0,
  sessionTitle = "AI HR Interview Session",
  className
}: InterviewLayoutProps) {
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

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30",
      className
    )}>
      {/* VTB Branded Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* VTB Logo */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg sm:text-xl">VTB</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">More AI HR</h1>
                <p className="text-xs text-gray-500">Interview Platform</p>
              </div>
            </div>

            {/* Session Title */}
            <div className="flex-1 text-center px-4">
              <h2 className="text-sm sm:text-base md:text-lg font-medium text-gray-900">
                {sessionTitle}
              </h2>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 bg-[#1B4F8C]/5 px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#1B4F8C]" />
              <span className="font-mono text-sm sm:text-base font-semibold text-[#1B4F8C]">
                {formatDuration(interviewDuration)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>

      {/* Footer (optional) */}
      <footer className="mt-auto py-4 border-t border-gray-100 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center text-gray-500">
            © 2024 VTB More AI HR. Secure interview platform powered by AI.
          </p>
        </div>
      </footer>
    </div>
  )
}