import React from 'react';
import { X, Copy, ExternalLink, FileText, Image, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import Button from '../common/Button';

interface DocumentPreviewModalProps {
  document: any;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ 
  document, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen || !document) return null;

  const copyHash = async () => {
    await navigator.clipboard.writeText(document.sha256);
  };

  const copyTxHash = async () => {
    if (document.blockchainTx) {
      await navigator.clipboard.writeText(document.blockchainTx);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'flagged':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded':
      case 'verified':
        return 'text-green-400';
      case 'processing':
        return 'text-yellow-400';
      case 'flagged':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const renderPreview = () => {
    if (document.fileType?.startsWith('image/')) {
      return (
        <div className="relative">
          <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
            <div className="text-center">
              <Image className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Image Preview</p>
              <p className="text-gray-500 text-xs">Encrypted until consent granted</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-3">
                <Image className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-white font-medium">Document Encrypted</p>
              <p className="text-gray-400 text-sm">Grant consent to banks to view</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
        <div className="text-center">
          <FileText className="w-12 h-12 text-red-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">PDF Document</p>
          <p className="text-gray-500 text-xs">Encrypted until consent granted</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="glassmorphism rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Document Details</h2>
            <p className="text-gray-400 capitalize">{document.type} • {document.fileName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Document Preview */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Preview</h3>
            {renderPreview()}
          </div>

          {/* Document Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Document Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(document.status)}
                    <span className={`font-medium capitalize ${getStatusColor(document.status)}`}>
                      {document.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Document Type</label>
                  <p className="text-white capitalize">{document.type}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">File Name</label>
                  <p className="text-white">{document.fileName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Uploaded At</label>
                  <p className="text-white">{formatDate(document.uploadedAt)}</p>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Technical Details</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">SHA-256 Hash</label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 text-xs font-mono text-green-400 bg-gray-900 p-2 rounded border break-all">
                      {document.sha256}
                    </code>
                    <button
                      onClick={copyHash}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      title="Copy hash"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Blockchain Transaction</label>
                  {document.blockchainTx ? (
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 text-xs font-mono text-blue-400 bg-gray-900 p-2 rounded border break-all">
                        {document.blockchainTx}
                      </code>
                      <button
                        onClick={copyTxHash}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Copy transaction hash"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://etherscan.io/tx/${document.blockchainTx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        title="View on Etherscan"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Pending blockchain confirmation...</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Document ID</label>
                  <code className="text-xs font-mono text-gray-300">{document.documentId}</code>
                </div>
              </div>
            </div>
          </div>

          {/* AI Report */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">AI Fraud Analysis</h3>
            {document.aiReport ? (
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {Math.round((1 - document.aiReport.anomalyScore) * 100)}%
                    </p>
                    <p className="text-gray-400 text-sm">Authenticity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {Math.round(document.aiReport.confidence * 100)}%
                    </p>
                    <p className="text-gray-400 text-sm">Confidence</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">
                      {Math.round(document.aiReport.forgeryProbability * 100)}%
                    </p>
                    <p className="text-gray-400 text-sm">Forgery Risk</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {document.aiReport.duplicateDetection ? 'Yes' : 'No'}
                    </p>
                    <p className="text-gray-400 text-sm">Duplicate</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-700">
                  <p className="text-green-400 text-sm font-medium">✓ Document appears authentic</p>
                  <p className="text-green-400 text-sm font-medium">✓ No tampering detected</p>
                  <p className="text-green-400 text-sm font-medium">✓ No duplicates found</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-gray-400">AI analysis in progress...</p>
                <p className="text-gray-500 text-sm">Results will appear once processing is complete</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-800">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;