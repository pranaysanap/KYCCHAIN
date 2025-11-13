import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Eye, AlertCircle, CheckCircle2, XCircle, Hash, FileText, Users, Clock } from 'lucide-react';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import Button from '../../components/common/Button';
import { getUsers, getUserDocuments, verifyDocument, analyzeFraud, updateVerification, getVerificationHistory } from '../../services/mockApi';
import { useAuth } from '../../contexts/AuthContext';

type VerifStatus = 'pending' | 'verified' | 'flagged' | 'all';

const badge = (text: string, color: 'green' | 'red' | 'yellow' | 'blue') => {
  const map: any = {
    green: 'bg-green-900/40 text-green-300 border border-green-700/40',
    red: 'bg-red-900/40 text-red-300 border border-red-700/40',
    yellow: 'bg-yellow-900/40 text-yellow-200 border border-yellow-700/40',
    blue: 'bg-blue-900/40 text-blue-300 border border-blue-700/40'
  };
  return <span className={`px-2 py-1 text-xs rounded-full ${map[color]}`}>{text}</span>;
};

const BankVerificationPage: React.FC = () => {
  const { user } = useAuth();
  const [q, setQ] = useState('');
  const [consent, setConsent] = useState<'all' | 'granted' | 'revoked'>('all');
  const [status, setStatus] = useState<VerifStatus>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Animated summary counters derived from current items
  const totalUsers = items.length;
  const pendingCount = items.filter(i => i.verificationStatus === 'pending').length;
  const verifiedCount = items.filter(i => i.verificationStatus === 'verified').length;
  const flaggedCount = items.filter(i => i.verificationStatus === 'flagged').length;

  const totalUsersAnimated = useAnimatedCounter ? useAnimatedCounter({ end: totalUsers, start: 0, duration: 800 }) : totalUsers;
  const pendingAnimated = useAnimatedCounter ? useAnimatedCounter({ end: pendingCount, start: 0, duration: 800 }) : pendingCount;
  const verifiedAnimated = useAnimatedCounter ? useAnimatedCounter({ end: verifiedCount, start: 0, duration: 800 }) : verifiedCount;
  const flaggedAnimated = useAnimatedCounter ? useAnimatedCounter({ end: flaggedCount, start: 0, duration: 800 }) : flaggedCount;

  useEffect(() => {
    if (user?.role !== 'bank') return; // role gate
    (async () => {
      try {
        setIsLoading(true);
        const resp = await getUsers({ q, consent, status, page, pageSize: 10 });
        setItems(resp.items);
        setTotal(resp.total);
      } catch (e) {
        setToast({ type: 'error', message: 'Failed to load users' });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [q, consent, status, page, user]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const openUser = async (u: any) => {
    setSelected(u);
    try {
      const [d, h] = await Promise.all([
        getUserDocuments(u.id),
        getVerificationHistory(u.id)
      ]);
      setDocs(d);
      setHistory(h);
    } catch {
      setDocs([]);
      setHistory([]);
    }
  };

  const runVerify = async (docId: string) => {
    try {
      const [bc, ai] = await Promise.all([
        verifyDocument(selected!.id, docId),
        analyzeFraud(selected!.id, docId)
      ]);
      setDocs(prev => prev.map(d => d.documentId === docId ? { ...d, _verify: bc, _ai: ai } : d));
      setToast({ type: 'success', message: 'Analysis complete' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Verification failed' });
    }
  };

  const decide = async (decision: 'verified' | 'flagged') => {
    try {
      await updateVerification(selected!.id, decision as any);
      setSelected((s: any) => ({ ...s, verificationStatus: decision, lastUpdated: new Date().toISOString() }));
      setItems(prev => prev.map(i => i.id === selected!.id ? { ...i, verificationStatus: decision, lastUpdated: new Date().toISOString() } : i));
      setToast({ type: 'success', message: decision === 'verified' ? 'User approved' : 'User flagged' });
    } catch (e: any) {
      setToast({ type: 'error', message: e?.message || 'Update failed' });
    }
  };

  if (user?.role !== 'bank') {
    return (
      <div className="glassmorphism rounded-xl p-6 text-red-300 border border-red-700/40">
        Access restricted. Bank role required.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl p-6 backdrop-blur-md border border-white/6 bg-gradient-to-br from-indigo-900/12 to-slate-900/6">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">User Verification</h1>
            <p className="text-gray-300">Verify customer KYC documents with blockchain-backed integrity and AI fraud detection</p>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -6 }} className="rounded-xl p-4 flex items-center justify-between bg-gradient-to-br from-indigo-900/30 to-cyan-800/12 border border-white/6">
          <div>
            <p className="text-sm text-gray-400">Total Users</p>
            <p className="text-xl font-bold text-white">{Math.round(totalUsersAnimated)}</p>
          </div>
          <div className="p-2 bg-white/5 rounded-lg">
            <Users className="w-6 h-6 text-blue-300" />
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -6 }} className="rounded-xl p-4 flex items-center justify-between bg-gradient-to-br from-yellow-900/20 to-amber-800/8 border border-white/6">
          <div>
            <p className="text-sm text-gray-400">Pending</p>
            <p className="text-xl font-bold text-yellow-400">{Math.round(pendingAnimated)}</p>
          </div>
          <div className="p-2 bg-white/5 rounded-lg">
            <Clock className="w-6 h-6 text-yellow-300" />
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -6 }} className="rounded-xl p-4 flex items-center justify-between bg-gradient-to-br from-green-900/20 to-emerald-800/8 border border-white/6">
          <div>
            <p className="text-sm text-gray-400">Verified</p>
            <p className="text-xl font-bold text-green-400">{Math.round(verifiedAnimated)}</p>
          </div>
          <div className="p-2 bg-white/5 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-green-300" />
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -6 }} className="rounded-xl p-4 flex items-center justify-between bg-gradient-to-br from-red-900/20 to-rose-800/8 border border-white/6">
          <div>
            <p className="text-sm text-gray-400">Flagged</p>
            <p className="text-xl font-bold text-red-400">{Math.round(flaggedAnimated)}</p>
          </div>
          <div className="p-2 bg-white/5 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-300" aria-label="Flagged" />
          </div>
        </motion.div>
      </div>

      {/* Search & Filters */}
      <div className="glassmorphism rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={q}
              onChange={e => { setPage(1); setQ(e.target.value); }}
              placeholder="Search by name, email, or user ID"
              className="w-full bg-gray-900/70 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Search users"
            />
          </div>
          <select value={consent} onChange={e => { setPage(1); setConsent(e.target.value as any); }} className="bg-gray-900/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600" aria-label="Filter by consent">
            <option value="all">All Consents</option>
            <option value="granted">Granted</option>
            <option value="revoked">Revoked</option>
          </select>
          <select value={status} onChange={e => { setPage(1); setStatus(e.target.value as VerifStatus); }} className="bg-gray-900/70 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600" aria-label="Filter by status">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="glassmorphism rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Users</h3>
        </div>
        {isLoading ? (
          <div className="p-6 text-gray-300">Loading...</div>
        ) : (
          <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto">
            <table className="w-full min-w-[720px] md:min-w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Consent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Verification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {items.map(u => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 text-gray-300">{u.id}</td>
                    <td className="px-6 py-4 text-white">{u.fullName}</td>
                    <td className="px-6 py-4">{u.consentStatus === 'granted' ? badge('Granted', 'green') : badge('Revoked', 'red')}</td>
                    <td className="px-6 py-4">
                      {u.verificationStatus === 'pending' && badge('Pending', 'yellow')}
                      {u.verificationStatus === 'verified' && badge('Verified', 'green')}
                      {u.verificationStatus === 'flagged' && badge('Flagged', 'red')}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{new Date(u.lastUpdated).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" variant="secondary" onClick={() => openUser(u)} disabled={u.consentStatus !== 'granted'} aria-label="View user">
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      {u.consentStatus !== 'granted' && <AlertCircle className="w-4 h-4 text-red-400 ml-2 inline" aria-label="Consent revoked" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
          <span className="text-gray-400 text-sm">Total: {total}</span>
          <div className="space-x-2">
            <Button size="sm" variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
            <Button size="sm" variant="ghost" onClick={() => setPage(p => p + 1)} disabled={page * 10 >= total}>Next</Button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" onClick={() => setSelected(null)}></div>
          <div role="dialog" aria-modal="true" aria-label="User Verification Details" className="relative glassmorphism rounded-xl p-4 md:p-6 w-full max-w-full md:max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-white text-xl font-semibold">{selected.fullName}</h4>
                <p className="text-gray-400 text-sm">{selected.email}</p>
              </div>
              <div className="space-x-2">
                <Button variant="success" onClick={() => decide('verified')} disabled={selected.verificationStatus === 'verified'}><CheckCircle2 className="w-4 h-4 mr-1" /> Approve</Button>
                <Button variant="danger" onClick={() => decide('flagged')} disabled={selected.verificationStatus === 'flagged'}><XCircle className="w-4 h-4 mr-1" /> Flag</Button>
              </div>
            </div>

            {/* Consent Banner */}
            {selected.consentStatus !== 'granted' ? (
              <div className="glassmorphism rounded-lg p-4 border border-red-700/40 text-red-300 mb-4">Access Denied: Consent revoked</div>
            ) : null}

            {/* Documents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glassmorphism rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h5 className="text-white font-semibold">Documents</h5>
                </div>
                <div className="space-y-3">
                  {docs.map(d => (
                    <div key={d.documentId} className="p-3 rounded-lg bg-gray-900/50 border border-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium capitalize">{d.type}</div>
                          <div className="text-gray-400 text-sm">SHA-256: <span className="text-gray-300">{d.sha256}</span></div>
                          <div className="text-gray-400 text-sm flex items-center">Tx: <span className="text-gray-300 ml-1">{d.blockchainTx?.slice(0, 16)}...</span></div>
                        </div>
                        <div className="space-x-2">
                          <Button size="sm" variant="secondary" onClick={() => runVerify(d.documentId)} aria-label="Verify document"><Hash className="w-4 h-4 mr-1" /> Verify</Button>
                        </div>
                      </div>
                      {d._verify && (
                        <div className="mt-2 text-sm">
                          {d._verify.result === 'match' ? badge('Hash Match – Verified', 'green') : badge('Hash Mismatch – Potential Tampering', 'red')}
                        </div>
                      )}
                      {d._ai && (
                        <div className="mt-2 text-sm">
                          {d._ai.status === 'safe' && badge(`AI Score ${d._ai.score}% – Safe`, 'green')}
                          {d._ai.status === 'suspicious' && badge(`AI Score ${d._ai.score}% – Suspicious`, 'yellow')}
                          {d._ai.status === 'fraud' && badge(`AI Score ${d._ai.score}% – Fraud`, 'red')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* History */}
              <div className="glassmorphism rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <h5 className="text-white font-semibold">Verification History</h5>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Admin</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {history.map((h: any) => (
                        <tr key={h.id}>
                          <td className="px-4 py-2 text-gray-300">{new Date(h.date).toLocaleString()}</td>
                          <td className="px-4 py-2 text-white">{h.admin}</td>
                          <td className="px-4 py-2 text-gray-300 capitalize">{h.action}</td>
                          <td className="px-4 py-2 text-gray-300">{h.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div role="status" className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg glassmorphism border ${toast.type === 'success' ? 'border-green-700/40 text-green-300' : 'border-red-700/40 text-red-300'}`}>{toast.message}</div>
      )}
    </div>
  );
};

export default BankVerificationPage;


