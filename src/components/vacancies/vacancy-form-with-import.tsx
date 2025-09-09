"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { 
  ArrowLeft,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VacancyFormProps {
  mode: "create" | "edit"
  initialData?: any
}

export default function VacancyFormWithImport({ mode }: VacancyFormProps) {
  const router = useRouter()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | "info" | null
    message: string
  }>({ type: null, message: "" })

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.file.size > 10 * 1024 * 1024) {
          setUploadStatus({ 
            type: "error", 
            message: "Размер файла должен быть меньше 10MB" 
          })
        } else {
          setUploadStatus({ 
            type: "error", 
            message: "Пожалуйста, загрузите файл PDF, DOC, DOCX или TXT" 
          })
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setUploadedFile(file)
        setUploadStatus({ type: "success", message: `Файл "${file.name}" успешно загружен` })
        
        // Simulate file processing
        setIsUploading(true)
        setUploadStatus({ type: "info", message: "Обработка файла..." })
        
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        setIsUploading(false)
        setUploadStatus({ 
          type: "success", 
          message: "Информация о вакансии успешно извлечена! Вакансия создана." 
        })
        
        // Redirect to vacancies page after successful upload
        setTimeout(() => {
          router.push("/vacancies")
        }, 1500)
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Загрузить документ вакансии
              </CardTitle>
              <CardDescription>
                Загрузите файл PDF, DOC, DOCX или TXT с описанием вакансии
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
                      <p className="text-lg font-medium text-green-900">
                        Файл загружен
                      </p>
                      <p className="text-sm text-green-700">
                        {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {isUploading ? (
                      <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {isDragActive ? "Отпустите файл здесь" : "Перетащите файл сюда"}
                      </p>
                      <p className="text-sm text-gray-500">
                        или нажмите для выбора файла
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Поддерживаются: PDF, DOC, DOCX, TXT (макс. 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Messages */}
              {uploadStatus.type && (
                <Alert className={`${
                  uploadStatus.type === "error" ? "border-red-200 bg-red-50" :
                  uploadStatus.type === "success" ? "border-green-200 bg-green-50" :
                  "border-blue-200 bg-blue-50"
                }`}>
                  {uploadStatus.type === "error" ? (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  ) : uploadStatus.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                  )}
                  <AlertDescription className={`${
                    uploadStatus.type === "error" ? "text-red-800" :
                    uploadStatus.type === "success" ? "text-green-800" :
                    "text-blue-800"
                  }`}>
                    {uploadStatus.message}
                  </AlertDescription>
                </Alert>
              )}

              {/* How it works */}
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Как это работает</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Загрузите документ с описанием вакансии</li>
                  <li>Наш ИИ извлечет ключевую информацию: название, требования и обязанности</li>
                  <li>Просмотрите и отредактируйте извлеченную информацию перед публикацией</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
