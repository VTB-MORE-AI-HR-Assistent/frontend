"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { VTBCard } from "@/components/ui/vtb-card"
import { ROUTES } from "@/lib/constants"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(false)

  // Form state
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  })

  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
  })

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setErrors({ email: "", password: "" })
    
    // Basic validation
    let hasErrors = false
    const newErrors = { email: "", password: "" }
    
    if (!formData.email) {
      newErrors.email = "Email is required"
      hasErrors = true
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
      hasErrors = true
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
      hasErrors = true
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      hasErrors = true
    }
    
    if (hasErrors) {
      setErrors(newErrors)
      return
    }
    
    // Simulate login
    setIsLoading(true)
    
    // Mock API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect based on email domain (mock logic)
      if (formData.email.includes("@vtb.com")) {
        router.push(ROUTES.HR_DASHBOARD)
      } else {
        router.push(ROUTES.CANDIDATE_PORTAL)
      }
    }, 1500)
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[400px]">
        <VTBCard variant="elevated" className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-600">
              Sign in to your VTB HR account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#1B4F8C] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal cursor-pointer"
              >
                Remember me for 30 days
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="vtbPrimary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                href={ROUTES.REGISTER}
                className="font-medium text-[#1B4F8C] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </VTBCard>

        {/* Help Links */}
        <div className="mt-4 flex justify-center gap-4 text-xs text-slate-500">
          <Link href="/help" className="hover:text-slate-700">
            Need help?
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-slate-700">
            Contact support
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}