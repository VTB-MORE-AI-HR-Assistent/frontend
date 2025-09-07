"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Upload,
  FileText,
  X,
  Loader2
} from "lucide-react"
import { uploadCVs } from "@/lib/candidate-api"
import { useToast } from "@/hooks/use-toast"

export default function UploadResumePage() {
  const [uploadedCVs, setUploadedCVs] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedCVs(prev => [...prev, ...acceptedFiles])
  }, [])

  const uploadSelectedCVs = async () => {
    if (uploadedCVs.length === 0) return
    setUploadError(null)
    setIsProcessing(true)
    try {
      const resp = await uploadCVs(uploadedCVs, null)
      toast({
        title: "Files uploaded successfully", 
        description: `Uploaded ${uploadedCVs.length} files for processing`
      })
      // Clear files after successful upload
      setUploadedCVs([])
    } catch (e: any) {
      setUploadError(e?.message ?? "Upload failed")
      toast({
        title: "Upload failed",
        description: e?.message ?? "Upload failed",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const removeFile = (index: number) => {
    setUploadedCVs(prev => prev.filter((_, i) => i !== index))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/rtf': ['.rtf'],
      'text/rtf': ['.rtf'],
      'text/plain': ['.txt']
    },
    multiple: true,
    maxSize: 20 * 1024 * 1024 // 20MB
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Resumes</h1>
        <p className="text-muted-foreground">
          Import candidate profiles from PDF or Word documents
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center
              transition-colors duration-200 ease-in-out cursor-pointer
              ${isDragActive 
                ? 'border-[#1B4F8C] bg-[#1B4F8C]/5' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className={`mx-auto h-12 w-12 ${isDragActive ? 'text-[#1B4F8C]' : 'text-gray-400'}`} />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {isDragActive ? 'Drop files here' : 'Drag & drop resumes here'}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              or click to browse files
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supports PDF, DOC, DOCX, RTF, and TXT files (Max 20MB each)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {uploadedCVs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Files ({uploadedCVs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedCVs.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Button */}
      {uploadedCVs.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Ready to Upload</h3>
                <p className="text-sm text-muted-foreground">
                  {uploadedCVs.length} files ready for processing
                </p>
              </div>
              <Button 
                onClick={uploadSelectedCVs}
                disabled={isProcessing}
                className="bg-[#1B4F8C] hover:bg-[#1B4F8C]/90"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {uploadedCVs.length} Files
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Error */}
      {uploadError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{uploadError}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}