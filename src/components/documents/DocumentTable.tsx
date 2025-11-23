import React from 'react';
import { FileText } from 'lucide-react';
import DocumentRow from './DocumentRow';

interface DocumentTableProps {
  documents: any[];
  onViewDocument: (document: any) => void;
  isLoading?: boolean;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ 
  documents, 
  onViewDocument, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="glassmorphism rounded-xl p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
          <span className="text-gray-300">Loading documents...</span>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="glassmorphism rounded-xl p-8">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No documents yet</h3>
          <p className="text-gray-400">
            Upload your first document to get started with KYC verification.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glassmorphism rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white">My Documents</h3>
        <p className="text-gray-400 text-sm">
          {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Document Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                SHA-256 Hash
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Uploaded At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {documents.map((document) => (
              <DocumentRow
                key={document.documentId}
                document={document}
                onView={onViewDocument}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentTable;