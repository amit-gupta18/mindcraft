import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle } from "lucide-react";

type FileUploadProps = {
  onFileSelect: (file: File) => void;
  isDragOver: boolean;
  setIsDragOver: (v: boolean) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  error: string | null;
};

export default function FileUpload({
  onFileSelect, isDragOver, setIsDragOver, fileInputRef, error
}: FileUploadProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) onFileSelect(files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) onFileSelect(files[0]);
  };

  return (
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
        </div>
        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
