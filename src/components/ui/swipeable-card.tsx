"use client"

import { useState, useRef, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SwipeableCardProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: {
    label: string
    icon?: ReactNode
    className?: string
    onClick: () => void
  }
  rightAction?: {
    label: string
    icon?: ReactNode
    className?: string
    onClick: () => void
  }
  className?: string
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className
}: SwipeableCardProps) {
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const x = e.touches[0].clientX
    setCurrentX(x - startX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 100 // Minimum swipe distance
    
    if (currentX > threshold && onSwipeRight) {
      onSwipeRight()
    } else if (currentX < -threshold && onSwipeLeft) {
      onSwipeLeft()
    }
    
    // Reset position
    setCurrentX(0)
    setStartX(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX)
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const x = e.clientX
    setCurrentX(x - startX)
  }

  const handleMouseUp = () => {
    handleTouchEnd()
  }

  const transform = isDragging ? `translateX(${currentX}px)` : 'translateX(0)'
  const transition = isDragging ? 'none' : 'transform 0.3s ease-out'

  return (
    <div className="relative overflow-hidden">
      {/* Background actions */}
      {(leftAction || rightAction) && (
        <div className="absolute inset-0 flex items-center justify-between px-4">
          {leftAction && (
            <div 
              className={cn(
                "flex items-center gap-2 opacity-0 transition-opacity",
                currentX > 50 && "opacity-100"
              )}
            >
              {leftAction.icon}
              <span className="text-sm font-medium">{leftAction.label}</span>
            </div>
          )}
          {rightAction && (
            <div 
              className={cn(
                "flex items-center gap-2 opacity-0 transition-opacity",
                currentX < -50 && "opacity-100"
              )}
            >
              <span className="text-sm font-medium">{rightAction.label}</span>
              {rightAction.icon}
            </div>
          )}
        </div>
      )}
      
      {/* Main card content */}
      <div
        ref={cardRef}
        className={cn(
          "relative bg-white touch-pan-y",
          className
        )}
        style={{
          transform,
          transition,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {children}
        
        {/* Touch indicator for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => setShowActions(!showActions)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Action buttons for mobile (alternative to swipe) */}
      {showActions && (leftAction || rightAction) && (
        <div className="md:hidden flex gap-2 p-2 bg-gray-50 border-t">
          {leftAction && (
            <Button
              variant="outline"
              size="sm"
              className={cn("flex-1", leftAction.className)}
              onClick={leftAction.onClick}
            >
              {leftAction.icon}
              <span className="ml-2">{leftAction.label}</span>
            </Button>
          )}
          {rightAction && (
            <Button
              variant="outline"
              size="sm"
              className={cn("flex-1", rightAction.className)}
              onClick={rightAction.onClick}
            >
              {rightAction.icon}
              <span className="ml-2">{rightAction.label}</span>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}