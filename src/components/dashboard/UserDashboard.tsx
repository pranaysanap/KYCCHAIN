import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { useAnimatedCounter } from "../../hooks/useAnimatedCounter";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation({
    threshold: 0.1,
    delay: 100,
  });
  const { elementRef: documentsRef, isVisible: documentsVisible } = useScrollAnimation({
    threshold: 0.1,
    delay: 200,
  });
  const { elementRef: alertsRef, isVisible: alertsVisible } = useScrollAnimation({
    threshold: 0.1,
    delay: 300,
  });
  const { elementRef: logsRef, isVisible: logsVisible } = useScrollAnimation({
    threshold: 0.1,
    delay: 400,
  });
  // Mock data
  const recentDocuments = [
    {
      id: "1",
      type: "passport",
      status: "verified",
      date: "2024-01-15",
      hash: "0xa1b2c3...",
    },
    {
      id: "2",
      type: "license",
      status: "pending",
      date: "2024-01-14",
      hash: "0xd4e5f6...",
    },
    {
      id: "3",
      type: "id",
      status: "flagged",
      date: "2024-01-13",
      hash: "0x789abc...",
    },
  ];

  const consentSummary = {
    active: 3,
    revoked: 1,
  };


  const fraudAlerts = [
    {
      id: "1",
      severity: "medium",
      reason: "Duplicate detection",
      date: "2024-01-15",
    },
    {
      id: "2",
      severity: "low",
      reason: "Image quality check",
      date: "2024-01-14",
    },
  ];

  // Animated counters (derive from mock data so numbers reflect current lists)
  const totalDocsCount = useAnimatedCounter({ end: recentDocuments.length + 2, start: 0, duration: 900 });
  const verifiedCount = useAnimatedCounter({ end: recentDocuments.filter(d => d.status === 'verified').length, start: 0, duration: 900 });
  const activeConsentsCount = useAnimatedCounter({ end: consentSummary.active, start: 0, duration: 900 });
  const fraudCount = useAnimatedCounter({ end: fraudAlerts.length, start: 0, duration: 900 });

  const blockchainLogs = [
    {
      id: "1",
      action: "Document Upload",
      hash: "0xa1b2c3d4...",
      date: "2024-01-15 10:30",
    },
    {
      id: "2",
      action: "Consent Granted",
      hash: "0xe5f6g7h8...",
      date: "2024-01-15 09:15",
    },
    {
      id: "3",
      action: "Verification Complete",
      hash: "0xi9j0k1l2...",
      date: "2024-01-14 16:45",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "flagged":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-400 bg-red-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20";
      case "low":
        return "text-blue-400 bg-blue-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glassmorphism rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.name || "User"}!
        </h1>
        <p className="text-gray-300">
          Manage your KYC documents and monitor your verification status.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div
        ref={statsRef}
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 transition-all duration-700 ${
          statsVisible ? "opacity-100" : "opacity-0 translate-y-8"
        }`}
      >
        <motion.div whileHover={{ y: -6 }} className="rounded-xl p-6 bg-gradient-to-br from-indigo-900/40 to-cyan-800/18 border border-white/6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Documents</p>
              <p className="text-2xl font-bold text-white">{Math.round(totalDocsCount)}</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <FileText className="w-7 h-7 text-blue-300" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -6 }} className="rounded-xl p-6 bg-gradient-to-br from-green-900/30 to-emerald-800/12 border border-white/6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Verified</p>
              <p className="text-2xl font-bold text-green-400">{Math.round(verifiedCount)}</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <Shield className="w-7 h-7 text-green-300" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -6 }} className="rounded-xl p-6 bg-gradient-to-br from-yellow-900/30 to-amber-800/12 border border-white/6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Consents</p>
              <p className="text-2xl font-bold text-yellow-400">{Math.round(activeConsentsCount)}</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <CheckCircle className="w-7 h-7 text-yellow-300" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -6 }} className="rounded-xl p-6 bg-gradient-to-br from-red-900/30 to-rose-800/12 border border-white/6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Fraud Alerts</p>
              <p className="text-2xl font-bold text-red-400">{Math.round(fraudCount)}</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <AlertTriangle className="w-7 h-7 text-red-300" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Uploads */}
        <div
          ref={documentsRef}
          className={`glassmorphism rounded-xl p-6 transition-all duration-1000 ${
            documentsVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-8'
          }`}
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Uploads
          </h3>
          <div className="space-y-3">
            {recentDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(doc.status)}
                  <div>
                    <p className="text-white font-medium capitalize">
                      {doc.type}
                    </p>
                    <p className="text-gray-400 text-sm">{doc.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium capitalize ${
                      doc.status === "verified"
                        ? "text-green-400"
                        : doc.status === "pending"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {doc.status}
                  </p>
                  <p className="text-gray-400 text-xs">{doc.hash}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fraud Alerts */}
        <div
          ref={alertsRef}
          className={`glassmorphism rounded-xl p-6 transition-all duration-1000 ${
            alertsVisible ? 'animate-slide-in-right' : 'opacity-0 translate-x-8'
          }`}
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {fraudAlerts.map((alert) => (
              <div key={alert.id} className="p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}
                  >
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
      <div
        ref={logsRef}
        className={`glassmorphism rounded-xl p-6 transition-all duration-1000 ${
          logsVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
        }`}
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          Blockchain Activity
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 pb-3">Action</th>
                <th className="text-left text-gray-400 pb-3">
                  Transaction Hash
                </th>
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
