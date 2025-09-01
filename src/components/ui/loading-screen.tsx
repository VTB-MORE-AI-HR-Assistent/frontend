import React from 'react'

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="flex flex-col items-center space-y-8">
        {/* Enhanced VTB Logo with animation */}
        <div className="relative">
          {/* Outer ring animation */}
          <div className="absolute inset-0 -m-6">
            <div className="w-32 h-32 rounded-full border-2 border-blue-200 animate-ping" />
          </div>
          
          {/* Middle ring animation */}
          <div className="absolute inset-0 -m-3">
            <div className="w-26 h-26 rounded-full border-4 border-blue-100 animate-pulse" />
          </div>
          
          {/* Logo container with modern gradient */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
            <span className="text-white font-bold text-2xl tracking-wider">VTB</span>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
          
          {/* Rotating loader ring */}
          <svg className="absolute inset-0 -m-4 w-28 h-28 animate-spin" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="200 100"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1B4F8C" stopOpacity="0" />
                <stop offset="50%" stopColor="#1B4F8C" stopOpacity="1" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Enhanced loading text with fade animation */}
        <div className="text-center space-y-2 animate-fade-in">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] bg-clip-text text-transparent">
            Loading your workspace
          </h2>
          <p className="text-sm text-slate-500 animate-pulse">Preparing AI-powered HR tools...</p>
        </div>
        
        {/* Progress bar */}
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] rounded-full animate-progress" />
        </div>
        
        {/* Animated dots with smooth wave effect */}
        <div className="flex space-x-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] rounded-full animate-wave"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
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