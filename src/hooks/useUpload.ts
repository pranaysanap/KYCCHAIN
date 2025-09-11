import { useState, useCallback } from 'react';
import { postUpload } from '../services/mockApi';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadResult {
  documentId: string;
  sha256: string;
  status: string;
}

interface UseUploadReturn {
  upload: (file: File, metadata: { type: string }, onProgress?: (progress: UploadProgress) => void) => Promise<UploadResult>;
  isUploading: boolean;
  error: string | null;
  progress: UploadProgress | null;
}

export const useUpload = (): UseUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const upload = useCallback(async (
    file: File, 
    metadata: { type: string }, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> => {
    setIsUploading(true);
    setError(null);
    setProgress(null);

    try {
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
            percentage: Math.round((loaded / total) * 100)
          };
          
          setProgress(progressData);
          onProgress?.(progressData);
        }, 100);

        return interval;
      };

      const progressInterval = simulateProgress();
      
      const result = await postUpload(file, metadata);
      
      clearInterval(progressInterval);
      
      // Ensure progress shows 100%
      const finalProgress = {
        loaded: file.size,
        total: file.size,
        percentage: 100
      };
      setProgress(finalProgress);
      onProgress?.(finalProgress);

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setIsUploading(false);
      // Clear progress after a delay
      setTimeout(() => setProgress(null), 2000);
    }
  }, []);

  return {
    upload,
    isUploading,
    error,
    progress
  };
};