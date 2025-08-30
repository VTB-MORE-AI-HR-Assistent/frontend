"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ResponsiveTableProps {
  children: ReactNode
  className?: string
}

export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        {children}
      </div>
      
      {/* Mobile view - cards */}
      <div className="md:hidden">
        {children}
      </div>
    </div>
  )
}

interface MobileCardProps {
  children: ReactNode
  className?: string
}

export function MobileCard({ children, className }: MobileCardProps) {
  return (
    <div className={cn(
      "block md:hidden bg-white rounded-lg border p-4 mb-3 space-y-3",
      className
    )}>
      {children}
    </div>
  )
}

interface MobileRowProps {
  label: string
  value: ReactNode
  className?: string
}

export function MobileRow({ label, value, className }: MobileRowProps) {
  return (
    <div className={cn("flex justify-between items-start", className)}>
      <span className="text-sm font-medium text-muted-foreground">{label}:</span>
      <span className="text-sm text-right">{value}</span>
    </div>
  )
}