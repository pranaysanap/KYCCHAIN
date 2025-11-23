import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, ShieldCheck, X, AlertTriangle } from "lucide-react";
import Button from "../../components/common/Button";
import AnimatedCard from '../../components/common/AnimatedCard';
import { motion } from 'framer-motion';
import { apiService } from "../../services/api";

interface ConsentRecord {
  id: string;
  institutionName: string;
  status: "granted" | "revoked";
  lastUpdated: string;
}

const institutions = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "IndusInd Bank",
  "Bandhan Bank",
  "IDFC First Bank",
  "Federal Bank",
  "RBL Bank",
  "Yes Bank",
  "IDBI Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "Punjab National Bank",
  "Bank of India",
  "Central Bank of India",
  "Indian Overseas Bank",
  "UCO Bank",
  "Punjab & Sind Bank",
  "Indian Bank",
  "Bank of Maharashtra",
  "Dena Bank",
  "Vijaya Bank",
];

const statusBadge = (status: "granted" | "revoked") => (
  <span
    className={
      status === "granted"
        ? "px-2 py-1 text-xs rounded-full bg-green-900/40 text-green-300 border border-green-700/40"
        : "px-2 py-1 text-xs rounded-full bg-red-900/40 text-red-300 border border-red-700/40"
    }
  >
    {status === "granted" ? "Granted" : "Revoked"}
  </span>
);

const ConsentPage: React.FC = () => {
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "granted" | "revoked">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{
    institution: string;
    action: "grant" | "revoke";
  } | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        console.log("🔵 Loading user consents...");
        const data = await apiService.getConsents();
        console.log("✅ Loaded consents:", data);
        setConsents(data);
      } catch (error) {
        console.error("❌ Failed to load consents:", error);
        let errorMessage = "Failed to load consents";

        if (error instanceof Error) {
          errorMessage = error.message;
          console.error("   Error message:", error.message);
        }

        // Try to extract error from response
        if (typeof error === "object" && error !== null) {
          const err = error as { error?: string; details?: string };
          if (err.error) errorMessage = err.error;
          if (err.details) console.error("   Details:", err.details);
        }

        setToast({ type: "error", message: errorMessage });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Helper to refresh consents from server (ensures UI matches DB)
  const refreshConsents = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getConsents();
      setConsents(data);
    } catch (err) {
      console.error("❌ Failed to refresh consents:", err);
      setToast({ type: "error", message: "Failed to refresh consents" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    return consents
      .filter((c) => (filter === "all" ? true : c.status === filter))
      .filter((c) =>
        c.institutionName.toLowerCase().includes(search.toLowerCase()),
      );
  }, [consents, search, filter]);

  const handleToggle = async (
    institutionName: string,
    current: "granted" | "revoked",
  ) => {
    // Instead of performing immediately, open confirmation dialog
    setConfirmTarget({
      institution: institutionName,
      action: current === "granted" ? "revoke" : "grant",
    });
    setIsConfirmOpen(true);
  };

  const openGrantModal = () => {
    setSelectedInstitution("");
    setIsModalOpen(true);
  };

  const handleConfirm = async (confirm: boolean) => {
    if (!confirmTarget) return setIsConfirmOpen(false);

    const { institution, action } = confirmTarget;
    setIsConfirmOpen(false);

    if (!confirm) {
      setConfirmTarget(null);
      return;
    }

    try {
      if (!institution || typeof institution !== "string" || institution.trim() === "") {
        setToast({ type: "error", message: "Institution name is required to proceed." });
        setConfirmTarget(null);
        return;
      }

      const instTrim = institution.trim();

      if (action === "grant") {
        console.log("🔵 Sending grantConsent for:", instTrim);
        await apiService.grantConsent(instTrim);
        // Refresh from server to reflect persisted state
        await refreshConsents();
        setToast({ type: "success", message: "Consent granted successfully!" });
      } else {
        console.log("🔵 Sending revokeConsent for:", instTrim);
        await apiService.revokeConsent(instTrim);
        // Refresh from server to reflect persisted state
        await refreshConsents();
        setToast({ type: "success", message: "Consent revoked successfully!" });
      }
    } catch (error: unknown) {
      console.error("❌ Confirm action error:", error);
      let errorMessage = "Operation failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setToast({ type: "error", message: errorMessage });
    } finally {
      setConfirmTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Consent Management
            </h1>
            <p className="text-gray-300">
              Control which institutions can access your KYC documents
            </p>
          </div>
          <Button
            variant="primary"
            onClick={openGrantModal}
            className="neon-glow-blue"
          >
            <Plus className="w-4 h-4 mr-2" /> Grant New Consent
          </Button>
        </div>
      </AnimatedCard>

      {/* Search & Filter */}
      <AnimatedCard>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.35}}>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search institutions"
                className="w-full bg-gray-900/70 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Search institutions"
              />
            </div>
            <div>
              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as "all" | "granted" | "revoked")
                }
                className="bg-gray-900/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Filter by status"
              >
                <option value="all">All</option>
                <option value="granted">Granted</option>
                <option value="revoked">Revoked</option>
              </select>
            </div>
          </div>
        </motion.div>
      </AnimatedCard>

      {/* Table */}
      <AnimatedCard className="overflow-hidden p-0">
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Institution Consents</h3>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-300">
            Loading consents...
          </div>
        ) : (
          <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto">
            <table className="w-full min-w-[720px] md:min-w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Institution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Access Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      No matching institutions
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="transition-colors">
                      <td className="px-6 py-4 text-white">
                        {c.institutionName}
                      </td>
                      <td className="px-6 py-4">{statusBadge(c.status)}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(c.lastUpdated).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant={
                            c.status === "granted" ? "danger" : "success"
                          }
                          size="sm"
                          onClick={() =>
                            handleToggle(c.institutionName, c.status)
                          }
                          aria-label={
                            c.status === "granted"
                              ? "Revoke consent"
                              : "Grant consent"
                          }
                        >
                          {c.status === "granted" ? "Revoke" : "Grant"}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
  </AnimatedCard>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            aria-hidden="true"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Grant Consent"
            className="relative glassmorphism rounded-xl p-4 md:p-6 w-full max-w-full md:max-w-lg max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white text-lg font-semibold">
                Grant Consent
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search banks..."
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  className="w-full bg-gray-900/70 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {institutions
                    .filter((bank) =>
                      bank
                        .toLowerCase()
                        .includes(selectedInstitution.toLowerCase()),
                    )
                    .slice(0, 20)
                    .map((name) => (
                      <button
                        key={name}
                        onClick={() => {
                          setSelectedInstitution(name);
                          setIsModalOpen(false); // Close bank selection modal
                          // open confirmation modal before granting
                          setConfirmTarget({ institution: name, action: "grant" });
                          setIsConfirmOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white rounded-lg transition-colors"
                      >
                        {name}
                      </button>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg glassmorphism border ${
            toast.type === "success"
              ? "border-green-700/40 text-green-300"
              : "border-red-700/40 text-red-300"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmOpen && confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => {
              setIsConfirmOpen(false);
              setConfirmTarget(null);
            }}
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative glassmorphism rounded-xl p-6 w-full max-w-md border border-gray-700/50 shadow-2xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-3 rounded-full ${
                confirmTarget.action === 'grant'
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                {confirmTarget.action === 'grant' ? (
                  <ShieldCheck className="w-6 h-6 text-green-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">
                  Confirm {confirmTarget.action === 'grant' ? 'Grant' : 'Revoke'} Consent
                </h4>
                <p className="text-sm text-gray-400 mt-1">
                  Review your action carefully
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 leading-relaxed">
                You are about to <span className={`font-semibold ${
                  confirmTarget.action === 'grant' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {confirmTarget.action === 'grant' ? 'grant' : 'revoke'}
                </span> consent for <span className="font-semibold text-blue-400">
                  {confirmTarget.institution}
                </span> to access your KYC documents.
              </p>
              {confirmTarget.action === 'grant' && (
                <p className="text-sm text-gray-400 mt-3 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2 text-green-400" />
                  This institution will be able to verify your identity for financial services.
                </p>
              )}
              {confirmTarget.action === 'revoke' && (
                <p className="text-sm text-gray-400 mt-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
                  This institution will lose access to your KYC documents immediately.
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => handleConfirm(false)}
                className="hover:bg-gray-700/50 transition-colors"
              >
                Cancel
              </Button>
              <Button
                variant={confirmTarget.action === 'grant' ? 'primary' : 'danger'}
                onClick={() => handleConfirm(true)}
                className={confirmTarget.action === 'grant' ? 'neon-glow-green' : 'neon-glow-red'}
              >
                {confirmTarget.action === 'grant' ? 'Grant Consent' : 'Revoke Consent'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ConsentPage;
