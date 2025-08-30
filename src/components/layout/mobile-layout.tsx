"use client"

import { ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface MobileLayoutProps {
  children: ReactNode
  className?: string
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [viewportHeight, setViewportHeight] = useState("100vh")

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      // Handle mobile viewport height (accounts for mobile browser UI)
      setViewportHeight(`${window.innerHeight}px`)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("orientationchange", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("orientationchange", checkMobile)
    }
  }, [])

  return (
    <div 
      className={cn(
        "flex flex-col",
        isMobile && "mobile-layout",
        className
      )}
      style={{
        minHeight: isMobile ? viewportHeight : "100vh"
      }}
    >
      {children}
    </div>
  )
}

interface MobileScrollAreaProps {
  children: ReactNode
  className?: string
}

export function MobileScrollArea({ children, className }: MobileScrollAreaProps) {
  return (
    <div 
      className={cn(
        "overflow-y-auto overflow-x-hidden",
        "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
        // Mobile-specific scrolling optimization
        "md:overflow-auto",
        "-webkit-overflow-scrolling-touch",
        className
      )}
    >
      {children}
    </div>
  )
}

interface MobileBottomNavProps {
  children: ReactNode
  className?: string
}

export function MobileBottomNav({ children, className }: MobileBottomNavProps) {
  return (
    <nav 
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-50",
        "bg-white border-t",
        "safe-area-inset-bottom", // For iPhone notch/home indicator
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-4">
        {children}
      </div>
    </nav>
  )
}