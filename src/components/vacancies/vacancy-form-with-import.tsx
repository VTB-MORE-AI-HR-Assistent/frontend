"use client"

import React, { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
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
  Import,
  Upload,
  Edit
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
  const [activeTab, setActiveTab] = useState<"file">("file")
  const [importUrl, setImportUrl] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
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

  // File upload handlers
  const onDropFile = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0])
      setImportStatus({ type: null, message: "" })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFile,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const handleFileUpload = async () => {
    if (!uploadedFile) {
      setImportStatus({ type: "error", message: "Please select a file to upload" })
      return
    }

    setIsUploading(true)
    setImportStatus({ type: "info", message: "Parsing vacancy document..." })

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', uploadedFile)

      // Send file to backend for parsing
      const response = await fetch('/api/vacancies/parse-file', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to parse vacancy document')
      }

      const parsedData = await response.json()

      // Update form with parsed data
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
        message: `Document parsed successfully! Review and edit the information below.` 
      })
      
      // Switch to manual tab to show imported data
      setTimeout(() => {
        setActiveTab("manual")
        setUploadedFile(null)
      }, 1500)

    } catch (error) {
      console.error("File upload error:", error)
      setImportStatus({ 
        type: "error", 
        message: "Failed to parse document. Please try again or enter manually." 
      })
    } finally {
      setIsUploading(false)
    }
  }

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">
            {mode === "create" ? "Создать новую вакансию" : "Редактировать вакансию"}
          </h2>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Загрузить вакансию
            </h3>
            <p className="text-sm text-gray-600">
              Загрузите файл с описанием вакансии
            </p>
          </div>

          <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Vacancy Document
              </CardTitle>
              <CardDescription>
                Upload a PDF, DOC, DOCX, or TXT file containing the vacancy description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  isDragActive 
                    ? "border-blue-500 bg-blue-50" 
                    : uploadedFile 
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
                }`}
              >
                <input {...getInputProps()} />
                
                {uploadedFile ? (
                  <div className="space-y-3">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setUploadedFile(null)
                        setImportStatus({ type: null, message: "" })
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className={`mx-auto h-12 w-12 mb-3 ${
                      isDragActive ? "text-blue-500" : "text-gray-400"
                    }`} />
                    <p className="font-medium text-gray-900 mb-1">
                      {isDragActive 
                        ? "Drop the file here" 
                        : "Drop your vacancy document here"
                      }
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      or click to browse
                    </p>
                    <Button variant="outline" type="button">
                      <Upload className="mr-2 h-4 w-4" />
                      Select File
                    </Button>
                    <p className="text-xs text-gray-500 mt-4">
                      Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                    </p>
                  </>
                )}
              </div>

              {/* Parse Button */}
              {uploadedFile && (
                <Button 
                  className="w-full"
                  onClick={handleFileUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Parsing Document...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Parse Vacancy Document
                    </>
                  )}
                </Button>
              )}

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

              {/* Info Section */}
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Upload a document containing the vacancy description</li>
                  <li>Our AI will extract key information like title, requirements, and responsibilities</li>
                  <li>Review and edit the extracted information before publishing</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}