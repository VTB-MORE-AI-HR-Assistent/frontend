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
    <div className={cn("space-y-4", className)}>
      {/* Visual Pipeline Bar */}
      <div className="relative">
        <div className="flex h-12 w-full overflow-hidden rounded-lg border bg-gray-50">
          {segments.map((segment, index) => (
            <div
              key={index}
              className={cn(
                "relative flex items-center justify-center transition-all duration-200",
                segment.color,
                activeIndex === index && "ring-2 ring-offset-2 ring-blue-500"
              )}
              style={{ width: `${segment.value}%` }}
              onClick={() => setActiveIndex(index === activeIndex ? null : index)}
            >
              {segment.value > 10 && (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-white">
                    {Math.round(segment.value)}%
                  </span>
                </div>
              )}
              {segment.value <= 10 && segment.value > 0 && (
                <span className="text-xs font-semibold text-white">
                  {Math.round(segment.value)}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Segment Labels Below */}
        <div className="mt-2 flex justify-between text-xs">
          {segments.map((segment, index) => (
            <div 
              key={index} 
              className="flex items-center gap-1"
              style={{ width: `${100 / segments.length}%` }}
            >
              <div className={cn("h-3 w-3 rounded", segment.color)} />
              <span className="font-medium">{segment.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Sliders */}
      <div className="space-y-3">
        {segments.map((segment, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("h-3 w-3 rounded", segment.color)} />
                <span className="text-sm font-medium">{segment.label}</span>
              </div>
              <span className="text-sm font-semibold">
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
            />
          </div>
        ))}
      </div>

      {/* Total Indicator */}
      <div className={cn(
        "flex items-center justify-between rounded-lg border p-2 text-sm",
        Math.abs(total - 100) < 0.1 
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      )}>
        <span className="font-medium">Total:</span>
        <span className="font-bold">{Math.round(total)}%</span>
      </div>
    </div>
  )
}