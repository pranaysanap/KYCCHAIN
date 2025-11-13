import React, { useState, useEffect, useCallback } from "react";
import UploadForm from "../../components/documents/UploadForm";
import DocumentTable from "../../components/documents/DocumentTable";
import DocumentPreviewModal from "../../components/documents/DocumentPreviewModal";
import AnimatedCard from "../../components/common/AnimatedCard";
import { motion } from 'framer-motion';
import { getDocuments } from "../../services/mockApi";
import { useAuth } from "../../contexts/AuthContext";
import { apiService } from "../../services/api";

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

const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadDocuments = useCallback(async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      // Try to load from backend first, fallback to mock API
      let docs;
      try {
        docs = await apiService.getDocuments(user.email);
      } catch (backendError) {
        console.warn("Backend not available, using mock API:", backendError);
        docs = await getDocuments();
      }
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      loadDocuments();
    }
  }, [user?.email, loadDocuments]);

  const handleUploadSuccess = (newDocument: Document) => {
    setDocuments((prev) => [newDocument, ...prev]);
    // Reload documents to ensure consistency with backend
    loadDocuments();
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedDocument(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AnimatedCard>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4}}>
          <h1 className="text-2xl font-bold text-white mb-2">My Documents</h1>
          <p className="text-gray-300">
            Upload and manage your KYC documents. All files are encrypted and
            hashed for blockchain verification.
          </p>
        </motion.div>
      </AnimatedCard>

      {/* Upload Form */}
      <AnimatedCard>
        <UploadForm onUploadSuccess={handleUploadSuccess} />
      </AnimatedCard>

      {/* Documents Table */}
      <AnimatedCard>
        <DocumentTable
          documents={documents}
          onViewDocument={handleViewDocument}
          isLoading={isLoading}
        />
      </AnimatedCard>

      {/* Preview Modal */}
      <DocumentPreviewModal
        document={selectedDocument}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />
    </div>
  );
};

export default DocumentsPage;
