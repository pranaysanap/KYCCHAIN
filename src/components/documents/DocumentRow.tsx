import React from 'react';
import { Eye, Copy, FileText, Image, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';

interface DocumentRowProps {
  document: {
    documentId: string;
    fileName: string;
    type: string;
    sha256: string;
    status: string;
    uploadedAt: string;
    fileType?: string;
  };
  onView: (document: any) => void;
}

const DocumentRow: React.FC<DocumentRowProps> = ({ document, onView }) => {
  const getStatusBadge = (status: string) => {
    const badges = {
      uploaded: { color: 'text-green-400 bg-green-500/20', icon: CheckCircle, text: 'Uploaded' },
      processing: { color: 'text-yellow-400 bg-yellow-500/20', icon: Clock, text: 'Processing' },
      flagged: { color: 'text-red-400 bg-red-500/20', icon: AlertTriangle, text: 'Flagged' },
      verified: { color: 'text-blue-400 bg-blue-500/20', icon: CheckCircle, text: 'Verified' }
    };

    const badge = badges[status as keyof typeof badges] || badges.processing;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    );
  };

  const getFileIcon = (fileType?: string) => {
    if (fileType?.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-400" />;
    }
    return <FileText className="w-5 h-5 text-red-400" />;
  };

  const copyHash = async () => {
    await navigator.clipboard.writeText(document.sha256);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const shortenHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  return (
    <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
      {/* Preview */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg">
          {getFileIcon(document.fileType)}
        </div>
      </td>

      {/* Document Type */}
      <td className="px-6 py-4">
        <div>
          <p className="text-white font-medium capitalize">{document.type}</p>
          <p className="text-gray-400 text-sm truncate max-w-32" title={document.fileName}>
            {document.fileName}
          </p>
        </div>
      </td>

      {/* SHA-256 Hash */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <code className="text-xs font-mono text-green-400" title={document.sha256}>
            {shortenHash(document.sha256)}
          </code>
          <button
            onClick={copyHash}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Copy full hash"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        {getStatusBadge(document.status)}
      </td>

      {/* Uploaded At */}
      <td className="px-6 py-4 text-gray-400 text-sm">
        {formatDate(document.uploadedAt)}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(document)}
            icon={<Eye className="w-4 h-4" />}
          >
            View
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default DocumentRow;