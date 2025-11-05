import React from 'react';
import { FileText, Shield, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';

const UserDashboard: React.FC = () => {
  // Mock data
  const recentDocuments = [
    { id: '1', type: 'passport', status: 'verified', date: '2024-01-15', hash: '0xa1b2c3...' },
    { id: '2', type: 'license', status: 'pending', date: '2024-01-14', hash: '0xd4e5f6...' },
    { id: '3', type: 'id', status: 'flagged', date: '2024-01-13', hash: '0x789abc...' }
  ];

  const consentSummary = {
    active: 3,
    revoked: 1
  };

  const fraudAlerts = [
    { id: '1', severity: 'medium', reason: 'Duplicate detection', date: '2024-01-15' },
    { id: '2', severity: 'low', reason: 'Image quality check', date: '2024-01-14' }
  ];

  const blockchainLogs = [
    { id: '1', action: 'Document Upload', hash: '0xa1b2c3d4...', date: '2024-01-15 10:30' },
    { id: '2', action: 'Consent Granted', hash: '0xe5f6g7h8...', date: '2024-01-15 09:15' },
    { id: '3', action: 'Verification Complete', hash: '0xi9j0k1l2...', date: '2024-01-14 16:45' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'flagged':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glassmorphism rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, John!</h1>
        <p className="text-gray-300">Manage your KYC documents and monitor your verification status.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glassmorphism rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Documents</p>
              <p className="text-2xl font-bold text-white">5</p>
            </div>
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="glassmorphism rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Verified</p>
              <p className="text-2xl font-bold text-green-400">3</p>
            </div>
            <Shield className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="glassmorphism rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Consents</p>
              <p className="text-2xl font-bold text-yellow-400">{consentSummary.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="glassmorphism rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Fraud Alerts</p>
              <p className="text-2xl font-bold text-red-400">{fraudAlerts.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Uploads */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Uploads</h3>
          <div className="space-y-3">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(doc.status)}
                  <div>
                    <p className="text-white font-medium capitalize">{doc.type}</p>
                    <p className="text-gray-400 text-sm">{doc.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium capitalize ${
                    doc.status === 'verified' ? 'text-green-400' :
                    doc.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {doc.status}
                  </p>
                  <p className="text-gray-400 text-xs">{doc.hash}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fraud Alerts */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            {fraudAlerts.map((alert) => (
              <div key={alert.id} className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-sm">{alert.date}</span>
                </div>
                <p className="text-white">{alert.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blockchain Logs */}
      <div className="glassmorphism rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Blockchain Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 pb-3">Action</th>
                <th className="text-left text-gray-400 pb-3">Transaction Hash</th>
                <th className="text-left text-gray-400 pb-3">Date & Time</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {blockchainLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-800/50">
                  <td className="py-3 text-white">{log.action}</td>
                  <td className="py-3">
                    <a 
                      href="#" 
                      className="text-blue-400 hover:text-blue-300 font-mono text-xs"
                      title="View on blockchain explorer"
                    >
                      {log.hash}
                    </a>
                  </td>
                  <td className="py-3 text-gray-400">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;