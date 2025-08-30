"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/layout/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { VTBCard } from "@/components/ui/vtb-card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ROUTES, USER_ROLES } from "@/lib/constants"
import { 
  Mail, 
  Lock, 
  User, 
  Building, 
  Phone,
  Eye, 
  EyeOff, 
  ArrowRight,
  ArrowLeft,
  Check,
  Briefcase,
  Users
} from "lucide-react"

type RegistrationStep = 1 | 2 | 3

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState<RegistrationStep>(1)
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [agreedToTerms, setAgreedToTerms] = React.useState(false)

  // Form data
  const [formData, setFormData] = React.useState({
    // Step 1: Role Selection
    role: "",
    
    // Step 2: Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Step 3: Security
    password: "",
    confirmPassword: "",
    company: "",
    position: "",
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Calculate progress
  const progress = (currentStep / 3) * 100

  // Validate current step
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    switch (currentStep) {
      case 1:
        if (!formData.role) {
          newErrors.role = "Please select a role"
        }
        break
        
      case 2:
        if (!formData.firstName) {
          newErrors.firstName = "First name is required"
        }
        if (!formData.lastName) {
          newErrors.lastName = "Last name is required"
        }
        if (!formData.email) {
          newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email"
        }
        if (!formData.phone) {
          newErrors.phone = "Phone number is required"
        }
        if (formData.role === USER_ROLES.HR_MANAGER || formData.role === USER_ROLES.RECRUITER) {
          if (!formData.company) {
            newErrors.company = "Company name is required"
          }
          if (!formData.position) {
            newErrors.position = "Position is required"
          }
        }
        break
        
      case 3:
        if (!formData.password) {
          newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters"
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match"
        }
        if (!agreedToTerms) {
          newErrors.terms = "You must agree to the terms and conditions"
        }
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 3) {
        setCurrentStep((currentStep + 1) as RegistrationStep)
        setErrors({})
      }
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as RegistrationStep)
      setErrors({})
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep()) {
      return
    }
    
    setIsLoading(true)
    
    // Mock API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect based on role
      if (formData.role === USER_ROLES.CANDIDATE) {
        router.push(ROUTES.CANDIDATE_PORTAL)
      } else {
        router.push(ROUTES.HR_DASHBOARD)
      }
    }, 1500)
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[500px]">
        <VTBCard variant="elevated" className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-sm text-slate-600">
              Join VTB HR Assistant to streamline your recruitment
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2">
              <span className={`text-xs ${currentStep >= 1 ? 'text-[#1B4F8C]' : 'text-slate-400'}`}>
                Role
              </span>
              <span className={`text-xs ${currentStep >= 2 ? 'text-[#1B4F8C]' : 'text-slate-400'}`}>
                Information
              </span>
              <span className={`text-xs ${currentStep >= 3 ? 'text-[#1B4F8C]' : 'text-slate-400'}`}>
                Security
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>I want to:</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <div className="flex items-start space-x-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <RadioGroupItem value={USER_ROLES.CANDIDATE} id="candidate" />
                      <Label htmlFor="candidate" className="cursor-pointer flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <User className="h-5 w-5 text-[#1B4F8C]" />
                          <span className="font-medium">Find a Job</span>
                        </div>
                        <p className="text-sm text-slate-600">
                          Browse opportunities and apply for positions
                        </p>
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <RadioGroupItem value={USER_ROLES.HR_MANAGER} id="hr" />
                      <Label htmlFor="hr" className="cursor-pointer flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Briefcase className="h-5 w-5 text-[#1B4F8C]" />
                          <span className="font-medium">Hire Talent (HR Manager)</span>
                        </div>
                        <p className="text-sm text-slate-600">
                          Post jobs and manage the recruitment process
                        </p>
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <RadioGroupItem value={USER_ROLES.RECRUITER} id="recruiter" />
                      <Label htmlFor="recruiter" className="cursor-pointer flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Users className="h-5 w-5 text-[#1B4F8C]" />
                          <span className="font-medium">Recruiter</span>
                        </div>
                        <p className="text-sm text-slate-600">
                          Source candidates and coordinate interviews
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.role && (
                    <p className="text-xs text-red-500">{errors.role}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>

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
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Show company fields for HR roles */}
                {(formData.role === USER_ROLES.HR_MANAGER || formData.role === USER_ROLES.RECRUITER) && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="company"
                          placeholder="VTB Bank"
                          className="pl-10"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                      {errors.company && (
                        <p className="text-xs text-red-500">{errors.company}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        placeholder="HR Manager"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      />
                      {errors.position && (
                        <p className="text-xs text-red-500">{errors.position}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 3: Security */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  
                  {/* Password requirements */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <Check className={`h-3 w-3 ${formData.password.length >= 8 ? 'text-green-500' : 'text-slate-300'}`} />
                      <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-slate-500'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Check className={`h-3 w-3 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-slate-300'}`} />
                      <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-slate-500'}>
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Check className={`h-3 w-3 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-slate-300'}`} />
                      <span className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-slate-500'}>
                        One number
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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

                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-[#1B4F8C] hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-[#1B4F8C] hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.terms && (
                    <p className="text-xs text-red-500">{errors.terms}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
              
              {currentStep < 3 ? (
                <Button
                  type="button"
                  variant="vtbPrimary"
                  onClick={handleNext}
                  className={currentStep === 1 ? "ml-auto" : ""}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="vtbPrimary"
                  disabled={isLoading}
                  className={currentStep === 1 ? "ml-auto" : ""}
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
                      <Check className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href={ROUTES.LOGIN}
                className="font-medium text-[#1B4F8C] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </VTBCard>
      </div>
    </AuthLayout>
  )
}