import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Shield, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function Masking() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  const [maskedImageUrl, setMaskedImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      setError(null)
      setMaskedImageUrl(null)

      // Create preview URL for original image
      const url = URL.createObjectURL(file)
      setOriginalImageUrl(url)
    } else {
      setError("Please select a valid image file")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleMaskImage = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("http://localhost:8000/mask_pii/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const blob = await response.blob()
      const maskedUrl = URL.createObjectURL(blob)
      setMaskedImageUrl(maskedUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">PII Masking Tool</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Upload Aadhaar or ID card, detect & mask sensitive data.
          </p>
        </div>

        {/* File Upload Section */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                isDragOver
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "border-gray-300 dark:border-gray-700 hover:border-blue-400"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Drag & drop your image here</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">or click to select a file</p>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="mb-2">
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              {selectedFile && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Selected: {selectedFile.name}
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Process Button */}
        {selectedFile && (
          <div className="text-center mb-6">
            <Button
              onClick={handleMaskImage}
              disabled={isProcessing}
              className="px-8 py-3 text-lg font-medium"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Mask Image
                </>
              )}
            </Button>
          </div>
        )}

        {/* Image Preview Section */}
        {(originalImageUrl || maskedImageUrl) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Image */}
            {originalImageUrl && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Original Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={originalImageUrl || "/placeholder.svg"}
                      alt="Original document"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Masked Image */}
            {maskedImageUrl && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    Masked Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={maskedImageUrl || "/placeholder.svg"}
                      alt="Masked document"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Shield className="h-4 w-4" />
            Your data is processed securely and not stored on our servers
          </div>
        </div>
      </div>
    </div>
  )
}
