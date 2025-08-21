import { useState, useCallback } from "react";

export const ImageUpload = ({ onImageSelect, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith("image/"));

      if (imageFile) {
        onImageSelect(imageFile);
      } else {
        alert("Invalid file type. Please upload an image.");
      }
    },
    [onImageSelect]
  );

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div
      style={{
        border: "2px dashed gray",
        padding: "20px",
        textAlign: "center",
        cursor: isProcessing ? "not-allowed" : "pointer",
        opacity: isProcessing ? 0.5 : 1,
        background: isDragOver ? "#f0f0f0" : "transparent",
        marginTop: "20px",
      }}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onClick={() =>
        !isProcessing && document.getElementById("file-input")?.click()
      }
    >
      {isProcessing ? (
        <p>Processing image...</p>
      ) : (
        <p>{isDragOver ? "Drop image here" : "Drag & drop or click to upload"}</p>
      )}

      {!isProcessing && (
        <button style={{ marginTop: "10px", padding: "6px 12px" }}>
          Choose File
        </button>
      )}

      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: "none" }}
        disabled={isProcessing}
      />
    </div>
  );
};
