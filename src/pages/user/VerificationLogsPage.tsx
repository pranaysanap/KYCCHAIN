import React, { useEffect, useMemo, useState } from 'react';
import { Blocks, Search, Calendar, Copy, AlertTriangle } from 'lucide-react';
import Button from '../../components/common/Button';
import { getVerificationLogs, getLogDetails } from '../../services/mockApi';
import { useAuth } from '../../contexts/AuthContext';

const badge = (text: string, tone: 'green' | 'yellow' | 'red' | 'blue') => {
  const map: any = {
    green: 'bg-green-900/40 text-green-300 border border-green-700/40',
    yellow: 'bg-yellow-900/40 text-yellow-200 border border-yellow-700/40',
    red: 'bg-red-900/40 text-red-300 border border-red-700/40',
    blue: 'bg-blue-900/40 text-blue-300 border border-blue-700/40'
  };
  return <span className={`px-2 py-1 text-xs rounded-full ${map[tone]}`}>{text}</span>;
};

function rel(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const VerificationLogsPage: React.FC = () => {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [action, setAction] = useState<'all' | 'consent_granted' | 'consent_revoked' | 'approved' | 'flagged' | 'upload' | 'fraud_alert'>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (user?.role !== 'bank') return;
    (async () => {
      try {
        setIsLoading(true);
        const resp = await getVerificationLogs({ q, action, from: from || undefined, to: to || undefined, page, pageSize: 10 });
        setItems(resp.items);
        setTotal(resp.total);
      } catch {
        setToast({ type: 'error', message: 'Failed to load logs' });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [q, action, from, to, page, user]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const openDetails = async (logId: string) => {
    try {
      const data = await getLogDetails(logId);
      setSelected(data);
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Failed to load details' });
    }
  };

  if (user?.role !== 'bank') {
    return (
      <div className="glassmorphism rounded-xl p-6 text-red-300 border border-red-700/40">Access restricted. Bank role required.</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glassmorphism rounded-xl p-6">
        <div className="flex items-center space-x-2">
          <Blocks className="w-6 h-6 text-yellow-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Verification Logs</h1>
            <p className="text-gray-300">Immutable record of all verification and consent events</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glassmorphism rounded-xl p-4"> <p className="text-sm text-gray-400">Total Verifications</p> <p className="text-2xl font-bold text-white">{items.filter(i => i.action === 'approved').length}</p> </div>
        <div className="glassmorphism rounded-xl p-4"> <p className="text-sm text-gray-400">Approved Users</p> <p className="text-2xl font-bold text-white">{items.filter(i => i.action === 'approved').length}</p> </div>
        <div className="glassmorphism rounded-xl p-4"> <p className="text-sm text-gray-400">Fraud Flags</p> <p className="text-2xl font-bold text-white">{items.filter(i => i.action === 'fraud_alert' || i.action === 'flagged').length}</p> </div>
        <div className="glassmorphism rounded-xl p-4"> <p className="text-sm text-gray-400">Consent Revoked</p> <p className="text-2xl font-bold text-white">{items.filter(i => i.action === 'consent_revoked').length}</p> </div>
      </div>

      {/* Filters */}
      <div className="glassmorphism rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={e => { setPage(1); setQ(e.target.value); }} placeholder="Search by user/admin" className="w-full bg-gray-900/70 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <select value={action} onChange={e => { setPage(1); setAction(e.target.value as any); }} className="bg-gray-900/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option value="all">All Actions</option>
            <option value="consent_granted">Consent Granted</option>
            <option value="consent_revoked">Consent Revoked</option>
            <option value="approved">Approved</option>
            <option value="flagged">Flagged</option>
            <option value="upload">Upload</option>
            <option value="fraud_alert">Fraud Alert</option>
          </select>
          <div className="relative">
            <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="date" value={from} onChange={e => { setPage(1); setFrom(e.target.value); }} className="w-full bg-gray-900/70 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <div className="relative">
            <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="date" value={to} onChange={e => { setPage(1); setTo(e.target.value); }} className="w-full bg-gray-900/70 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glassmorphism rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Logs</h3>
        </div>
        {isLoading ? (
          <div className="p-6 text-gray-300">Loading logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tx Hash</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {items.map(l => (
                  <tr key={l.id} className="hover:bg-gray-800/40 transition-colors cursor-pointer" onClick={() => openDetails(l.id)}>
                    <td className="px-6 py-4 text-gray-300" title={new Date(l.ts).toLocaleString()}>{rel(l.ts)}</td>
                    <td className="px-6 py-4 text-white">{l.userId} • {l.userName}</td>
                    <td className="px-6 py-4 text-gray-300 capitalize">{l.docType || '-'}</td>
                    <td className="px-6 py-4">
                      {l.action === 'approved' && badge('Verified', 'green')}
                      {l.action === 'flagged' && badge('Flagged Fraud', 'red')}
                      {l.action === 'consent_granted' && badge('Consent Granted', 'green')}
                      {l.action === 'consent_revoked' && badge('Consent Revoked', 'yellow')}
                      {l.action === 'upload' && badge('Upload', 'blue')}
                      {l.action === 'fraud_alert' && badge('Fraud Alert', 'red')}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{l.admin}</td>
                    <td className="px-6 py-4 text-blue-300">
                      <span title={l.tx}>{l.tx.slice(0, 12)}...</span>
                      <button className="ml-2 text-blue-400 hover:text-blue-300" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(l.tx); }} aria-label="Copy tx">
                        <Copy className="w-4 h-4 inline" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {l.status === 'success' && badge('Success', 'green')}
                      {l.status === 'warning' && badge('Warning', 'yellow')}
                      {l.status === 'critical' && badge('Critical', 'red')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
          <span className="text-gray-400 text-sm">Total: {total}</span>
          <div className="space-x-2">
            <Button size="sm" variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
            <Button size="sm" variant="ghost" onClick={() => setPage(p => p + 1)} disabled={page * 10 >= total}>Next</Button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" onClick={() => setSelected(null)}></div>
          <div role="dialog" aria-modal="true" aria-label="Log Details" className="relative glassmorphism rounded-xl p-6 w-full max-w-2xl">
            <h4 className="text-white text-lg font-semibold mb-3">Log Details</h4>
            <div className="space-y-2 text-sm">
              <div className="text-gray-300">Timestamp: <span className="text-white">{new Date(selected.ts).toLocaleString()}</span></div>
              <div className="text-gray-300">User: <span className="text-white">{selected.user.id} • {selected.user.name}</span></div>
              <div className="text-gray-300">Email: <span className="text-white">{selected.user.email}</span></div>
              <div className="text-gray-300">Document SHA-256: <span className="text-white break-all">{selected.document.sha256}</span></div>
              <div className="text-gray-300">Tx: <span className="text-white break-all">{selected.document.tx}</span></div>
              <div className="text-gray-300">Action: <span className="text-white capitalize">{selected.action.replace('_', ' ')}</span></div>
              {selected.fraud && (
                <div className="text-gray-300">Fraud: <span className="text-white">{selected.fraud.score}% • {selected.fraud.flags.join(', ')}</span></div>
              )}
              <div className="text-gray-300">Explorer: <a href={selected.etherscan} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">View</a></div>
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div role="status" className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg glassmorphism border ${toast.type === 'success' ? 'border-green-700/40 text-green-300' : 'border-red-700/40 text-red-300'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default VerificationLogsPage;



