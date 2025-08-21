import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield } from "lucide-react";
import FileUpload from "./FileUpload";
import Processing from "./Processing";
import Preview from "./Preview";

export default function Masking() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [maskedImageUrl, setMaskedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setError(null);
      setMaskedImageUrl(null);
      setOriginalImageUrl(URL.createObjectURL(file));
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleMaskImage = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await fetch("http://localhost:8000/mask_pii/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const blob = await response.blob();
      setMaskedImageUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setOriginalImageUrl(null);
    setMaskedImageUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950 p-6">
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
        {!selectedFile && !isProcessing && (
          <FileUpload
            onFileSelect={handleFileSelect}
            isDragOver={isDragOver}
            setIsDragOver={setIsDragOver}
            // @ts-ignore
            fileInputRef={fileInputRef}
            error={error}
          />
        )}
        {isProcessing && <Processing />}




        {/* -------- Show selected file  --------------- */}


        {selectedFile && !isProcessing && (
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              Selected: {selectedFile.name}
              <Button onClick={reset} size="icon" variant="secondary" className="ml-4">
                ✕
              </Button>
            </div>
            <Button
              onClick={handleMaskImage}
              disabled={isProcessing}
              className="px-8 py-3 text-lg font-medium"
              size="lg"
            >
              <Shield className="h-5 w-5 mr-2" />
              Mask Image
            </Button>
          </div>
        )}



        {/* ------ Preview images ---------- */}

        {/* preview masked image first  */}
        {(originalImageUrl || maskedImageUrl) && (
          <Preview originalImageUrl={originalImageUrl} maskedImageUrl={maskedImageUrl} />
        )}
      </div>
    </div>
  );
}
