"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

interface WeightSegment {
  label: string
  value: number
  color: string
  icon?: React.ReactNode
}

interface WeightPipelineProps {
  segments: WeightSegment[]
  onChange: (segments: WeightSegment[]) => void
  className?: string
}

export function WeightPipeline({ segments: initialSegments, onChange, className }: WeightPipelineProps) {
  const [segments, setSegments] = useState(initialSegments)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    setSegments(initialSegments)
  }, [initialSegments])

  const handleSliderChange = (index: number, newValue: number) => {
    const diff = newValue - segments[index].value
    const newSegments = [...segments]
    newSegments[index].value = newValue

    // Distribute the difference among other segments proportionally
    const otherIndices = segments.map((_, i) => i).filter(i => i !== index)
    const totalOthers = otherIndices.reduce((sum, i) => sum + segments[i].value, 0)
    
    if (totalOthers > 0) {
      otherIndices.forEach(i => {
        const proportion = segments[i].value / totalOthers
        newSegments[i].value = Math.max(0, Math.min(100, segments[i].value - diff * proportion))
      })
    }

    // Normalize to ensure total is 100
    const total = newSegments.reduce((sum, seg) => sum + seg.value, 0)
    if (total !== 100 && total > 0) {
      newSegments.forEach(seg => {
        seg.value = (seg.value / total) * 100
      })
    }

    setSegments(newSegments)
    onChange(newSegments)
  }

  const total = segments.reduce((sum, seg) => sum + seg.value, 0)

  return (
    <div className={cn("space-y-6", className)}>
      {/* Visual Pipeline Bar with Cards */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {segments.map((segment, index) => {
            const isBlue = segment.color.includes("blue")
            const isGreen = segment.color.includes("green")
            const isYellow = segment.color.includes("yellow")
            
            return (
              <div key={index} className="relative group">
                {/* Card */}
                <div className={cn(
                  "rounded-xl p-6 text-center transition-all duration-200 cursor-pointer relative overflow-hidden",
                  isBlue && "bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100",
                  isGreen && "bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-400 hover:shadow-lg hover:shadow-green-100",
                  isYellow && "bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-100",
                  activeIndex === index && "ring-2 ring-offset-2 ring-blue-500 scale-105"
                )}
                onClick={() => setActiveIndex(index === activeIndex ? null : index)}
                >
                  {/* Icon */}
                  <div className={cn(
                    "mx-auto mb-3 w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                    isBlue && "bg-gradient-to-br from-blue-100 to-blue-200",
                    isGreen && "bg-gradient-to-br from-green-100 to-green-200",
                    isYellow && "bg-gradient-to-br from-yellow-100 to-yellow-200"
                  )}>
                    {isBlue && (
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    )}
                    {isGreen && (
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    )}
                    {isYellow && (
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Percentage */}
                  <div className={cn(
                    "text-3xl font-bold mb-2 transition-all group-hover:scale-105",
                    isBlue && "text-blue-700",
                    isGreen && "text-green-700",
                    isYellow && "text-yellow-700"
                  )}>
                    {Math.round(segment.value)}%
                  </div>
                  
                  {/* Active indicator */}
                  {activeIndex === index && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                  )}
                </div>
                
                {/* Label Below Card */}
                <div className="mt-3 text-center">
                  <div className="font-semibold text-base text-gray-800">{segment.label}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {isBlue && "Code & Technical Skills"}
                    {isGreen && "Communication & Teamwork"}
                    {isYellow && "Experience & Results"}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Connecting Bar */}
        <div className="relative mt-6">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
            {segments.map((segment, index) => {
              const isBlue = segment.color.includes("blue")
              const isGreen = segment.color.includes("green")
              const isYellow = segment.color.includes("yellow")
              
              return (
                <div
                  key={index}
                  className={cn(
                    "transition-all duration-300 relative",
                    isBlue && "bg-gradient-to-r from-blue-400 to-blue-500",
                    isGreen && "bg-gradient-to-r from-green-400 to-green-500",
                    isYellow && "bg-gradient-to-r from-yellow-400 to-yellow-500"
                  )}
                  style={{ width: `${segment.value}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" style={{ animationDuration: '3s' }} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Individual Sliders */}
      {activeIndex !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Adjust Weights</h4>
          <div className="space-y-3">
            {segments.map((segment, index) => {
              const isBlue = segment.color.includes("blue")
              const isGreen = segment.color.includes("green")
              const isYellow = segment.color.includes("yellow")
              const isActive = index === activeIndex
              
              return (
                <div key={index} className={cn(
                  "space-y-2 p-3 rounded-lg transition-all",
                  isActive && "bg-white shadow-sm border border-gray-200"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-3 w-3 rounded-full",
                        isBlue && "bg-blue-500",
                        isGreen && "bg-green-500",
                        isYellow && "bg-yellow-500"
                      )} />
                      <span className={cn(
                        "text-sm font-medium",
                        isActive && "text-gray-900",
                        !isActive && "text-gray-600"
                      )}>{segment.label}</span>
                    </div>
                    <span className={cn(
                      "text-sm font-bold",
                      isActive && "text-gray-900",
                      !isActive && "text-gray-600"
                    )}>
                      {Math.round(segment.value)}%
                    </span>
                  </div>
                  <Slider
                    value={[segment.value]}
                    onValueChange={([value]) => handleSliderChange(index, value)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                    disabled={!isActive}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Total Indicator */}
      <div className={cn(
        "flex items-center justify-between rounded-lg border-2 p-3 text-sm mt-4 transition-all",
        Math.abs(total - 100) < 0.1 
          ? "border-green-300 bg-green-50 text-green-800"
          : "border-amber-300 bg-amber-50 text-amber-800"
      )}>
        <div className="flex items-center gap-2">
          {Math.abs(total - 100) < 0.1 ? (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <span className="font-semibold">Total Weight:</span>
        </div>
        <span className="font-bold text-lg">{Math.round(total)}%</span>
      </div>
    </div>
  )
}