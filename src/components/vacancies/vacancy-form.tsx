"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  AlertCircle,
  Calendar,
  Building,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  Target,
  Award,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VacancyFormProps {
  mode: "create" | "edit"
  initialData?: any
}

export default function VacancyForm({ mode, initialData }: VacancyFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    department: initialData?.department || "",
    location: initialData?.location || "",
    type: initialData?.type || "Full-time",
    experience: initialData?.experience || "",
    salaryMin: initialData?.salaryMin || "",
    salaryMax: initialData?.salaryMax || "",
    currency: initialData?.currency || "RUB",
    status: initialData?.status || "draft",
    priority: initialData?.priority || "medium",
    deadline: initialData?.deadline || "",
    startDate: initialData?.startDate || "",
    description: initialData?.description || "",
    responsibilities: initialData?.responsibilities || [""],
    requirements: initialData?.requirements || [""],
    benefits: initialData?.benefits || [""],
    hiringManagerId: initialData?.hiringManagerId || "",
    recruiterId: initialData?.recruiterId || ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleArrayFieldChange = (field: string, index: number, value: string) => {
    const newArray = [...formData[field as keyof typeof formData] as string[]]
    newArray[index] = value
    handleInputChange(field, newArray)
  }

  const addArrayField = (field: string) => {
    const newArray = [...formData[field as keyof typeof formData] as string[], ""]
    handleInputChange(field, newArray)
  }

  const removeArrayField = (field: string, index: number) => {
    const newArray = (formData[field as keyof typeof formData] as string[]).filter((_, i) => i !== index)
    handleInputChange(field, newArray)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required"
    }
    if (!formData.department) {
      newErrors.department = "Department is required"
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }
    if (!formData.experience.trim()) {
      newErrors.experience = "Experience level is required"
    }
    if (!formData.deadline) {
      newErrors.deadline = "Application deadline is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required"
    }
    if (formData.salaryMin && formData.salaryMax && parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      newErrors.salaryMax = "Maximum salary must be greater than minimum"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData)
      router.push("/vacancies")
    }, 1000)
  }

  const handleCancel = () => {
    router.push("/vacancies")
  }

  const handleSaveAsDraft = () => {
    setFormData(prev => ({ ...prev, status: "draft" }))
    handleSubmit(new Event('submit') as any)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {mode === "create" ? "Create New Vacancy" : "Edit Vacancy"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "create" 
                ? "Fill in the details to create a new job opening" 
                : "Update the vacancy information"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          {mode === "create" && (
            <Button variant="outline" onClick={handleSaveAsDraft}>
              Save as Draft
            </Button>
          )}
          <Button 
            className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : mode === "create" ? "Create Vacancy" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential details about the position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Frontend Developer"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange("department", value)}
                >
                  <SelectTrigger id="department" className={errors.department ? "border-red-500" : ""}>
                    <Building className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-red-500">{errors.department}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="e.g., Moscow, Remote"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Employment Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">
                  Experience Level <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="experience"
                    placeholder="e.g., 3-5 years"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    className={`pl-10 ${errors.experience ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.experience && (
                  <p className="text-sm text-red-500">{errors.experience}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Priority Level</Label>
                <RadioGroup
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange("priority", value)}
                >
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low">Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high">High</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Information */}
        <Card>
          <CardHeader>
            <CardTitle>Compensation</CardTitle>
            <CardDescription>Salary range and benefits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="salaryMin"
                    type="number"
                    placeholder="150000"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="salaryMax"
                    type="number"
                    placeholder="250000"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                    className={`pl-10 ${errors.salaryMax ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.salaryMax && (
                  <p className="text-sm text-red-500">{errors.salaryMax}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange("currency", value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RUB">RUB</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Important dates for this position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deadline">
                  Application Deadline <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange("deadline", e.target.value)}
                    className={`pl-10 ${errors.deadline ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.deadline && (
                  <p className="text-sm text-red-500">{errors.deadline}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Expected Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>Detailed information about the position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the role, team, and company..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={`min-h-[150px] ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <Separator />

            {/* Responsibilities */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Key Responsibilities</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField("responsibilities")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.responsibilities.map((item: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex items-center justify-center w-8 h-10">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <Input
                      placeholder="Enter a key responsibility..."
                      value={item}
                      onChange={(e) => handleArrayFieldChange("responsibilities", index, e.target.value)}
                    />
                    {formData.responsibilities.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayField("responsibilities", index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Requirements */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Requirements</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField("requirements")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.requirements.map((item: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex items-center justify-center w-8 h-10">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <Input
                      placeholder="Enter a requirement..."
                      value={item}
                      onChange={(e) => handleArrayFieldChange("requirements", index, e.target.value)}
                    />
                    {formData.requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayField("requirements", index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Benefits */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Benefits</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField("benefits")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.benefits.map((item: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex items-center justify-center w-8 h-10">
                      <Award className="h-4 w-4 text-amber-600" />
                    </div>
                    <Input
                      placeholder="Enter a benefit..."
                      value={item}
                      onChange={(e) => handleArrayFieldChange("benefits", index, e.target.value)}
                    />
                    {formData.benefits.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayField("benefits", index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hiring Team */}
        <Card>
          <CardHeader>
            <CardTitle>Hiring Team</CardTitle>
            <CardDescription>Assign team members responsible for this position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hiringManager">Hiring Manager</Label>
                <Select
                  value={formData.hiringManagerId}
                  onValueChange={(value) => handleInputChange("hiringManagerId", value)}
                >
                  <SelectTrigger id="hiringManager">
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select hiring manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Alexander Petrov</SelectItem>
                    <SelectItem value="2">Natalia Smirnova</SelectItem>
                    <SelectItem value="3">Dmitry Volkov</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recruiter">Recruiter</Label>
                <Select
                  value={formData.recruiterId}
                  onValueChange={(value) => handleInputChange("recruiterId", value)}
                >
                  <SelectTrigger id="recruiter">
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select recruiter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Maria Ivanova</SelectItem>
                    <SelectItem value="2">Elena Mikhailova</SelectItem>
                    <SelectItem value="3">Olga Kuznetsova</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status (for edit mode) */}
        {mode === "edit" && (
          <Card>
            <CardHeader>
              <CardTitle>Vacancy Status</CardTitle>
              <CardDescription>Control the visibility and state of this vacancy</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="active" id="active" className="mt-1" />
                    <div>
                      <Label htmlFor="active">Active</Label>
                      <p className="text-sm text-muted-foreground">
                        Vacancy is published and accepting applications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="paused" id="paused" className="mt-1" />
                    <div>
                      <Label htmlFor="paused">Paused</Label>
                      <p className="text-sm text-muted-foreground">
                        Temporarily not accepting new applications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="draft" id="draft" className="mt-1" />
                    <div>
                      <Label htmlFor="draft">Draft</Label>
                      <p className="text-sm text-muted-foreground">
                        Vacancy is not published yet
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="closed" id="closed" className="mt-1" />
                    <div>
                      <Label htmlFor="closed">Closed</Label>
                      <p className="text-sm text-muted-foreground">
                        Position has been filled or cancelled
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Form Actions (Mobile) */}
        <div className="flex gap-2 justify-end md:hidden">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {mode === "create" && (
            <Button type="button" variant="outline" onClick={handleSaveAsDraft}>
              Save as Draft
            </Button>
          )}
          <Button 
            type="submit"
            className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : mode === "create" ? "Create Vacancy" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}