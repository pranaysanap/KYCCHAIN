import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  Copy,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Button from "../common/Button";
import { useUpload } from "../../hooks/useUpload";
import { sha256Hex } from "../../services/mockApi";

interface Document {
  documentId: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  status: string;
  file_url?: string;
  sha256?: string;
  message?: string;
  [key: string]: unknown;
}

interface UploadFormProps {
  onUploadSuccess: (document: Document) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("passport");
  const [fileHash, setFileHash] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [hashCopied, setHashCopied] = useState(false);
  const [isComputingHash, setIsComputingHash] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading, progress } = useUpload();

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];

    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    if (!allowedTypes.includes(file.type)) {
      return "Only JPEG, PNG, and PDF files are allowed";
    }

    return null;
  };

  const handleFileSelect = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSelectedFile(file);
    setIsComputingHash(true);

    try {
      const hash = await sha256Hex(file);
      setFileHash(hash);
    } catch {
      setError("Failed to compute file hash");
    } finally {
      setIsComputingHash(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const copyHash = async () => {
    if (fileHash) {
      await navigator.clipboard.writeText(fileHash);
      setHashCopied(true);
      setTimeout(() => setHashCopied(false), 2000);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setError("");
    setSuccessMessage("");

    try {
      const result = await upload(selectedFile, { type: documentType });

      // Check if result indicates success
      if (result && result.status === "uploaded") {
        // Display success message
        setSuccessMessage(
          result.message || "Document uploaded successfully to Cloudinary!",
        );

        // Transform result to match Document interface
        const document: Document = {
          documentId: result.documentId,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          uploadedAt: new Date().toISOString(),
          status: result.status,
          file_url: result.file_url,
          sha256: result.sha256,
          message: result.message,
        };

        // Notify parent component
        onUploadSuccess(document);

        // Reset form after short delay to show success message
        setTimeout(() => {
          setSelectedFile(null);
          setFileHash("");
          setSuccessMessage("");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 3000);
      } else {
        throw new Error("Upload did not complete successfully");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(errorMessage);
      console.error("Upload error:", err);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setFileHash("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="w-16 h-16 object-cover rounded-lg border border-gray-600"
        />
      );
    }
    return (
      <div className="w-16 h-16 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center">
        <FileText className="w-8 h-8 text-red-400" />
      </div>
    );
  };

  return (
    <div className="glassmorphism rounded-xl p-4 sm:p-6 mb-6">
      <h3 className="text-xl font-semibold text-white mb-4">Upload Document</h3>

      {/* Document Type Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Document Type
        </label>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
        >
          <option value="passport">Passport</option>
          <option value="id">ID Card</option>
          <option value="license">Driver License</option>
        </select>
      </div>

      {/* Drag and Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? "border-blue-400 bg-blue-500/10 neon-glow-blue"
            : "border-gray-600 hover:border-blue-400 hover:bg-blue-500/5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          accept="image/jpeg,image/png,image/jpg,application/pdf"
          className="hidden"
        />

        {!selectedFile ? (
          <div>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">
              Drag and drop your document here
            </p>
            <p className="text-gray-400 text-sm">or click to browse files</p>
            <p className="text-gray-500 text-xs mt-2">
              Supports JPEG, PNG, PDF • Max 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              {getFilePreview(selectedFile)}
              <div className="text-left">
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-gray-400 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-blue-400 text-sm capitalize">
                  {documentType}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm mt-4 animate-fade-in-up">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm mt-4 animate-fade-in-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* SHA-256 Hash Display */}
      {selectedFile && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">
              SHA-256 Hash
            </label>
            {isComputingHash && (
              <div className="flex items-center space-x-2 text-blue-400 text-sm">
                <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                <span>Computing...</span>
              </div>
            )}
          </div>

          {fileHash && (
            <div className="flex items-center space-x-2">
              <code className="flex-1 text-xs font-mono text-green-400 bg-gray-900 p-2 rounded border break-all">
                {fileHash}
              </code>
              <button
                onClick={copyHash}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Copy hash"
              >
                {hashCopied ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            SHA-256 computed locally — only the hash will go to the blockchain.
          </p>
        </div>
      )}

      {/* Upload Progress */}
      {progress && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Uploading...</span>
            <span>{progress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 neon-glow-blue"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {selectedFile && fileHash && !isUploading && !successMessage && (
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!fileHash || isComputingHash}
            className="flex-1"
            icon={<Upload className="w-4 h-4" />}
          >
            Upload to Cloudinary
          </Button>
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex-1"
            icon={<X className="w-4 h-4" />}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
