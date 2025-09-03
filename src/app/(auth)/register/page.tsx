"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthSplitLayout } from "@/components/layout/auth-split-layout"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ROUTES } from "@/lib/constants"
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  User,
  Check
} from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [agreedToTerms, setAgreedToTerms] = React.useState(false)
  const [apiError, setApiError] = React.useState("")

  // Form data
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
    }
    return checks
  }

  const passwordStrength = checkPasswordStrength(formData.password)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setErrors({})
    setApiError("")
    
    // Validation
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Call real API
    setIsLoading(true)
    
    try {
      await register(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName
      )
      // The auth context will handle the redirect
    } catch (error: any) {
      setApiError(error.message || "Failed to create account. Please try again.")
      setIsLoading(false)
    }
  }

  const slides = [
    {
      title: "Join Our HR Revolution",
      subtitle: "Start hiring smarter today",
      description: "Access powerful AI tools, streamlined workflows, and comprehensive analytics to build your dream team faster than ever."
    },
    {
      title: "Automate Your Workflow",
      subtitle: "Save hours every week",
      description: "Let AI handle repetitive tasks like resume screening and interview scheduling while you focus on building relationships."
    },
    {
      title: "Scale Your Hiring",
      subtitle: "Grow without limits",
      description: "Whether you're hiring one person or one hundred, our platform scales with your needs and maintains quality at every step."
    }
  ]

  return (
    <AuthSplitLayout slides={slides}>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create an account
          </h1>
          <p className="text-sm text-slate-600">
            Start your journey with VTB HR Assistant
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* API Error Display */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="firstName"
                  placeholder="John"
                  className="pl-10 h-11"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="pl-10 h-11"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@vtb.com"
                className="pl-10 h-11"
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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="pl-10 pr-10 h-11"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
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
            
            {/* Password requirements */}
            {formData.password && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <Check className={`h-3 w-3 ${passwordStrength.length ? 'text-green-500' : 'text-slate-300'}`} />
                  <span className={passwordStrength.length ? 'text-green-600' : 'text-slate-500'}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className={`h-3 w-3 ${passwordStrength.uppercase ? 'text-green-500' : 'text-slate-300'}`} />
                  <span className={passwordStrength.uppercase ? 'text-green-600' : 'text-slate-500'}>
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Check className={`h-3 w-3 ${passwordStrength.number ? 'text-green-500' : 'text-slate-300'}`} />
                  <span className={passwordStrength.number ? 'text-green-600' : 'text-slate-500'}>
                    One number
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pl-10 pr-10 h-11"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                disabled={isLoading}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer select-none">
                I agree to the{" "}
                <Link href="/terms" className="text-[#1B4F8C] hover:text-[#2563EB] transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#1B4F8C] hover:text-[#2563EB] transition-colors">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-500 ml-6">{errors.terms}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="vtbPrimary"
            className="w-full h-11"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              <span className="flex items-center">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="font-medium text-[#1B4F8C] hover:text-[#2563EB] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  )
}