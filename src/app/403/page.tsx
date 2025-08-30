"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Shield, Home, ArrowLeft, Lock } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export default function ForbiddenPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-orange-500/10 to-yellow-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* 403 Display */}
        <div className="mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent">
            403
          </h1>
          <div className="flex items-center justify-center -mt-8">
            <div className="relative">
              <Shield className="h-12 w-12 text-red-500" />
              <Lock className="h-6 w-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Access Forbidden
        </h2>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>

        {/* Permission Info Box */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-left">
              <h3 className="text-sm font-semibold text-red-900 mb-1">
                Why am I seeing this?
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• You may not have the required role</li>
                <li>• Your account permissions may have changed</li>
                <li>• This resource may be restricted</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="vtbPrimary"
            size="lg"
            onClick={() => router.push(ROUTES.HR_DASHBOARD)}
            className="inline-flex items-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
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
            Need help with access?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/contact" 
              className="text-[#1B4F8C] hover:text-[#2563EB] transition-colors"
            >
              Contact Administrator
            </Link>
            <span className="text-slate-300">•</span>
            <Link 
              href="/help" 
              className="text-[#1B4F8C] hover:text-[#2563EB] transition-colors"
            >
              Help Center
            </Link>
            <span className="text-slate-300">•</span>
            <button 
              onClick={() => {
                // In a real app, this would clear auth and redirect
                localStorage.removeItem('vtb_user')
                router.push(ROUTES.LOGIN)
              }}
              className="text-[#1B4F8C] hover:text-[#2563EB] transition-colors"
            >
              Sign Out & Sign In Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}