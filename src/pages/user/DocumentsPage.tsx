import React, { useState, useEffect } from 'react';
import UploadForm from '../../components/documents/UploadForm';
import DocumentTable from '../../components/documents/DocumentTable';
import DocumentPreviewModal from '../../components/documents/DocumentPreviewModal';
import { getDocuments } from '../../services/mockApi';

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (newDocument: any) => {
    setDocuments(prev => [newDocument, ...prev]);
    
    // Simulate status updates
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.documentId === newDocument.documentId 
            ? { ...doc, status: 'uploaded' }
            : doc
        )
      );
    }, 3000);
  };

  const handleViewDocument = (document: any) => {
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
      <div className="glassmorphism rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">My Documents</h1>
        <p className="text-gray-300">
          Upload and manage your KYC documents. All files are encrypted and hashed for blockchain verification.
        </p>
      </div>

      {/* Upload Form */}
      <UploadForm onUploadSuccess={handleUploadSuccess} />

      {/* Documents Table */}
      <DocumentTable
        documents={documents}
        onViewDocument={handleViewDocument}
        isLoading={isLoading}
      />

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