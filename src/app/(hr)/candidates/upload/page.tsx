"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  Users,
  Briefcase,
  Download,
  Eye,
  Trash2,
  CloudUpload,
  MapPin,
  Clock
} from "lucide-react"
import Link from "next/link"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "processing" | "completed" | "error"
  candidateName?: string
  position?: string
  matchScore?: number
  error?: string
  vacancyId?: string
}

interface Vacancy {
  id: string
  title: string
  department: string
  location: string
  status: string
  candidates: number
}

// Mock vacancies data
const mockVacancies: Vacancy[] = [
  { id: "1", title: "Senior Frontend Developer", department: "Engineering", location: "Moscow", status: "active", candidates: 45 },
  { id: "2", title: "Product Manager", department: "Product", location: "St. Petersburg", status: "active", candidates: 32 },
  { id: "3", title: "Backend Developer", department: "Engineering", location: "Moscow", status: "active", candidates: 38 },
  { id: "4", title: "UX/UI Designer", department: "Design", location: "Remote", status: "active", candidates: 28 },
  { id: "5", title: "Data Analyst", department: "Product", location: "Moscow", status: "active", candidates: 22 },
  { id: "6", title: "DevOps Engineer", department: "Engineering", location: "Moscow", status: "active", candidates: 15 },
  { id: "7", title: "Marketing Manager", department: "Marketing", location: "Remote", status: "active", candidates: 15 },
  { id: "8", title: "QA Engineer", department: "Engineering", location: "Hybrid", status: "active", candidates: 18 }
]

export default function UploadResumePage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedVacancy, setSelectedVacancy] = useState<string>("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!selectedVacancy) {
      alert("Please select a vacancy first")
      return
    }

    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: "processing" as const,
      vacancyId: selectedVacancy
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])
    setIsProcessing(true)

    // Simulate file processing
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            // Simulate random success/error
            const isSuccess = Math.random() > 0.1
            if (isSuccess) {
              return {
                ...f,
                status: "completed",
                candidateName: `Candidate ${Math.floor(Math.random() * 1000)}`,
                position: ["Frontend Developer", "Backend Developer", "Product Manager", "DevOps Engineer"][Math.floor(Math.random() * 4)],
                matchScore: Math.floor(Math.random() * 30) + 70
              }
            } else {
              return {
                ...f,
                status: "error",
                error: "Failed to parse resume. Please ensure it's a valid PDF or DOCX file."
              }
            }
          }
          return f
        }))

        // Check if all files are processed
        setUploadedFiles(prev => {
          const allProcessed = prev.every(f => f.status !== "processing")
          if (allProcessed) {
            setIsProcessing(false)
          }
          return prev
        })
      }, 1500 + index * 500)
    })
  }, [selectedVacancy])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  })

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const clearAll = () => {
    setUploadedFiles([])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const successCount = uploadedFiles.filter(f => f.status === "completed").length
  const errorCount = uploadedFiles.filter(f => f.status === "error").length
  const processingCount = uploadedFiles.filter(f => f.status === "processing").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Resumes</h1>
          <p className="text-muted-foreground">
            Import candidate profiles from PDF or Word documents
          </p>
        </div>
        <Link href="/candidates">
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            View Candidates
          </Button>
        </Link>
      </div>

      {/* Vacancy Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Vacancy</CardTitle>
          <CardDescription>Choose which position these resumes are for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vacancy">Vacancy *</Label>
              <Select value={selectedVacancy} onValueChange={setSelectedVacancy}>
                <SelectTrigger id="vacancy" className={!selectedVacancy ? "border-orange-300" : ""}>
                  <SelectValue placeholder="Select a vacancy" />
                </SelectTrigger>
                <SelectContent>
                  {mockVacancies.map((vacancy) => (
                    <SelectItem key={vacancy.id} value={vacancy.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{vacancy.title}</span>
                        <div className="flex items-center gap-2 ml-4 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {vacancy.location}
                          <span>•</span>
                          <Users className="h-3 w-3" />
                          {vacancy.candidates}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedVacancy && (
                <p className="text-sm text-orange-600">Please select a vacancy before uploading resumes</p>
              )}
            </div>
            {selectedVacancy && (
              <div className="space-y-2">
                <Label>Vacancy Details</Label>
                <div className="p-4 border rounded-lg bg-gray-50">
                  {(() => {
                    const vacancy = mockVacancies.find(v => v.id === selectedVacancy)
                    return vacancy ? (
                      <>
                        <p className="font-medium">{vacancy.title}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {vacancy.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {vacancy.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {vacancy.candidates} candidates
                          </span>
                        </div>
                      </>
                    ) : null
                  })()}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {uploadedFiles.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uploadedFiles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <CloudUpload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload Area */}
      <Card className={!selectedVacancy ? "opacity-60" : ""}>
        <CardContent className="p-0">
          <div
            {...(selectedVacancy ? getRootProps() : {})}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center
              transition-colors duration-200 ease-in-out
              ${!selectedVacancy 
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                : isDragActive 
                  ? 'border-[#1B4F8C] bg-[#1B4F8C]/5 cursor-pointer' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 cursor-pointer'
              }
            `}
          >
            {selectedVacancy && <input {...getInputProps()} />}
            <Upload className={`mx-auto h-12 w-12 ${!selectedVacancy ? 'text-gray-300' : isDragActive ? 'text-[#1B4F8C]' : 'text-gray-400'}`} />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {!selectedVacancy 
                ? 'Select a vacancy first' 
                : isDragActive 
                  ? 'Drop files here' 
                  : 'Drag & drop resumes here'
              }
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {!selectedVacancy 
                ? 'You must select a vacancy before uploading resumes'
                : 'or click to browse files'
              }
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supports PDF, DOC, and DOCX files (Max 10MB each)
            </p>
            <Button 
              className="mt-4" 
              variant={isDragActive ? "default" : "outline"}
              disabled={!selectedVacancy}
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Processing Files...</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(successCount + errorCount) / uploadedFiles.length * 100} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {successCount + errorCount} of {uploadedFiles.length} files processed
            </p>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Uploaded Files</CardTitle>
                <CardDescription>Review and manage uploaded resumes</CardDescription>
              </div>
              {uploadedFiles.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                      {file.status === "completed" && (
                        <div className="space-y-1 mt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{file.candidateName}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{file.position}</span>
                            <Badge variant="outline" className="text-xs">
                              {file.matchScore}% match
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Briefcase className="h-3 w-3" />
                            {mockVacancies.find(v => v.id === file.vacancyId)?.title}
                          </div>
                        </div>
                      )}
                      {file.status === "error" && (
                        <p className="text-sm text-red-600 mt-1">{file.error}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === "processing" && (
                      <Badge variant="secondary">
                        <CloudUpload className="mr-1 h-3 w-3 animate-pulse" />
                        Processing
                      </Badge>
                    )}
                    {file.status === "completed" && (
                      <>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Imported
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {file.status === "error" && (
                      <Badge variant="destructive">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Failed
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {uploadedFiles.length > 0 && successCount > 0 && (
        <div className="flex justify-end gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Link href="/candidates">
            <Button className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white">
              <Users className="mr-2 h-4 w-4" />
              View {successCount} New Candidates
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}