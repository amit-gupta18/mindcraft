import { useState } from "react";
// import { ImageUpload } from "./ImageUpload";
import { ImageUpload } from "./components/ImageUpload";

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = async (file) => {
    console.log("Selected file:", file);
    setSelectedImage(file);

    // 🔹 Example backend upload
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Backend response:", data);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Image Upload Wireframe</h1>

      <ImageUpload
        onImageSelect={handleImageSelect}
        isProcessing={isProcessing}
      />

      {selectedImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Preview:</h3>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="preview"
            width={200}
          />
        </div>
      )}
    </div>
  );
}
