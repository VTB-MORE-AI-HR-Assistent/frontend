"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#1B4F8C]/10 to-[#2563EB]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-[#2563EB]/10 to-[#4F46E5]/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] bg-clip-text text-transparent">
            404
          </h1>
          <div className="flex items-center justify-center -mt-8">
            <Search className="h-12 w-12 text-slate-400 animate-pulse" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="vtbPrimary"
            size="lg"
            asChild
          >
            <Link href="/" className="inline-flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-4">
            Need help? Try these links:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/login" 
              className="text-[#1B4F8C] hover:text-[#2563EB] transition-colors"
            >
              Sign In
            </Link>
            <span className="text-slate-300">•</span>
            <Link 
              href="/register" 
              className="text-[#1B4F8C] hover:text-[#2563EB] transition-colors"
            >
              Create Account
            </Link>
            <span className="text-slate-300">•</span>
            <Link 
              href="/contact" 
              className="text-[#1B4F8C] hover:text-[#2563EB] transition-colors"
            >
              Contact Support
            </Link>
            <span className="text-slate-300">•</span>
            <Link 
              href="/help" 
              className="text-[#1B4F8C] hover:text-[#2563EB] transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}