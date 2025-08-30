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
  FileText,
  Link2,
  Loader2,
  CheckCircle,
  Globe,
  Import
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VacancyFormProps {
  mode: "create" | "edit"
  initialData?: any
}

export default function VacancyFormWithImport({ mode, initialData }: VacancyFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"manual" | "import">("manual")
  const [importUrl, setImportUrl] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error" | "info" | null
    message: string
  }>({ type: null, message: "" })
  
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

  // Supported job sites
  const supportedSites = [
    { name: "HeadHunter (hh.ru)", domain: "hh.ru", icon: "🟢" },
    { name: "SuperJob", domain: "superjob.ru", icon: "🔵" },
    { name: "Rabota.ru", domain: "rabota.ru", icon: "🟠" },
    { name: "Zarplata.ru", domain: "zarplata.ru", icon: "🟣" },
    { name: "LinkedIn", domain: "linkedin.com", icon: "🔷" },
    { name: "Indeed", domain: "indeed.com", icon: "🟦" }
  ]

  const handleImportFromUrl = async () => {
    if (!importUrl.trim()) {
      setImportStatus({ type: "error", message: "Please enter a valid URL" })
      return
    }

    // Validate URL format
    try {
      const url = new URL(importUrl)
      const isSupported = supportedSites.some(site => url.hostname.includes(site.domain))
      
      if (!isSupported) {
        setImportStatus({ 
          type: "error", 
          message: "This website is not supported yet. Please use one of the supported job sites." 
        })
        return
      }
    } catch (error) {
      setImportStatus({ type: "error", message: "Please enter a valid URL" })
      return
    }

    setIsImporting(true)
    setImportStatus({ type: "info", message: "Sending URL to backend for parsing..." })

    try {
      // Send URL to backend for parsing
      const response = await fetch('/api/vacancies/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: importUrl })
      })

      if (!response.ok) {
        throw new Error('Failed to parse vacancy')
      }

      const parsedData = await response.json()

      // Update form with parsed data from backend
      setFormData(prev => ({
        ...prev,
        title: parsedData.title || prev.title,
        department: parsedData.department || prev.department,
        location: parsedData.location || prev.location,
        type: parsedData.type || prev.type,
        experience: parsedData.experience || prev.experience,
        salaryMin: parsedData.salaryMin || prev.salaryMin,
        salaryMax: parsedData.salaryMax || prev.salaryMax,
        currency: parsedData.currency || prev.currency,
        description: parsedData.description || prev.description,
        responsibilities: parsedData.responsibilities?.length > 0 ? parsedData.responsibilities : [""],
        requirements: parsedData.requirements?.length > 0 ? parsedData.requirements : [""],
        benefits: parsedData.benefits?.length > 0 ? parsedData.benefits : [""],
      }))

      setImportStatus({ 
        type: "success", 
        message: `Vacancy data imported successfully! Review and edit the information below.` 
      })
      
      // Switch to manual tab to show imported data
      setTimeout(() => {
        setActiveTab("manual")
      }, 1500)

    } catch (error) {
      console.error("Import error:", error)
      setImportStatus({ 
        type: "error", 
        message: "Failed to parse vacancy data. Please try again or enter manually." 
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
    if (!formData.title.trim()) newErrors.title = "Job title is required"
    if (!formData.department) newErrors.department = "Department is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.description.trim()) newErrors.description = "Job description is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (status: "draft" | "published") => {
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In production, save to backend
    console.log("Saving vacancy:", { ...formData, status })
    
    router.push("/vacancies")
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 pb-20 md:pb-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {mode === "create" ? "Create New Vacancy" : "Edit Vacancy"}
          </h2>
          <p className="text-muted-foreground">
            {mode === "create" 
              ? "Import from job site or fill in the details manually" 
              : "Update vacancy information"}
          </p>
        </div>
      </div>

      {/* Import/Manual Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "manual" | "import")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Import className="h-4 w-4" />
            Import from URL
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Import Vacancy from Job Site
              </CardTitle>
              <CardDescription>
                Paste a URL from a job posting and we'll automatically extract the information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="import-url">Job Posting URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="import-url"
                    type="url"
                    placeholder="https://hh.ru/vacancy/12345678"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    disabled={isImporting}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleImportFromUrl}
                    disabled={isImporting || !importUrl.trim()}
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Parsing...
                      </>
                    ) : (
                      <>
                        <Link2 className="mr-2 h-4 w-4" />
                        Import
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Import Status */}
              {importStatus.type && (
                <Alert variant={importStatus.type === "error" ? "destructive" : "default"}>
                  {importStatus.type === "success" && <CheckCircle className="h-4 w-4" />}
                  {importStatus.type === "error" && <AlertCircle className="h-4 w-4" />}
                  {importStatus.type === "info" && <Loader2 className="h-4 w-4 animate-spin" />}
                  <AlertTitle>
                    {importStatus.type === "success" && "Success!"}
                    {importStatus.type === "error" && "Error"}
                    {importStatus.type === "info" && "Processing"}
                  </AlertTitle>
                  <AlertDescription>
                    {importStatus.message}
                  </AlertDescription>
                </Alert>
              )}

              {/* Supported Sites */}
              <div className="space-y-3">
                <Label>Supported Job Sites</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {supportedSites.map((site) => (
                    <div key={site.domain} className="flex items-center gap-2 p-2 border rounded-lg">
                      <span className="text-lg">{site.icon}</span>
                      <span className="text-sm">{site.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  More job sites will be added soon. Contact support to request a specific site.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Entry Tab */}
        <TabsContent value="manual" className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Essential details about the position
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Senior React Developer"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleInputChange("department", value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-sm text-red-500">{errors.department}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g., Moscow, Russia"
                  />
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
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    placeholder="e.g., 3-5 years"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Salary Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                      placeholder="Min"
                    />
                    <Input
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                      placeholder="Max"
                    />
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleInputChange("currency", value)}
                    >
                      <SelectTrigger className="w-24">
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
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the role, team, and what makes this opportunity exciting..."
                  rows={6}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <Label>Key Responsibilities</Label>
                {formData.responsibilities.map((resp, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={resp}
                      onChange={(e) => handleArrayFieldChange("responsibilities", index, e.target.value)}
                      placeholder="Enter a responsibility"
                    />
                    {formData.responsibilities.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayField("responsibilities", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField("responsibilities")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Responsibility
                </Button>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <Label>Requirements</Label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={req}
                      onChange={(e) => handleArrayFieldChange("requirements", index, e.target.value)}
                      placeholder="Enter a requirement"
                    />
                    {formData.requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayField("requirements", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField("requirements")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Requirement
                </Button>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <Label>Benefits & Perks</Label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => handleArrayFieldChange("benefits", index, e.target.value)}
                      placeholder="Enter a benefit"
                    />
                    {formData.benefits.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayField("benefits", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField("benefits")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Benefit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSubmit("published")}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Publish Vacancy
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}