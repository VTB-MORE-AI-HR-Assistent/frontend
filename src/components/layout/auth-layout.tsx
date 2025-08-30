import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#1B4F8C]/5 to-[#2563EB]/5" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#2563EB]/5 to-[#4F46E5]/5" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#1B4F8C]/3 to-transparent" />
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="container-vtb flex h-16 items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="avatar-vtb w-12 h-12">
              <span className="text-sm font-bold">VTB</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900">VTB Bank</span>
              <span className="text-xs text-slate-500">AI HR Assistant</span>
            </div>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="/about" 
              className="text-sm font-medium text-slate-600 hover:text-[#1B4F8C] transition-colors"
            >
              About
            </Link>
            <Link 
              href="/careers" 
              className="text-sm font-medium text-slate-600 hover:text-[#1B4F8C] transition-colors"
            >
              Careers
            </Link>
            <Link 
              href="/contact" 
              className="text-sm font-medium text-slate-600 hover:text-[#1B4F8C] transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("relative z-10 flex min-h-[calc(100vh-64px)] items-center justify-center p-6", className)}>
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="container-vtb px-6 py-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-600">
              © 2024 VTB Bank. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link 
                href="/privacy" 
                className="text-sm text-slate-600 hover:text-[#1B4F8C] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-slate-600 hover:text-[#1B4F8C] transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/help" 
                className="text-sm text-slate-600 hover:text-[#1B4F8C] transition-colors"
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}