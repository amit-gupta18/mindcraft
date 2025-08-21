import { useState } from "react";
import { ImageUpload } from "./components/ImageUpload";

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null); // store backend result
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = async (file) => {
    console.log("Selected file:", file);
    setSelectedImage(file);
    setProcessedImage(null); // reset previous result

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/mask_pii/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Backend failed");
      }

      // 🔹 Backend sends raw image, so we parse as blob
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      setProcessedImage(objectUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to process image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-6">PII Masking Demo</h1>

      <ImageUpload
        onImageSelect={handleImageSelect}
        isProcessing={isProcessing}
      />

      {/* Preview original */}
      {selectedImage && (
        <div className="mt-6">
          <h3 className="font-semibold">Original Preview:</h3>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="preview"
            className="mt-2 w-12 h-12 border rounded"
          />
        </div>
      )}

      {/* Preview masked */}
      {processedImage && (
        <div className="mt-6">
          <h3 className="font-semibold">Masked Preview:</h3>
          <img
            src={processedImage}
            alt="masked"
            className="mt-2 w-64 border rounded"
          />
        </div>
      )}
    </div>
  );
}
