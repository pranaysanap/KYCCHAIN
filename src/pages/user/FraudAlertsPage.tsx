import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, FileText, Building2, Search, Eye, CheckCircle2, Send } from 'lucide-react';
import Button from '../../components/common/Button';
import { FraudAlertRecord, getFraudAlerts, reportAlert, resolveAlert } from '../../services/mockApi';

const severityBadge = (sev: 'high' | 'medium' | 'low') => {
  const map = {
    high: 'bg-red-900/40 text-red-300 border border-red-700/40',
    medium: 'bg-yellow-900/40 text-yellow-200 border border-yellow-700/40',
    low: 'bg-blue-900/40 text-blue-300 border border-blue-700/40'
  } as const;
  return <span className={`px-2 py-1 text-xs rounded-full ${map[sev]}`}>{sev === 'high' ? 'High' : sev === 'medium' ? 'Medium' : 'Low'}</span>;
};

const statusBadge = (status: 'new' | 'under_review' | 'resolved') => {
  const map = {
    new: 'bg-blue-900/40 text-blue-300 border border-blue-700/40',
    under_review: 'bg-yellow-900/40 text-yellow-200 border border-yellow-700/40',
    resolved: 'bg-green-900/40 text-green-300 border border-green-700/40'
  } as const;
  const label = status === 'under_review' ? 'Under Review' : status === 'resolved' ? 'Resolved' : 'New';
  return <span className={`px-2 py-1 text-xs rounded-full ${map[status]}`}>{label}</span>;
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

const IconFor = ({ kind }: { kind: 'document' | 'institution' }) => (
  kind === 'document' ? <FileText className="w-5 h-5 text-blue-300" /> : <Building2 className="w-5 h-5 text-blue-300" />
);

const FraudAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlertRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [selected, setSelected] = useState<FraudAlertRecord | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await getFraudAlerts();
        setAlerts(data);
      } catch {
        setToast({ type: 'error', message: 'Failed to load alerts' });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    return alerts
      .filter(a => (severity === 'all' ? true : a.severity === severity))
      .filter(a => (onlyOpen ? a.status !== 'resolved' : true))
      .filter(a => {
        const q = search.toLowerCase();
        return (
          a.affected.name.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          (a.details.institutionName?.toLowerCase() || '').includes(q)
        );
      });
  }, [alerts, severity, onlyOpen, search]);

  const onResolve = async (id: string) => {
    try {
      const updated = await resolveAlert(id);
      setAlerts(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
      setToast({ type: 'success', message: 'Alert marked as resolved' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Failed to resolve alert' });
    }
  };

  const onReport = async (id: string) => {
    try {
      await reportAlert(id);
      setToast({ type: 'success', message: 'Reported to authority' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Failed to report alert' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Fraud Alerts</h1>
            <p className="text-gray-300">Monitor suspicious activity related to your documents and consents</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glassmorphism rounded-xl p-4 neon-glow-red">
          <p className="text-sm text-gray-400">Total Alerts</p>
          <p className="text-2xl font-bold text-white">{alerts.length}</p>
        </div>
        <div className="glassmorphism rounded-xl p-4" style={{ boxShadow: '0 0 20px rgba(239,68,68,0.25)' }}>
          <p className="text-sm text-gray-400">Unresolved Alerts</p>
          <p className="text-2xl font-bold text-white">{alerts.filter(a => a.status !== 'resolved').length}</p>
        </div>
        <div className="glassmorphism rounded-xl p-4">
          <p className="text-sm text-gray-400">Last Detected Alert</p>
          <p className="text-lg font-medium text-white">{alerts[0] ? new Date(alerts[0].timestamp).toLocaleString() : '—'}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glassmorphism rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search alerts"
              className="w-full bg-gray-900/70 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Search alerts"
            />
          </div>
          <div>
            <select
              value={severity}
              onChange={e => setSeverity(e.target.value as any)}
              className="bg-gray-900/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Filter by severity"
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <label className="inline-flex items-center space-x-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={onlyOpen}
              onChange={e => setOnlyOpen(e.target.checked)}
            />
            <span>Only unresolved</span>
          </label>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-gray-300">Loading alerts...</div>
        ) : filtered.length === 0 ? (
          <div className="glassmorphism rounded-xl p-6 text-center text-gray-400">No alerts found</div>
        ) : (
          filtered.map(a => (
            <div key={a.id} className="glassmorphism rounded-xl p-5 border border-gray-800 hover:border-red-700/40 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <IconFor kind={a.affected.kind} />
                  <div>
                    <div className="flex items-center space-x-3">
                      <h4 className="text-white font-semibold">{a.type}</h4>
                      {severityBadge(a.severity)}
                      {statusBadge(a.status)}
                    </div>
                    <p className="text-gray-300 text-sm mt-1">Affected: {a.affected.name}</p>
                    <p className="text-gray-500 text-xs">{relativeTime(a.timestamp)}</p>
                    <p className="text-gray-300 text-sm mt-2">{a.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => setSelected(a)} aria-label="View details">
                    <Eye className="w-4 h-4 mr-1" /> View Details
                  </Button>
                  <Button size="sm" variant="success" onClick={() => onResolve(a.id)} disabled={a.status === 'resolved'} aria-label="Mark as resolved">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Resolve
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => onReport(a.id)} aria-label="Report to authority">
                    <Send className="w-4 h-4 mr-1" /> Report
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" onClick={() => setSelected(null)}></div>
          <div role="dialog" aria-modal="true" aria-label="Fraud Alert Details" className="relative glassmorphism rounded-xl p-6 w-full max-w-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white text-lg font-semibold">Alert Details</h4>
              <span className="text-gray-400 text-sm">{relativeTime(selected.timestamp)}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <strong className="text-gray-300">Type:</strong>
                <span className="text-white">{selected.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <strong className="text-gray-300">Affected:</strong>
                <span className="text-white">{selected.affected.name}</span>
              </div>
              {selected.details.documentSha256 && (
                <div className="flex items-center space-x-2">
                  <strong className="text-gray-300">SHA-256:</strong>
                  <span className="text-white break-all">{selected.details.documentSha256}</span>
                </div>
              )}
              {selected.details.institutionName && (
                <div className="flex items-center space-x-2">
                  <strong className="text-gray-300">Institution:</strong>
                  <span className="text-white">{selected.details.institutionName}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <strong className="text-gray-300">AI Risk Score:</strong>
                <span className="text-white">{selected.details.aiRiskScore}</span>
              </div>
              <div className="flex items-center space-x-2">
                <strong className="text-gray-300">Blockchain Verification:</strong>
                <span className="text-white">{selected.details.blockchainVerification}</span>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="danger" onClick={() => onReport(selected.id)}><Send className="w-4 h-4 mr-1" /> Report</Button>
              <Button variant="success" onClick={() => onResolve(selected.id)} disabled={selected.status === 'resolved'}><CheckCircle2 className="w-4 h-4 mr-1" /> Resolve</Button>
              <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg glassmorphism border ${
            toast.type === 'success' ? 'border-green-700/40 text-green-300' : 'border-red-700/40 text-red-300'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default FraudAlertsPage;


