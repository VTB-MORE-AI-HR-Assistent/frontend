"use client"

import * as React from "react"
import { Navigation } from "@/components/layout/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  
  // Mock user data - in real app, this would come from auth context
  const user = {
    name: "Anna Petrova",
    email: "anna.petrova@vtb.com",
    role: "hr_manager" as const,
    avatar: undefined,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Bar */}
      <Navigation user={user} />
      
      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-64px)] pt-16">
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
        
        {/* Main Content */}
        <main 
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            sidebarCollapsed ? "lg:ml-[70px]" : "lg:ml-[280px]",
            className
          )}
        >
          <div className="container-vtb p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}