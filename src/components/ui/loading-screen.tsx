import React from 'react'

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        {/* VTB Logo with pulse animation */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">VTB</span>
          </div>
          {/* Loading spinner around logo */}
          <div className="absolute inset-0 -m-2">
            <svg className="w-24 h-24 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">Loading</h2>
          <p className="text-sm text-slate-500 mt-1">Please wait...</p>
        </div>
        
        {/* Loading dots animation */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-[#1B4F8C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#1B4F8C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#1B4F8C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex items-center justify-center">
      <svg className={`animate-spin ${sizeClasses[size]} text-[#1B4F8C]`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  )
}

export function PageLoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-slate-500">Loading content...</p>
      </div>
    </div>
  )
}