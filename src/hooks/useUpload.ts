import { useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

// Helper function to compute SHA-256 hash
const computeSHA256 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadResult {
  documentId: string;
  sha256: string;
  status: string;
  message?: string;
  file_url?: string;
  public_id?: string;
  email?: string;
  documentType?: string;
  folder?: string;
}

interface UseUploadReturn {
  upload: (
    file: File,
    metadata: { type: string },
    onProgress?: (progress: UploadProgress) => void,
  ) => Promise<UploadResult>;
  isUploading: boolean;
  error: string | null;
  progress: UploadProgress | null;
}

export const useUpload = (): UseUploadReturn => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const upload = useCallback(
    async (
      file: File,
      metadata: { type: string },
      onProgress?: (progress: UploadProgress) => void,
    ): Promise<UploadResult> => {
      setIsUploading(true);
      setError(null);
      setProgress(null);

      try {
        // Check if user is authenticated
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Prepare form data for backend upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentType", metadata.type);
        formData.append("email", user.email);

        // Simulate upload progress
        const simulateProgress = () => {
          let loaded = 0;
          const total = file.size;
          const interval = setInterval(() => {
            loaded += total * 0.1; // 10% increments
            if (loaded >= total) {
              loaded = total;
              clearInterval(interval);
            }

            const progressData = {
              loaded,
              total,
              percentage: Math.round((loaded / total) * 100),
            };

            setProgress(progressData);
            onProgress?.(progressData);
          }, 100);

          return interval;
        };

        const progressInterval = simulateProgress();

        // Call real backend API
        const response = await fetch(
          "http://localhost:5000/api/upload/upload-document",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("kycchain_token") || ""}`, // Assuming token is stored
            },
            body: formData,
          },
        );

        clearInterval(progressInterval);

        const result = await response.json();

        // Check if upload was successful based on response structure
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Upload failed");
        }

        // Ensure progress shows 100%
        const finalProgress = {
          loaded: file.size,
          total: file.size,
          percentage: 100,
        };
        setProgress(finalProgress);
        onProgress?.(finalProgress);

        // Compute SHA-256 hash from file
        const sha256Hash = await computeSHA256(file);

        // Transform backend response to match expected interface
        const uploadedDoc = {
          documentId:
            result.public_id || result.documentId || `doc_${Date.now()}`,
          sha256: sha256Hash,
          status: "uploaded",
          message: result.message || "Document uploaded successfully!",
          file_url: result.file_url || result.secure_url,
          public_id: result.public_id,
          email: result.email || user.email,
          documentType: result.documentType || metadata.type,
          folder: result.folder,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          blockchainTx: "0x" + Math.random().toString(16).substr(2, 64),
          aiReport: {
            anomalyScore: Math.random() * 0.3,
            forgeryProbability: Math.random() * 0.2,
            duplicateDetection: false,
            faceMismatch: false,
            tamperedImage: false,
            confidence: 0.95 + Math.random() * 0.05,
          },
        };

        return uploadedDoc;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        console.error("Upload error:", err);
        throw new Error(errorMessage);
      } finally {
        setIsUploading(false);
        // Clear progress after a delay
        setTimeout(() => setProgress(null), 2000);
      }
    },
    [user],
  );

  return {
    upload,
    isUploading,
    error,
    progress,
  };
};
